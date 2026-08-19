from rest_framework import generics, viewsets, status, serializers, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from django.contrib.auth.models import User
from django.contrib.auth.models import User as UserModel
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode 
from django.utils.encoding import force_bytes
from django.core.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .filters import ProductoFilter
from django.conf import settings
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from .permissions import IsAdminUser
from .models import (
    Producto, 
    Categoria, 
    Favorito, 
    Carrito, 
    Direccion, 
    Orden, 
    OrdenItem,
    Direccion,
    PaymentProcessed,
    Material,
    )
from .serializers import (
    ProductoListSerializer, 
    ProductoDetailSerializer, 
    CategoriaSerializer, 
    UserSerializer, 
    RegisterSerializer, 
    FavoritoSerializer, 
    CarritoSerializer,
    OrdenSerializer,
    DireccionSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    ContactFormSerializer,
    AdminProductoSerializer,
    AdminCategoriaSerializer,
    AdminOrdenSerializer,
    AdminImagenProductoSerializer,
    DashboardSerializer,
    AdminLoginSerializer,
    AdminMaterialSerializer,
    )
from django.db.models import F, Sum, Count, Q

from .email_service import (
    enviar_correo_confirmacion_orden, 
    enviar_correo_nueva_orden_admin, 
    enviar_correo_password_reset, 
    enviar_correo_contacto, 
    enviar_correo_confirmacion_mercadopago,
    enviar_correo_orden_cancelada_admin,
    )

from .mercado_pago_service import MercadoPagoService
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import json


class ProductoListView(generics.ListAPIView):
    serializer_class = ProductoListSerializer
    
    # ✅ OPTIMIZACIÓN: Precarga la categoría y las imágenes
    queryset = Producto.objects.filter(es_activo=True).select_related(
        'categoria'
    ).prefetch_related(
        'imagenes'  # Precarga todas las imágenes
    )

    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_class = ProductoFilter
    search_fields = ['nombre', 'descripcion', 'materiales__nombre', 'categoria__nombre']
    
class ProductoDetailView(generics.RetrieveAPIView):
    queryset = Producto.objects.filter(es_activo=True)
    serializer_class = ProductoDetailSerializer
    lookup_field = 'slug'


class CategoriaListView(generics.ListAPIView):
    queryset = Categoria.objects.filter(activo=True)
    serializer_class = CategoriaSerializer

class ProductosPorCategoriaView(generics.ListAPIView):
    serializer_class = ProductoListSerializer

    def get_queryset(self):
        categoria_slug = self.kwargs['slug']
        return Producto.objects.filter(es_activo=True, categoria__slug=categoria_slug)

class UserProfileView(generics.RetrieveUpdateAPIView):

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class FavoritoViewSet(viewsets.ModelViewSet):
    serializer_class = FavoritoSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']
    def get_queryset(self):
        return Favorito.objects.filter(usuario=self.request.user)

class CarritoViewSet(viewsets.ModelViewSet):
    serializer_class = CarritoSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        return Carrito.objects.filter(usuario=self.request.user)
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class DireccionViewSet(viewsets.ModelViewSet):
    serializer_class = DireccionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Direccion.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class OrdenListCreateView(generics.ListCreateAPIView):
    """
    Vista para que un usuario pueda:
    - Listar sus propias órdenes (GET)
    - Crear una nueva orden (POST - Checkout)
    """
    serializer_class = OrdenSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Para el método GET (Listar), asegura que el usuario
        solo vea sus propias órdenes.
        """
        queryset = Orden.objects.filter(usuario=self.request.user).order_by('-fecha_creacion')
        
        payment_id = self.request.query_params.get('mercado_pago_payment_id')
        if payment_id:
            queryset = queryset.filter(mercado_pago_payment_id=payment_id)
        
        return queryset

    @transaction.atomic
    def perform_create(self, serializer):
        """
        Para el método POST (Crear), ejecuta la lógica del checkout.
        Sobreescribimos perform_create en lugar de create para
        aprovechar la gestión de la vista genérica.
        """
        usuario = self.request.user
        items_carrito = Carrito.objects.filter(usuario=usuario)
        
        if not items_carrito.exists():
            raise serializers.ValidationError({"error": "Tu carrito está vacío."})

        direccion_id = self.request.data.get('direccion_id')
        metodo_pago = self.request.data.get('metodo_pago')

        if not direccion_id or not metodo_pago:
            raise serializers.ValidationError({"error": "La dirección de envío y el método de pago son requeridos."})
        
        try:
            direccion = Direccion.objects.get(id=direccion_id, usuario=usuario)
        except Direccion.DoesNotExist:
            raise serializers.ValidationError({"error": "La dirección especificada no es válida o no te pertenece."})

        total_orden = 0
        cantidad_total_items = 0
        
        for item in items_carrito:
            if item.cantidad > item.producto.stock:
                raise serializers.ValidationError(
                    {"error": f"Stock insuficiente para '{item.producto.nombre}'. Disponible: {item.producto.stock}"}
                )
            precio = item.producto.precio_oferta or item.producto.precio_unitario
            total_orden += item.cantidad * precio
            cantidad_total_items += item.cantidad
        
        nueva_orden = serializer.save(
            usuario=usuario,
            direccion=direccion,
            total=total_orden,
            metodo_pago=metodo_pago,
            cantidad_compra=cantidad_total_items
        )
        nueva_orden.direccion_snapshot = {
            'nombres': direccion.nombres,
            'apellidos': direccion.apellidos,
            'dni': direccion.dni,
            'telefono': direccion.telefono,
            'departamento': direccion.departamento,
            'provincia': direccion.provincia,
            'distrito': direccion.distrito,
            'direccion_completo': direccion.direccion_completo,
            'agencia_recojo': direccion.agencia_recojo,
            'direccion_agencia': direccion.direccion_agencia,
            'latitud': str(direccion.latitud) if direccion.latitud else None,
            'longitud': str(direccion.longitud) if direccion.longitud else None,
        }
        nueva_orden.save()

        for item in items_carrito:
            precio = item.producto.precio_oferta or item.producto.precio_unitario
            OrdenItem.objects.create(
                orden=nueva_orden,
                producto=item.producto,
                cantidad=item.cantidad,
                precio_unitario=precio,
                precio_total=item.cantidad * precio
            )
            item.producto.stock -= item.cantidad
            item.producto.save()
            
        items_carrito.delete()
        enviar_correo_confirmacion_orden(nueva_orden)
        enviar_correo_nueva_orden_admin(nueva_orden, self.request)

class OrdenDetailView(generics.RetrieveAPIView):
    serializer_class = OrdenSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Orden.objects.filter(usuario=self.request.user)


class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetRequestSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña."},
                status=status.HTTP_200_OK
            )

        token_generator = PasswordResetTokenGenerator()
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        enviar_correo_password_reset(request, user, token, uid)

        return Response(
            {"detail": "Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña."},
            status=status.HTTP_200_OK
        )

class PasswordResetConfirmView(generics.GenericAPIView):
    """
    Vista para confirmar y establecer una nueva contraseña.
    Recibe uid, token, y la nueva contraseña.
    """
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request, uidb64, token, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = serializer.validated_data['password']

        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist, ValidationError):
            return Response(
                {"error": "El enlace de restablecimiento es inválido o ha expirado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        token_generator = PasswordResetTokenGenerator()
        if not token_generator.check_token(user, token):
            return Response(
                {"error": "El enlace de restablecimiento es inválido o ha expirado."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.save()

        return Response(
            {"detail": "Tu contraseña ha sido restablecida exitosamente."},
            status=status.HTTP_200_OK
        )


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client

    @property
    def callback_url(self):
        return settings.FRONTEND_URL

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if hasattr(self, 'user') and self.user:
            refresh = RefreshToken.for_user(self.user)
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        
        return response

class ContactFormView(generics.GenericAPIView):
    """
    Vista para manejar los envíos del formulario de contacto.
    """
    permission_classes = [AllowAny]
    serializer_class = ContactFormSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        name = serializer.validated_data.get('name')
        email = serializer.validated_data.get('email')
        phone = serializer.validated_data.get('phone', '')
        subject = serializer.validated_data.get('subject')
        message = serializer.validated_data.get('message')

        enviar_correo_contacto(name, email, phone, subject, message)

        return Response(
            {"detail": "Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto."},
            status=status.HTTP_200_OK
        )
        
        
class ProductosDestacadosView(generics.ListAPIView):
    """
    Lista productos marcados como destacados (es_destacado=True).
    """
    serializer_class = ProductoListSerializer
    queryset = Producto.objects.filter(
        es_activo=True, 
        es_destacado=True
    ).select_related('categoria').prefetch_related('imagenes').order_by('-fecha_creacion')


class ProductosEnOfertaView(generics.ListAPIView):
    """
    Lista productos que tienen un precio_oferta definido y menor al precio_unitario.
    """
    serializer_class = ProductoListSerializer
    queryset = Producto.objects.filter(
        es_activo=True,
        precio_oferta__isnull=False,
        precio_oferta__lt=F('precio_unitario')
    ).select_related('categoria').prefetch_related('imagenes').order_by('-fecha_actualizacion')


class CrearPreferenciaPagoView(generics.GenericAPIView):
    """
    Vista para crear una preferencia de pago en Mercado Pago.
    IMPORTANTE: NO crea la orden todavía, solo la preferencia.
    La orden se creará cuando el webhook confirme el pago.
    """
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            usuario = request.user
            
            items_carrito = Carrito.objects.filter(usuario=usuario)
            if not items_carrito.exists():
                return Response(
                    {"error": "Tu carrito está vacío."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            direccion_id = request.data.get('direccion_id')
            
            if not direccion_id:
                return Response(
                    {"error": "Debes proporcionar una dirección de envío."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                direccion = Direccion.objects.get(id=direccion_id, usuario=usuario)
            except Direccion.DoesNotExist:
                return Response(
                    {"error": "La dirección especificada no es válida."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            total_orden = 0
            cantidad_total_items = 0
            
            for item in items_carrito:
                if item.cantidad > item.producto.stock:
                    return Response(
                        {"error": f"Stock insuficiente para '{item.producto.nombre}'. Disponible: {item.producto.stock}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                precio = item.producto.precio_oferta or item.producto.precio_unitario
                total_orden += item.cantidad * precio
                cantidad_total_items += item.cantidad
            
            print("🔵 Iniciando creación de preferencia en Mercado Pago...")
            
            mp_service = MercadoPagoService()
            
            import time
            timestamp = int(time.time())
            external_reference = f"mp_{usuario.id}_{direccion_id}_{timestamp}"
            
            orden_data = {
                'total': total_orden,
                'direccion_id': direccion_id,
                'external_reference': external_reference,
            }
            
            preference_response = mp_service.crear_preferencia_pago(
                orden_data=orden_data,
                usuario=usuario,
                items_carrito=items_carrito,
                request=request
            )
            
            print(f"🔵 Respuesta de MP: {preference_response}")
            
            if preference_response["status"] == 201:
                preference_id = preference_response["response"]["id"]
                init_point = preference_response["response"]["init_point"]
                
                
                print(f"✅ Preferencia creada: {preference_id}")
                print(f"⏳ La orden se creará cuando se confirme el pago")
                
                return Response({
                    "preference_id": preference_id,
                    "init_point": init_point,
                    "external_reference": external_reference,
                }, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {"error": "Error al crear la preferencia de pago en Mercado Pago."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            import traceback
            print("=" * 80)
            print("❌ ERROR COMPLETO EN CREAR PREFERENCIA:")
            print(traceback.format_exc())
            print("=" * 80)
            
            return Response(
                {"error": f"Error al procesar el pago: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class MercadoPagoWebhookView(APIView):
    """
    Vista para recibir notificaciones de Mercado Pago (Webhook).
    MP nos notifica cuando un pago es procesado.
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        try:
            data = request.data if request.data else json.loads(request.body)
            
            print(f"🔔 WEBHOOK RECIBIDO - Headers: {request.headers}")
            print(f"🔔 WEBHOOK RECIBIDO - GET params: {request.GET}")
            print(f"📩 Webhook recibido de Mercado Pago: {data}")
            
            tipo_notificacion = data.get("type") or request.GET.get("topic")
            
            if tipo_notificacion == "payment":
                payment_id = data.get("data", {}).get("id") or request.GET.get("id") or request.GET.get("data.id")
                
                if not payment_id:
                    return Response({"status": "payment_id no encontrado"}, status=status.HTTP_400_BAD_REQUEST)
                
                # Obtener información del pago desde MP
                mp_service = MercadoPagoService()
                payment_info = mp_service.obtener_informacion_pago(payment_id)
                
                if payment_info["status"] == 200:
                    payment_data = payment_info["response"]
                    
                    external_reference = payment_data.get("external_reference")
                    payment_status = payment_data.get("status")
                    status_detail = payment_data.get("status_detail")
                    
                    print(f"💳 Pago {payment_id} - Estado: {payment_status} - Reference: {external_reference}")
                    
                    # Solo procesar si el pago fue aprobado
                    if payment_status == "approved":
                                                
                        # Usar transacción atómica con lock para evitar duplicados
                        with transaction.atomic():
                            # Intentar crear un registro de payment procesado
                            # Si ya existe, lanzará IntegrityError
                            try:
                                # Esto crea el registro o devuelve el existente
                                payment_record, created = PaymentProcessed.objects.get_or_create(
                                    payment_id=str(payment_id),
                                    defaults={'processed_at': timezone.now()}
                                )
                                
                                if not created:
                                    # Ya existe, significa que otro webhook ya procesó este pago
                                    print(f"⚠️ Pago {payment_id} ya fue procesado previamente. Ignorando webhook duplicado.")
                                    return Response({"status": "pago ya procesado"}, status=status.HTTP_200_OK)
                                
                                print(f"🔒 Lock adquirido para payment_id: {payment_id}")
                                
                            except Exception as e:
                                print(f"⚠️ Error al verificar payment procesado: {e}. Ignorando webhook.")
                                return Response({"status": "error verificando pago"}, status=status.HTTP_200_OK)
                            
                            # Extraer datos del external_reference
                            # Formato: "mp_{usuario_id}_{direccion_id}_{timestamp}"
                            if not external_reference or not external_reference.startswith("mp_"):
                                print(f"⚠️ External reference inválido: {external_reference}")
                                return Response({"status": "external_reference inválido"}, status=status.HTTP_400_BAD_REQUEST)
                            
                            try:
                                parts = external_reference.split("_")
                                usuario_id = int(parts[1])
                                direccion_id = int(parts[2])
                            except (IndexError, ValueError) as e:
                                print(f"❌ Error parseando external_reference: {e}")
                                return Response({"status": "error parseando reference"}, status=status.HTTP_400_BAD_REQUEST)
                            
                            # Obtener usuario y dirección
                            try:
                                from django.contrib.auth.models import User
                                usuario = User.objects.get(id=usuario_id)
                                direccion = Direccion.objects.get(id=direccion_id, usuario=usuario)
                            except (User.DoesNotExist, Direccion.DoesNotExist):
                                print(f"❌ Usuario o dirección no encontrados")
                                return Response({"status": "usuario/dirección no encontrados"}, status=status.HTTP_404_NOT_FOUND)
                            
                            # Obtener items del carrito
                            items_carrito = Carrito.objects.filter(usuario=usuario)
                            
                            if not items_carrito.exists():
                                print(f"⚠️ El carrito está vacío para el usuario {usuario_id}")
                                return Response({"status": "carrito vacío"}, status=status.HTTP_400_BAD_REQUEST)
                            
                            # Calcular total
                            total_orden = 0
                            cantidad_total_items = 0
                            
                            for item in items_carrito:
                                precio = item.producto.precio_oferta or item.producto.precio_unitario
                                total_orden += item.cantidad * precio
                                cantidad_total_items += item.cantidad
                            
                            # CREAR LA ORDEN AHORA
                            nueva_orden = Orden.objects.create(
                                usuario=usuario,
                                direccion=direccion,
                                total=total_orden,
                                metodo_pago=Orden.MetodoPago.MERCADO_PAGO,
                                estado_pago=Orden.EstadoPago.PAGADO,  # Ya está pagado
                                cantidad_compra=cantidad_total_items,
                                mercado_pago_payment_id=str(payment_id),
                                mercado_pago_status=payment_status,
                                mercado_pago_status_detail=status_detail,
                            )
                            nueva_orden.direccion_snapshot = {
                                'nombres': direccion.nombres,
                                'apellidos': direccion.apellidos,
                                'dni': direccion.dni,
                                'telefono': direccion.telefono,
                                'departamento': direccion.departamento,
                                'provincia': direccion.provincia,
                                'distrito': direccion.distrito,
                                'direccion_completo': direccion.direccion_completo,
                                'agencia_recojo': direccion.agencia_recojo,
                                'direccion_agencia': direccion.direccion_agencia,
                                'latitud': str(direccion.latitud) if direccion.latitud else None,
                                'longitud': str(direccion.longitud) if direccion.longitud else None,
                            }
                            nueva_orden.save()
                            
                            # Asociar la orden al payment_record
                            payment_record.orden = nueva_orden
                            payment_record.save()
                            
                            # Crear items de la orden
                            for item in items_carrito:
                                precio = item.producto.precio_oferta or item.producto.precio_unitario
                                OrdenItem.objects.create(
                                    orden=nueva_orden,
                                    producto=item.producto,
                                    cantidad=item.cantidad,
                                    precio_unitario=precio,
                                    precio_total=item.cantidad * precio
                                )
                                
                                # Descontar stock
                                producto = item.producto
                                producto.stock -= item.cantidad
                                producto.save()
                            
                            # Limpiar carrito
                            items_carrito.delete()
                            
                            print(f"✅ Orden #{nueva_orden.numero_orden} creada y marcada como PAGADA")
                            
                            # Enviar correos (específico para Mercado Pago)
                            from .email_service import enviar_correo_confirmacion_mercadopago
                            enviar_correo_confirmacion_mercadopago(nueva_orden)
                            enviar_correo_nueva_orden_admin(nueva_orden, request)
                    
                    elif payment_status == "rejected":
                        print(f"❌ Pago {payment_id} rechazado. No se crea orden.")
                        # No crear orden si el pago fue rechazado
                        
                    elif payment_status == "pending":
                        print(f"⏳ Pago {payment_id} pendiente. Esperando confirmación.")
                        # No crear orden hasta que se confirme
                
                return Response({"status": "ok"}, status=status.HTTP_200_OK)
                
            return Response({"status": "ok"}, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"❌ Error en webhook de Mercado Pago: {e}")
            import traceback
            traceback.print_exc()
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# =============================================
# VISTAS PARA EL PANEL DE ADMINISTRACIÓN
# =============================================

# --- Dashboard con métricas ---
class AdminDashboardView(generics.GenericAPIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        from .models import Producto, Orden
        from django.db.models.functions import TruncMonth
        from django.utils import timezone
        import calendar
        from decimal import Decimal

        hoy = timezone.now()
        mes_actual = hoy.month
        anio_actual = hoy.year
        dias_transcurridos = hoy.day
        dias_totales_mes = calendar.monthrange(anio_actual, mes_actual)[1]

        # --- Métricas generales ---
        total_ordenes = Orden.objects.count()
        ordenes_pendientes = Orden.objects.filter(estado_orden='pendiente').count()
        ordenes_enviadas = Orden.objects.filter(estado_orden='enviado').count()
        ordenes_entregadas = Orden.objects.filter(estado_orden='entregado').count()

        ingresos_totales = Orden.objects.aggregate(
            total=Sum('total')
        )['total'] or 0

        ingresos_pagados = Orden.objects.filter(
            estado_pago='pagado'
        ).aggregate(total=Sum('total'))['total'] or 0

        total_productos = Producto.objects.filter(es_activo=True).count()
        productos_sin_stock = Producto.objects.filter(es_activo=True, stock=0).count()
        total_usuarios = UserModel.objects.filter(is_staff=False).count()

        ordenes_recientes = Orden.objects.select_related(
            'usuario', 'direccion'
        ).prefetch_related('items__producto').order_by('-fecha_creacion')[:10]

        # --- Ingresos por mes (últimos 6 meses) ---
        seis_meses_atras = hoy - timezone.timedelta(days=180)

        ingresos_por_mes_qs = (
            Orden.objects
            .filter(fecha_creacion__gte=seis_meses_atras)
            .annotate(mes=TruncMonth('fecha_creacion'))
            .values('mes')
            .annotate(
                ingresos=Sum('total'),
                ordenes=Count('id')
            )
            .order_by('mes')
        )

        ingresos_por_mes = [
            {
                'mes': item['mes'].strftime('%Y-%m'),
                'ingresos': item['ingresos'] or Decimal('0.00'),
                'ordenes': item['ordenes'],
            }
            for item in ingresos_por_mes_qs
        ]

        # --- Estimación del mes actual ---
        # Ingresos y órdenes reales del mes actual
        ingresos_mes_actual = Orden.objects.filter(
            fecha_creacion__year=anio_actual,
            fecha_creacion__month=mes_actual
        ).aggregate(
            ingresos=Sum('total'),
            ordenes=Count('id')
        )
        ingresos_reales = ingresos_mes_actual['ingresos'] or Decimal('0.00')
        ordenes_reales = ingresos_mes_actual['ordenes'] or 0

        # Ingresos y órdenes del mes anterior
        if mes_actual == 1:
            mes_anterior = 12
            anio_anterior = anio_actual - 1
        else:
            mes_anterior = mes_actual - 1
            anio_anterior = anio_actual

        ingresos_mes_anterior = Orden.objects.filter(
            fecha_creacion__year=anio_anterior,
            fecha_creacion__month=mes_anterior
        ).aggregate(
            ingresos=Sum('total'),
            ordenes=Count('id')
        )
        ingresos_anterior = ingresos_mes_anterior['ingresos'] or Decimal('0.00')
        ordenes_anterior = ingresos_mes_anterior['ordenes'] or 0
        dias_mes_anterior = calendar.monthrange(anio_anterior, mes_anterior)[1]

        # Lógica de estimación según los 3 casos
        tiene_datos_mes_actual = ordenes_reales > 0
        tiene_datos_mes_anterior = ordenes_anterior > 0

        if not tiene_datos_mes_actual and not tiene_datos_mes_anterior:
            # Caso 1: sin datos en ningún mes
            estimacion_ingresos = Decimal('0.00')
            estimacion_ordenes = 0
            tiene_datos_suficientes = False

        elif tiene_datos_mes_actual and not tiene_datos_mes_anterior:
            # Caso 2: solo hay datos del mes actual
            promedio_diario_ingresos = ingresos_reales / dias_transcurridos
            promedio_diario_ordenes = ordenes_reales / dias_transcurridos
            estimacion_ingresos = promedio_diario_ingresos * dias_totales_mes
            estimacion_ordenes = round(promedio_diario_ordenes * dias_totales_mes)
            tiene_datos_suficientes = True

        else:
            # Caso 3: hay datos de ambos meses — promedio ponderado
            promedio_diario_actual_ingresos = ingresos_reales / dias_transcurridos if dias_transcurridos > 0 else Decimal('0.00')
            promedio_diario_anterior_ingresos = ingresos_anterior / dias_mes_anterior

            promedio_diario_actual_ordenes = ordenes_reales / dias_transcurridos if dias_transcurridos > 0 else 0
            promedio_diario_anterior_ordenes = ordenes_anterior / dias_mes_anterior

            promedio_combinado_ingresos = (promedio_diario_actual_ingresos + promedio_diario_anterior_ingresos) / 2
            promedio_combinado_ordenes = (promedio_diario_actual_ordenes + promedio_diario_anterior_ordenes) / 2

            estimacion_ingresos = promedio_combinado_ingresos * dias_totales_mes
            estimacion_ordenes = round(promedio_combinado_ordenes * dias_totales_mes)
            tiene_datos_suficientes = True

        estimacion_mes_actual = {
            'mes': hoy.strftime('%Y-%m'),
            'ingresos_reales': ingresos_reales,
            'ordenes_reales': ordenes_reales,
            'dias_transcurridos': dias_transcurridos,
            'dias_totales_mes': dias_totales_mes,
            'estimacion_ingresos': round(estimacion_ingresos, 2),
            'estimacion_ordenes': estimacion_ordenes,
            'tiene_datos_suficientes': tiene_datos_suficientes,
        }

        data = {
            'total_ordenes': total_ordenes,
            'ordenes_pendientes': ordenes_pendientes,
            'ordenes_enviadas': ordenes_enviadas,
            'ordenes_entregadas': ordenes_entregadas,
            'ingresos_totales': ingresos_totales,
            'ingresos_pagados': ingresos_pagados,
            'total_productos': total_productos,
            'productos_sin_stock': productos_sin_stock,
            'total_usuarios': total_usuarios,
            'ordenes_recientes': AdminOrdenSerializer(
                ordenes_recientes, many=True, context={'request': request}
            ).data,
            'ingresos_por_mes': ingresos_por_mes,
            'estimacion_mes_actual': estimacion_mes_actual,
        }

        return Response(data, status=status.HTTP_200_OK)


# --- CRUD de Productos ---
class AdminProductoListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminProductoSerializer

    def get_queryset(self):
        return Producto.objects.select_related('categoria').prefetch_related(
            'imagenes', 'materiales'
        ).order_by('-fecha_creacion')


class AdminProductoDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminProductoSerializer

    def get_queryset(self):
        return Producto.objects.select_related('categoria').prefetch_related(
            'imagenes', 'materiales'
        )


# --- Gestión de imágenes de producto ---
class AdminImagenProductoView(generics.CreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminImagenProductoSerializer

    def perform_create(self, serializer):
        producto_id = self.kwargs['producto_id']
        producto = get_object_or_404(Producto, id=producto_id)
        serializer.save(producto=producto)


class AdminImagenProductoUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminImagenProductoSerializer

    def get_queryset(self):
        from .models import ImagenProducto
        return ImagenProducto.objects.filter(
            producto_id=self.kwargs['producto_id']
        )

    def perform_update(self, serializer):
        from .models import ImagenProducto
        if serializer.validated_data.get('es_principal', False):
            ImagenProducto.objects.filter(
                producto_id=self.kwargs['producto_id']
            ).update(es_principal=False)
        serializer.save()


# --- CRUD de Categorías ---
class AdminCategoriaListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminCategoriaSerializer
    queryset = Categoria.objects.all().order_by('-fecha_creacion')


class AdminCategoriaDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminCategoriaSerializer
    queryset = Categoria.objects.all()


# --- Gestión de Órdenes ---
class AdminOrdenListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminOrdenSerializer

    def get_queryset(self):
        queryset = Orden.objects.select_related(
            'usuario', 'direccion'
        ).prefetch_related('items__producto').order_by('-fecha_creacion')

        estado_orden = self.request.query_params.get('estado_orden')
        estado_pago = self.request.query_params.get('estado_pago')
        metodo_pago = self.request.query_params.get('metodo_pago')

        if estado_orden:
            queryset = queryset.filter(estado_orden=estado_orden)
        if estado_pago:
            queryset = queryset.filter(estado_pago=estado_pago)
        if metodo_pago:
            queryset = queryset.filter(metodo_pago=metodo_pago)

        return queryset


class AdminOrdenDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminOrdenSerializer
    def get_queryset(self):
        return Orden.objects.select_related(
            'usuario', 'direccion'
        ).prefetch_related('items__producto')
    def perform_update(self, serializer):
        orden_anterior = self.get_object()
        estado_orden_anterior = orden_anterior.estado_orden
        orden_actualizada = serializer.save()
        # Si el admin acaba de cambiar el estado_orden a 'cancelado'
        # y antes NO estaba cancelado → enviar correo de cancelación por admin
        if (
            orden_actualizada.estado_orden == 'cancelado' and
            estado_orden_anterior != 'cancelado'
        ):
            enviar_correo_orden_cancelada_admin(orden_actualizada)


# --- Lista de Usuarios ---
class AdminUsuarioListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = UserSerializer

    def get_queryset(self):
        return UserModel.objects.filter(
            is_staff=False
        ).order_by('-date_joined')

class AdminLoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = AdminLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        }, status=status.HTTP_200_OK)

# --- CRUD de Materiales ---
class AdminMaterialListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminMaterialSerializer
    queryset = Material.objects.all().order_by('-fecha_creacion')


class AdminMaterialDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminMaterialSerializer
    queryset = Material.objects.all()
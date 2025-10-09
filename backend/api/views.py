from rest_framework import generics, viewsets, status, serializers, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode 
from django.utils.encoding import force_bytes
from django.core.exceptions import ValidationError
from .filters import ProductoFilter
from django.conf import settings
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import (
    Producto, 
    Categoria, 
    Favorito, 
    Carrito, 
    Direccion, 
    Orden, 
    OrdenItem,
    Direccion
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
    )

from .email_service import enviar_correo_confirmacion_orden, enviar_correo_nueva_orden_admin, enviar_correo_password_reset, enviar_correo_contacto

class ProductoListView(generics.ListAPIView):
    queryset = Producto.objects.filter(es_activo=True)
    serializer_class = ProductoListSerializer

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
        return Orden.objects.filter(usuario=self.request.user).order_by('-fecha_creacion')

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
        subject = serializer.validated_data.get('subject')
        message = serializer.validated_data.get('message')

        enviar_correo_contacto(name, email, subject, message)

        return Response(
            {"detail": "Mensaje enviado exitosamente. Nos pondremos en contacto contigo pronto."},
            status=status.HTTP_200_OK
        )
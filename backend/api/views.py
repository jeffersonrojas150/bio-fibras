from rest_framework import generics, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from django.contrib.auth.models import User
from .models import Producto, Categoria, Favorito, Carrito, Direccion, Orden, OrdenItem
from .serializers import (
    ProductoListSerializer, 
    ProductoDetailSerializer, 
    CategoriaSerializer, 
    UserSerializer, 
    RegisterSerializer, 
    FavoritoSerializer, 
    CarritoSerializer,
    OrdenSerializer,
    )

class ProductoListView(generics.ListAPIView):
    queryset = Producto.objects.filter(es_activo=True)
    serializer_class = ProductoListSerializer
    
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

class UserProfileView(generics.RetrieveAPIView):

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

class OrdenCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        usuario = request.user
        items_carrito = Carrito.objects.filter(usuario=usuario)
        
        if not items_carrito.exists():
            return Response({"error": "Tu carrito está vacío."}, status=status.HTTP_400_BAD_REQUEST)

        direccion_id = request.data.get('direccion_id')
        metodo_pago = request.data.get('metodo_pago')

        if not direccion_id or not metodo_pago:
            return Response({"error": "La dirección de envío y el método de pago son requeridos."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            direccion = Direccion.objects.get(id=direccion_id, usuario=usuario)
        except Direccion.DoesNotExist:
            return Response({"error": "La dirección especificada no es válida o no te pertenece."}, status=status.HTTP_400_BAD_REQUEST)

        total_orden = 0
        cantidad_total_items = 0
        
        for item in items_carrito:
            producto = item.producto
            if item.cantidad > producto.stock:
                return Response(
                    {"error": f"Stock insuficiente para '{producto.nombre}'. Disponible: {producto.stock}, Solicitado: {item.cantidad}."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            precio = producto.precio_oferta or producto.precio_unitario
            total_orden += item.cantidad * precio
            cantidad_total_items += item.cantidad
        
        nueva_orden = Orden.objects.create(
            usuario=usuario,
            direccion=direccion,
            total=total_orden,
            metodo_pago=metodo_pago,
            cantidad_compra=cantidad_total_items
        )

        for item in items_carrito:
            producto = item.producto
            precio = producto.precio_oferta or producto.precio_unitario
            
            OrdenItem.objects.create(
                orden=nueva_orden,
                producto=producto,
                cantidad=item.cantidad,
                precio_unitario=precio,
                precio_total=item.cantidad * precio
            )
            
            producto.stock -= item.cantidad
            producto.save()
            
        items_carrito.delete()
        
        serializer = OrdenSerializer(nueva_orden)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


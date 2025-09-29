from rest_framework import generics, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Producto, Categoria, Favorito, Carrito
from .serializers import (
    ProductoListSerializer, 
    ProductoDetailSerializer, 
    CategoriaSerializer, 
    UserSerializer, 
    RegisterSerializer, 
    FavoritoSerializer, 
    CarritoSerializer
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
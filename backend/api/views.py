from rest_framework import generics
from .models import Producto
from .serializers import ProductoListSerializer, ProductoDetailSerializer

# =================================================================
# VISTA PARA LA LISTA DE PRODUCTOS (GET /api/productos/)
# =================================================================
class ProductoListView(generics.ListAPIView):
    """
    Vista para listar todos los productos que están activos en la tienda.
    Utiliza el serializer de lista para mostrar solo la información esencial.
    La paginación se aplicará globalmente a esta vista.
    """
    queryset = Producto.objects.filter(es_activo=True)
    
    serializer_class = ProductoListSerializer
    
class ProductoDetailView(generics.RetrieveAPIView):
    """
    Vista para ver los detalles de un único producto, identificado por su slug.
    Solo muestra productos que están activos.
    """
    queryset = Producto.objects.filter(es_activo=True)
    serializer_class = ProductoDetailSerializer
    lookup_field = 'slug'

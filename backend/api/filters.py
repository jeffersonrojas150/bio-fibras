import django_filters
from .models import Producto

class ProductoFilter(django_filters.FilterSet):
    
    precio_min = django_filters.NumberFilter(field_name="precio_unitario", lookup_expr='gte')
    precio_max = django_filters.NumberFilter(field_name="precio_unitario", lookup_expr='lte')

    categoria = django_filters.CharFilter(field_name='categoria__slug', lookup_expr='iexact')

    material = django_filters.CharFilter(field_name='materiales__nombre', lookup_expr='iexact')

    class Meta:
        model = Producto
        fields = ['categoria', 'material', 'precio_min', 'precio_max']
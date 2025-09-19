from rest_framework import serializers
from .models import Producto, Categoria, Material, ImagenProducto

class ProductoListSerializer(serializers.ModelSerializer):
    """
    Serializer para la lista de productos.
    Muestra solo la información esencial para el catálogo.
    """
    categoria = serializers.StringRelatedField()
    imagen_principal = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = [
            'id',
            'nombre',
            'slug',
            'precio_unitario',
            'precio_oferta',
            'categoria',
            'imagen_principal',
        ]
        
    def get_imagen_principal(self, obj):
        imagen = ImagenProducto.objects.filter(producto=obj, es_principal=True).first()
        if imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(imagen.imagen.url)
            return imagen.imagen.url
        return None

class ImagenProductoSerializer(serializers.ModelSerializer):
    """Serializer para mostrar las imágenes de un producto."""
    class Meta:
        model = ImagenProducto
        fields = ['imagen', 'es_principal']

class ProductoDetailSerializer(serializers.ModelSerializer):
    """
    Serializer para la vista de detalle de un producto.
    Muestra toda la información relevante, incluyendo imágenes y materiales.
    """
    categoria = serializers.StringRelatedField()
    materiales = serializers.StringRelatedField(many=True)
    
    imagenes = ImagenProductoSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        exclude = ['es_activo', 'es_destacado', 'fecha_creacion', 'fecha_actualizacion']
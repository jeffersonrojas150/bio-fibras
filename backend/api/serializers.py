from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Producto, Categoria, Material, ImagenProducto

class ProductoListSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = ImagenProducto
        fields = ['imagen', 'es_principal']

class ProductoDetailSerializer(serializers.ModelSerializer):
    categoria = serializers.StringRelatedField()
    materiales = serializers.StringRelatedField(many=True)
    
    imagenes = ImagenProductoSerializer(many=True, read_only=True)

    class Meta:
        model = Producto
        exclude = ['es_activo', 'es_destacado', 'fecha_creacion', 'fecha_actualizacion']

class CategoriaSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = Categoria
        fields = ['nombre', 'slug', 'imagen_url']

    def get_imagen_url(self, obj):
        if obj.imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        return None

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password2'] # <-- CAMPOS AÑADIDOS
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
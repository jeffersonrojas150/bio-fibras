from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Producto, 
    Categoria, 
    Material, 
    ImagenProducto, 
    Favorito,
    Carrito,
    Orden,
    OrdenItem,
    Direccion
    )

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
            'precio_mayor',
            'cantidad_minima_mayor',
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
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password2']
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

class FavoritoSerializer(serializers.ModelSerializer):
    producto = ProductoListSerializer(read_only=True)
    
    producto_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Favorito
        fields = ['id', 'producto', 'producto_id', 'fecha_agregado']

    def create(self, validated_data):
        producto_id = validated_data.pop('producto_id')
        
        usuario = self.context['request'].user

        favorito, created = Favorito.objects.get_or_create(usuario=usuario, producto_id=producto_id)
        
        return favorito

class CarritoSerializer(serializers.ModelSerializer):
    producto = ProductoListSerializer(read_only=True)
    producto_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Carrito
        fields = ['id', 'producto', 'producto_id', 'cantidad', 'subtotal', 'fecha_agregado']

    def get_subtotal(self, obj):
        precio = obj.producto.precio_oferta or obj.producto.precio_unitario
        return obj.cantidad * precio

    def validate(self, data):
        if 'producto_id' in data:
            producto = Producto.objects.get(id=data['producto_id'])
            
            if data['cantidad'] > producto.stock:
                raise serializers.ValidationError(
                    f"La cantidad solicitada ({data['cantidad']}) supera el stock disponible ({producto.stock})."
                )
        return data

    def create(self, validated_data):
        usuario = self.context['request'].user
        producto_id = validated_data['producto_id']
        cantidad_a_anadir = validated_data['cantidad']

        item_carrito, created = Carrito.objects.get_or_create(
            usuario=usuario,
            producto_id=producto_id,
            defaults={'cantidad': 0}
        )
        
        item_carrito.cantidad += cantidad_a_anadir
        
        if item_carrito.cantidad > item_carrito.producto.stock:
             raise serializers.ValidationError(
                f"Añadir {cantidad_a_anadir} unidades supera el stock disponible ({item_carrito.producto.stock})."
            )

        item_carrito.save()
        return item_carrito

class OrdenItemSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.SerializerMethodField()
    producto_imagen = serializers.SerializerMethodField()

    class Meta:
        model = OrdenItem
        fields = ['id', 'producto_nombre', 'producto_imagen', 'cantidad', 'precio_unitario', 'precio_total']

    def get_producto_nombre(self, obj):
        return obj.producto.nombre if obj.producto else "Producto Eliminado"

    def get_producto_imagen(self, obj):
        if obj.producto:
            imagen_principal = obj.producto.imagenes.filter(es_principal=True).first()
            if imagen_principal:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(imagen_principal.imagen.url)
                return imagen_principal.imagen.url
        return None

class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = [
            'id', 'usuario', 'nombres', 'apellidos', 'dni', 'telefono', 
            'departamento', 'provincia', 'distrito', 'direccion_completo', 
            'agencia_recojo', 'direccion_agencia', 'es_principal', 
            'fecha_creacion'
        ]
        extra_kwargs = {
            'usuario': {'read_only': True}
        }

class OrdenSerializer(serializers.ModelSerializer):
    items = OrdenItemSerializer(many=True, read_only=True)
    
    usuario = serializers.StringRelatedField(read_only=True)

    direccion = DireccionSerializer(read_only=True) 

    direccion_id = serializers.IntegerField(write_only=True, source='direccion')

    class Meta:
        model = Orden
        fields = [
            'id', 'usuario', 'direccion', 'total', 'metodo_pago', 'numero_orden',
            'estado_pago', 'estado_orden', 'cantidad_compra', 
            'fecha_creacion', 'items', 'direccion', 'direccion_id'
        ]

        read_only_fields = ['total', 'cantidad_compra', 'usuario']


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    class Meta:
        fields = ['email']

class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer para la confirmación del restablecimiento de contraseña.
    Valida que las dos contraseñas coincidan.
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label="Confirm Password")

    class Meta:
        fields = ['password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return data

class ContactFormSerializer(serializers.Serializer):
    """
    Serializer para el formulario de contacto.
    Valida los datos de entrada del formulario.
    """
    name = serializers.CharField(max_length=100, required=True)
    email = serializers.EmailField(required=True)
    subject = serializers.CharField(max_length=150, required=True)
    message = serializers.CharField(required=True)

    class Meta:
        fields = ['name', 'email', 'subject', 'message']
from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Sum, Count
from django.contrib.auth import authenticate
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
        for imagen in obj.imagenes.all():
            if imagen.es_principal:
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
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']

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
        if 'producto_id' in data and 'cantidad' in data:
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
            'agencia_recojo', 'direccion_agencia', 'latitud', 'longitud', 
            'es_principal', 'fecha_creacion'
        ]
        extra_kwargs = {
            'usuario': {'read_only': True}
        }

class OrdenSerializer(serializers.ModelSerializer):
    items = OrdenItemSerializer(many=True, read_only=True)
    
    usuario = serializers.StringRelatedField(read_only=True)

    direccion = serializers.SerializerMethodField()
    direccion_id = serializers.IntegerField(write_only=True, source='direccion')

    class Meta:
        model = Orden
        fields = [
            'id', 'usuario', 'direccion', 'total', 'metodo_pago', 'numero_orden',
            'estado_pago', 'estado_orden', 'cantidad_compra',
            'fecha_creacion', 'items', 'direccion_id',
            'comprobante_envio'
        ]
        read_only_fields = ['total', 'cantidad_compra', 'usuario']

    def get_direccion(self, obj):
        if obj.direccion:
            return DireccionSerializer(obj.direccion).data
        if obj.direccion_snapshot:
            return obj.direccion_snapshot
        return None


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
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    subject = serializers.CharField(max_length=150, required=True)
    message = serializers.CharField(required=True)

    class Meta:
        fields = ['name', 'email', 'phone', 'subject', 'message']

# =============================================
# SERIALIZERS PARA EL PANEL DE ADMINISTRACIÓN
# =============================================

# --- Gestión de imágenes de producto ---
class AdminImagenProductoSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    class Meta:
        model = ImagenProducto
        fields = ['id', 'imagen', 'imagen_url', 'es_principal', 'orden']

    def get_imagen_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.imagen.url)
        return obj.imagen.url


# --- CRUD completo de productos ---
class AdminProductoSerializer(serializers.ModelSerializer):
    imagenes = AdminImagenProductoSerializer(many=True, read_only=True)
    categoria_nombre = serializers.SerializerMethodField()
    materiales_nombres = serializers.SerializerMethodField()
    slug = serializers.SlugField(required=False)

    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'slug', 'descripcion',
            'precio_unitario', 'precio_oferta', 'precio_mayor',
            'cantidad_minima_mayor', 'stock', 'es_activo',
            'es_destacado', 'categoria', 'categoria_nombre',
            'materiales', 'materiales_nombres',
            'imagenes', 'fecha_creacion', 'fecha_actualizacion',
        ]
    
    def validate_nombre(self, value):
        from django.utils.text import slugify
        slug = slugify(value)
        qs = Producto.objects.filter(slug=slug)
        # En update, excluir la instancia actual
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Ya existe un producto con ese nombre.")
        return value
    
    def create(self, validated_data):
        from django.utils.text import slugify
        validated_data['slug'] = slugify(validated_data['nombre'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        from django.utils.text import slugify
        if 'nombre' in validated_data:
            validated_data['slug'] = slugify(validated_data['nombre'])
        return super().update(instance, validated_data)

    def get_categoria_nombre(self, obj):
        return obj.categoria.nombre if obj.categoria else None

    def get_materiales_nombres(self, obj):
        return [m.nombre for m in obj.materiales.all()]


# --- CRUD de categorías ---
class AdminCategoriaSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()
    total_productos = serializers.SerializerMethodField()
    slug = serializers.SlugField(required=False)

    class Meta:
        model = Categoria
        fields = [
            'id', 'nombre', 'slug', 'imagen', 'imagen_url',
            'activo', 'total_productos',
            'fecha_creacion', 'fecha_actualizacion',
        ]

    def validate_nombre(self, value):
        from django.utils.text import slugify
        slug = slugify(value)
        qs = Categoria.objects.filter(slug=slug)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Ya existe una categoría con ese nombre.")
        return value

    def create(self, validated_data):
        from django.utils.text import slugify
        validated_data['slug'] = slugify(validated_data['nombre'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        from django.utils.text import slugify
        if 'nombre' in validated_data:
            validated_data['slug'] = slugify(validated_data['nombre'])
        return super().update(instance, validated_data)

    def get_imagen_url(self, obj):
        request = self.context.get('request')
        if obj.imagen:
            if request:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        return None

    def get_total_productos(self, obj):
        return obj.productos.filter(es_activo=True).count()


# --- Lista de órdenes para admin (con info completa) ---
class AdminOrdenSerializer(serializers.ModelSerializer):
    items = OrdenItemSerializer(many=True, read_only=True)
    usuario_email = serializers.SerializerMethodField()
    usuario_nombre = serializers.SerializerMethodField()
    direccion = serializers.SerializerMethodField()

    class Meta:
        model = Orden
        fields = [
            'id', 'numero_orden', 'usuario', 'usuario_email',
            'usuario_nombre', 'direccion', 'total', 'metodo_pago',
            'estado_pago', 'estado_orden', 'cantidad_compra',
            'comprobante_pago', 'comprobante_envio',
            'mercado_pago_payment_id', 'mercado_pago_status',
            'fecha_creacion', 'fecha_actualizacion', 'items',
        ]
        read_only_fields = [
            'numero_orden', 'usuario', 'total',
            'cantidad_compra', 'fecha_creacion',
        ]
        
    def get_direccion(self, obj):
        if obj.direccion:
            return DireccionSerializer(obj.direccion).data
        if obj.direccion_snapshot:
            return obj.direccion_snapshot
        return None

    def get_usuario_email(self, obj):
        return obj.usuario.email if obj.usuario else None

    def get_usuario_nombre(self, obj):
        if obj.usuario:
            return f"{obj.usuario.first_name} {obj.usuario.last_name}".strip() or obj.usuario.username
        return None

# --- Login admin ---
class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        
        if not user:
            raise serializers.ValidationError("Credenciales inválidas.")
        
        if not (user.is_staff or user.is_superuser):
            raise serializers.ValidationError("No tienes permisos de administrador.")
        
        data['user'] = user
        return data

# --- Dashboard: métricas generales ---
class IngresosMesSerializer(serializers.Serializer):
    mes = serializers.CharField()
    ingresos = serializers.DecimalField(max_digits=12, decimal_places=2)
    ordenes = serializers.IntegerField()

class EstimacionMesSerializer(serializers.Serializer):
    mes = serializers.CharField()
    ingresos_reales = serializers.DecimalField(max_digits=12, decimal_places=2)
    ordenes_reales = serializers.IntegerField()
    dias_transcurridos = serializers.IntegerField()
    dias_totales_mes = serializers.IntegerField()
    estimacion_ingresos = serializers.DecimalField(max_digits=12, decimal_places=2)
    estimacion_ordenes = serializers.IntegerField()
    tiene_datos_suficientes = serializers.BooleanField()

class DashboardSerializer(serializers.Serializer):
    total_ordenes = serializers.IntegerField()
    ordenes_pendientes = serializers.IntegerField()
    ordenes_enviadas = serializers.IntegerField()
    ordenes_entregadas = serializers.IntegerField()
    ingresos_totales = serializers.DecimalField(max_digits=12, decimal_places=2)
    ingresos_pagados = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_productos = serializers.IntegerField()
    productos_sin_stock = serializers.IntegerField()
    total_usuarios = serializers.IntegerField()
    ordenes_recientes = AdminOrdenSerializer(many=True)
    ingresos_por_mes = IngresosMesSerializer(many=True)
    estimacion_mes_actual = EstimacionMesSerializer()

# --- CRUD de materiales ---
class AdminMaterialSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()
    total_productos = serializers.SerializerMethodField()

    class Meta:
        model = Material
        fields = [
            'id', 'nombre', 'descripcion', 'imagen', 'imagen_url',
            'es_sostenible', 'total_productos',
            'fecha_creacion', 'fecha_actualizacion',
        ]

    def get_imagen_url(self, obj):
        request = self.context.get('request')
        if obj.imagen:
            if request:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        return None

    def get_total_productos(self, obj):
        return obj.productos.filter(es_activo=True).count()
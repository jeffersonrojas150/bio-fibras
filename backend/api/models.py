from django.db import models
from django.conf import settings

# =================================================================
# 🏷️ TABLA: CATEGORIA
# =================================================================
class Categoria(models.Model):
    # ID_categoria es creado automáticamente por Django como 'id' (AutoField)
    nombre = models.CharField(max_length=100, verbose_name="Nombre de la categoría")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="URL Slug")
    imagen = models.ImageField(upload_to='categorias/', null=True, blank=True, verbose_name="Imagen representativa")
    activo = models.BooleanField(default=True, verbose_name="¿Está activa?")
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    def __str__(self):
        return self.nombre

# =================================================================
# 🧵 TABLA: MATERIAL
# =================================================================
class Material(models.Model):
    # ID_material es creado automáticamente por Django como 'id'
    nombre = models.CharField(max_length=100, verbose_name="Nombre del material")
    descripcion = models.TextField(verbose_name="Descripción")
    imagen = models.ImageField(upload_to='materiales/', null=True, blank=True, verbose_name="Foto del material")
    es_sostenible = models.BooleanField(default=False, verbose_name="¿Es sostenible?")
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    def __str__(self):
        return self.nombre

# =================================================================
# 🛍️ TABLA: PRODUCTO
# =================================================================
class Producto(models.Model):
    # ID_producto es creado automáticamente por Django
    nombre = models.CharField(max_length=200, verbose_name="Nombre del producto")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="URL Slug")
    descripcion = models.TextField(verbose_name="Descripción completa")
    
    # Precios - Usamos DecimalField para evitar errores de punto flotante con dinero
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio unitario")
    precio_mayor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Precio al por mayor")
    cantidad_minima_mayor = models.PositiveIntegerField(null=True, blank=True, verbose_name="Cantidad mínima para precio mayor")
    precio_oferta = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Precio de oferta")

    stock = models.PositiveIntegerField(default=0, verbose_name="Cantidad en stock")
    es_activo = models.BooleanField(default=True, verbose_name="¿Está activo en la tienda?")
    es_destacado = models.BooleanField(default=False, verbose_name="¿Es un producto destacado?")
    
    # --- Relaciones (Claves Foráneas y Muchos a Muchos) ---
    
    # Relación 1 a Muchos con Categoria
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True, related_name='productos', verbose_name="Categoría")
    
    # Relación Muchos a Muchos con Material. Django creará la tabla intermedia automáticamente.
    materiales = models.ManyToManyField(Material, blank=True, related_name='productos', verbose_name="Materiales")
    
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    def __str__(self):
        return self.nombre

# =================================================================
# 📸 TABLA: IMAGEN_PRODUCTO
# =================================================================
class ImagenProducto(models.Model):
    # ID_ImagenProducto es creado automáticamente por Django
    
    # Relación 1 a Muchos con Producto. Si se borra el producto, se borran sus imágenes.
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='imagenes', verbose_name="Producto")
    
    imagen = models.ImageField(upload_to='productos/', verbose_name="Archivo de imagen")
    es_principal = models.BooleanField(default=False, verbose_name="¿Es la imagen principal?")
    orden = models.PositiveIntegerField(default=0, verbose_name="Orden de visualización")

    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de subida")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    def __str__(self):
        return f"Imagen de {self.producto.nombre} ({self.id})"


# =================================================================
# 🏠 TABLA: DIRECCION (VERSIÓN CORREGIDA)
# =================================================================
class Direccion(models.Model):
    # ID_direccion es creado automáticamente por Django
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='direcciones', verbose_name="Usuario")
    nombres = models.CharField(max_length=100, verbose_name="Nombres de quien recibe")
    apellidos = models.CharField(max_length=100, verbose_name="Apellidos de quien recibe")
    dni = models.CharField(max_length=8, verbose_name="DNI")
    telefono = models.CharField(max_length=15, verbose_name="Teléfono de contacto")
    departamento = models.CharField(max_length=50)
    provincia = models.CharField(max_length=50)
    distrito = models.CharField(max_length=50)
    direccion_completo = models.TextField(verbose_name="Dirección detallada")
    agencia_recojo = models.TextField(blank=True, verbose_name="Agencia de Recojo (Empresa de envío)")
    direccion_agencia = models.TextField(blank=True, verbose_name="Dirección de la Agencia")
    es_principal = models.BooleanField(default=False, verbose_name="¿Es la dirección principal?")
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dirección de {self.usuario.username}: {self.direccion_completo[:30]}..."

# =================================================================
# 🛒 TABLA: CARRITO
# =================================================================
class Carrito(models.Model):
    # ID_carrito es creado automáticamente por Django
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='carrito_items', verbose_name="Usuario")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, verbose_name="Producto")
    cantidad = models.PositiveIntegerField(default=1, verbose_name="Cantidad")
    fecha_agregado = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        # Esto asegura que un usuario no pueda tener el mismo producto dos veces en el carrito
        # En su lugar, se debería actualizar la cantidad del item existente.
        unique_together = ('usuario', 'producto')

    def __str__(self):
        return f"{self.cantidad} x {self.producto.nombre} en el carrito de {self.usuario.username}"


# =================================================================
# ❤️ TABLA: FAVORITO (Relación Muchos a Muchos entre User y Producto)
# =================================================================
class Favorito(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favoritos', verbose_name="Usuario")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='favoritos_de_usuarios', verbose_name="Producto")
    fecha_agregado = models.DateTimeField(auto_now_add=True, verbose_name="Fecha en que se marcó como favorito")

    class Meta:
        # PK Compuesta: Un usuario solo puede marcar como favorito un producto una sola vez.
        unique_together = ('usuario', 'producto')
        
    def __str__(self):
        return f"{self.producto.nombre} es favorito de {self.usuario.username}"


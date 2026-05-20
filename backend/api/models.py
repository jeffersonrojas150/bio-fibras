from django.db import models
from django.conf import settings
import time, random
from .email_service import enviar_correo_actualizacion_estado, enviar_correo_orden_cancelada, enviar_correo_voucher_disponible
from .utils.image_utils import comprimir_imagen

# =================================================================
# 🏷️ TABLA: CATEGORIA
# =================================================================
class Categoria(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre de la categoría")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="URL Slug")
    imagen = models.ImageField(upload_to='categorias/', null=True, blank=True, verbose_name="Imagen representativa")
    activo = models.BooleanField(default=True, verbose_name="¿Está activa?")
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    def save(self, *args, **kwargs):
        if self.imagen and hasattr(self.imagen, 'file'):
            imagen_comprimida = comprimir_imagen(self.imagen)
            if imagen_comprimida:
                self.imagen = imagen_comprimida
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

# =================================================================
# 🧵 TABLA: MATERIAL
# =================================================================
class Material(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre del material")
    descripcion = models.TextField(verbose_name="Descripción")
    imagen = models.ImageField(upload_to='materiales/', null=True, blank=True, verbose_name="Foto del material")
    es_sostenible = models.BooleanField(default=False, verbose_name="¿Es sostenible?")
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    def save(self, *args, **kwargs):
        if self.imagen and hasattr(self.imagen, 'file'):
            imagen_comprimida = comprimir_imagen(self.imagen)
            if imagen_comprimida:
                self.imagen = imagen_comprimida
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nombre

# =================================================================
# 🛍️ TABLA: PRODUCTO
# =================================================================
class Producto(models.Model):
    nombre = models.CharField(max_length=200, verbose_name="Nombre del producto")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="URL Slug")
    descripcion = models.TextField(verbose_name="Descripción completa")
    
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio unitario")
    precio_mayor = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Precio al por mayor")
    cantidad_minima_mayor = models.PositiveIntegerField(null=True, blank=True, verbose_name="Cantidad mínima para precio mayor")
    precio_oferta = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Precio de oferta")

    stock = models.PositiveIntegerField(default=0, verbose_name="Cantidad en stock")
    es_activo = models.BooleanField(default=True, verbose_name="¿Está activo en la tienda?")
    es_destacado = models.BooleanField(default=False, verbose_name="¿Es un producto destacado?")
    
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True, related_name='productos', verbose_name="Categoría")
    
    materiales = models.ManyToManyField(Material, blank=True, related_name='productos', verbose_name="Materiales")
    
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    def __str__(self):
        return self.nombre

# =================================================================
# 📸 TABLA: IMAGEN_PRODUCTO
# =================================================================
class ImagenProducto(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='imagenes', verbose_name="Producto")
    imagen = models.ImageField(upload_to='productos/', verbose_name="Archivo de imagen")
    es_principal = models.BooleanField(default=False, verbose_name="¿Es la imagen principal?")
    orden = models.PositiveIntegerField(default=0, verbose_name="Orden de visualización")
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de subida")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Fecha de actualización")

    def save(self, *args, **kwargs):
        # Comprimir imagen nueva antes de subir
        if self.imagen and hasattr(self.imagen, 'file'):
            imagen_comprimida = comprimir_imagen(self.imagen)
            if imagen_comprimida:
                self.imagen = imagen_comprimida

        # Lógica existente de imagen principal
        if self.es_principal:
            ImagenProducto.objects.filter(
                producto=self.producto, es_principal=True
            ).exclude(pk=self.pk).update(es_principal=False)

        super().save(*args, **kwargs)


    def __str__(self):
        return f"Imagen de {self.producto.nombre} ({self.id})"


# =================================================================
# 🏠 TABLA: DIRECCION
# =================================================================
class Direccion(models.Model):
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
    latitud = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitud = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    es_principal = models.BooleanField(default=False, verbose_name="¿Es la dirección principal?")
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Dirección de {self.usuario.username}: {self.direccion_completo[:30]}..."

# =================================================================
# 🛒 TABLA: CARRITO
# =================================================================
class Carrito(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='carrito_items', verbose_name="Usuario")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, verbose_name="Producto")
    cantidad = models.PositiveIntegerField(default=1, verbose_name="Cantidad")
    fecha_agregado = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
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
        unique_together = ('usuario', 'producto')
        
    def __str__(self):
        return f"{self.producto.nombre} es favorito de {self.usuario.username}"


# =================================================================
# 🧾 TABLA: ORDEN
# =================================================================
class Orden(models.Model):

    # MODIFICADO: Nuevos métodos de pago incluyendo Mercado Pago
    class MetodoPago(models.TextChoices):
        TRANSFERENCIA = 'transferencia', 'Transferencia Bancaria'
        YAPE = 'yape', 'Yape'
        MERCADO_PAGO = 'mercado_pago', 'Mercado Pago'  # ← NUEVO

    # MODIFICADO: Estados de pago más claros para MP
    class EstadoPago(models.TextChoices):
        PENDIENTE = 'pendiente', 'Pendiente de Pago'  # ← RENOMBRADO
        PAGADO = 'pagado', 'Pagado'
        RECHAZADO = 'rechazado', 'Pago Rechazado'  # ← NUEVO
        CANCELADO = 'cancelado', 'Cancelado'

    class EstadoOrden(models.TextChoices):
        PENDIENTE = 'pendiente', 'Pendiente'
        ENVIADO = 'enviado', 'Enviado'
        ENTREGADO = 'entregado', 'Entregado'
        CANCELADO = 'cancelado', 'Cancelado'

    numero_orden = models.CharField(max_length=20, unique=True, editable=False, verbose_name="Número de Orden")

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='ordenes', verbose_name="Usuario")
    direccion = models.ForeignKey(Direccion, on_delete=models.SET_NULL, null=True, related_name='ordenes', verbose_name="Dirección de envío")
    
    total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Monto total de la compra")
    metodo_pago = models.CharField(max_length=50, choices=MetodoPago.choices, default=MetodoPago.TRANSFERENCIA, verbose_name="Método de pago")
    estado_pago = models.CharField(max_length=50, choices=EstadoPago.choices, default=EstadoPago.PENDIENTE, verbose_name="Estado del pago")  # ← MODIFICADO default
    estado_orden = models.CharField(max_length=50, choices=EstadoOrden.choices, default=EstadoOrden.PENDIENTE, verbose_name="Estado de la orden")
    
    cantidad_compra = models.PositiveIntegerField(verbose_name="Total de productos en la orden")
    comprobante_pago = models.ImageField(upload_to='comprobantes_pago/', null=True, blank=True, verbose_name="Imagen del comprobante de PAGO")
    comprobante_envio = models.ImageField(upload_to='comprobantes_envio/', null=True, blank=True, verbose_name="Imagen del comprobante de ENVÍO")

    # ========== NUEVOS CAMPOS PARA MERCADO PAGO ==========
    mercado_pago_preference_id = models.CharField(
        max_length=100, 
        null=True, 
        blank=True, 
        verbose_name="ID de Preferencia de Mercado Pago",
        help_text="ID de la preferencia de pago creada en Mercado Pago"
    )
    
    mercado_pago_payment_id = models.CharField(
        max_length=100, 
        null=True, 
        blank=True, 
        verbose_name="ID de Pago de Mercado Pago",
        help_text="ID del pago confirmado por Mercado Pago"
    )
    
    mercado_pago_status = models.CharField(
        max_length=50, 
        null=True, 
        blank=True, 
        verbose_name="Estado en Mercado Pago",
        help_text="Estado del pago según Mercado Pago (approved, pending, rejected, etc.)"
    )
    
    mercado_pago_status_detail = models.CharField(
        max_length=100, 
        null=True, 
        blank=True, 
        verbose_name="Detalle del estado MP",
        help_text="Información adicional sobre el estado del pago"
    )
    # =====================================================

    recordatorio_enviado = models.BooleanField(default=False, verbose_name="¿Recordatorio de pago enviado?")
    
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de creación")
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name="Última actualización")

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        estado_anterior = None
        
        if not is_new:
            try:
                estado_anterior = Orden.objects.get(pk=self.pk)
            except Orden.DoesNotExist:
                pass

        if is_new:
            timestamp = int(time.time() * 1000)
            aleatorio = random.randint(10, 99)
            self.numero_orden = f"{timestamp}{aleatorio}"

        super().save(*args, **kwargs)

        if not is_new and estado_anterior:
            hubo_cambio_estado_general = (
                self.estado_pago != estado_anterior.estado_pago or 
                self.estado_orden != estado_anterior.estado_orden
            )
           
            if hubo_cambio_estado_general:
                print("¡El estado de la orden ha cambiado! Decidiendo qué correo enviar...")
                if self.estado_pago == self.EstadoPago.CANCELADO:
                    enviar_correo_orden_cancelada(self)
                else:
                    if not (not estado_anterior.comprobante_envio and self.comprobante_envio):
                         enviar_correo_actualizacion_estado(self)

            if not estado_anterior.comprobante_envio and self.comprobante_envio:
                print(f"¡Se ha subido un nuevo comprobante de envío para la orden #{self.numero_orden}! Enviando correo...")
                enviar_correo_voucher_disponible(self)

    def __str__(self):
        return f"Orden #{self.numero_orden} de {self.usuario.username if self.usuario else 'Usuario Eliminado'}"

# =================================================================
# 📦 TABLA: ORDEN_ITEMS
# =================================================================
class OrdenItem(models.Model):
    orden = models.ForeignKey(Orden, on_delete=models.CASCADE, related_name='items', verbose_name="Orden")
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True, verbose_name="Producto")
    
    cantidad = models.PositiveIntegerField(verbose_name="Cantidad comprada")
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio unitario al comprar")
    precio_total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio total por este item")

    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        nombre_producto = self.producto.nombre if self.producto else "[Producto Eliminado]"
        return f"{self.cantidad} x {nombre_producto} en Orden #{self.orden.id}"
    
class PaymentProcessed(models.Model):
    """
    Modelo para trackear qué payment_ids de Mercado Pago ya fueron procesados.
    Evita crear órdenes duplicadas cuando llegan múltiples webhooks.
    """
    payment_id = models.CharField(max_length=255, unique=True, db_index=True)
    processed_at = models.DateTimeField(auto_now_add=True)
    orden = models.ForeignKey(Orden, on_delete=models.CASCADE, null=True, blank=True)
    
    class Meta:
        db_table = 'api_payment_processed'
        verbose_name = 'Pago Procesado'
        verbose_name_plural = 'Pagos Procesados'
    
    def __str__(self):
        return f"Payment {self.payment_id} - Orden {self.orden.numero_orden if self.orden else 'N/A'}"
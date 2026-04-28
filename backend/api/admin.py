from django.contrib import admin
from django.utils.html import mark_safe
from django.utils.text import slugify
from .models import (
    Categoria, Material, Producto, ImagenProducto,
    OrdenItem, Orden,
    )

# =================================================================
# Inline para gestionar Imágenes directamente dentro de Producto
# =================================================================
class ImagenProductoInline(admin.TabularInline):
    model = ImagenProducto
    extra = 1
    max_num = 5
    verbose_name = "Imagen del producto"
    verbose_name_plural = "Imágenes del producto"
    fields = ('imagen', 'es_principal', 'orden')

# =================================================================
# Personalización del Admin para el modelo Producto
# =================================================================
@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    # --- Configuración de la vista de lista ---
    list_display = ('mostrar_imagen_principal', 'nombre', 'categoria', 'precio_unitario', 'stock', 'es_activo', 'es_destacado')
    list_filter = ('categoria', 'es_activo', 'es_destacado', 'materiales')
    search_fields = ('nombre', 'descripcion')
    readonly_fields = ('mostrar_imagen_principal',)
    list_editable = ('precio_unitario', 'stock', 'es_activo', 'es_destacado')
    
    fieldsets = (
        ('Información Principal', {
            'fields': ('nombre', 'descripcion') 
        }),
        ('Precios y Stock', {
            'fields': ('precio_unitario', 'precio_mayor', 'cantidad_minima_mayor', 'precio_oferta', 'stock')
        }),
        ('Clasificación y Visibilidad', {
            'fields': ('categoria', 'materiales', 'es_activo', 'es_destacado')
        }),
    )
        
    inlines = [ImagenProductoInline]

    def save_model(self, request, obj, form, change):
        base_slug = slugify(obj.nombre)
        slug = base_slug
        
        if not change or slugify(obj.nombre) != obj.slug:
            counter = 1
            while Producto.objects.filter(slug=slug).exclude(pk=obj.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            obj.slug = slug
        
        # Mensaje informativo si el slug fue ajustado
        if obj.slug != base_slug:
            self.message_user(
                request,
                f"Ya existía un producto con un nombre similar. Se guardó con el identificador único: '{obj.slug}'.",
                level='warning'
            )
        
        super().save_model(request, obj, form, change)

    def mostrar_imagen_principal(self, obj):
        imagen_principal = obj.imagenes.filter(es_principal=True).first()
        if imagen_principal:
            return mark_safe(f'<img src="{imagen_principal.imagen.url}" width="75" />')
        return "Sin imagen"
    
    mostrar_imagen_principal.short_description = 'Imagen Principal'


class OrdenItemInline(admin.TabularInline):
    model = OrdenItem
    fields = ['producto', 'precio_unitario', 'cantidad', 'precio_total']
    readonly_fields = ['producto', 'precio_unitario', 'cantidad', 'precio_total']
    extra = 0
    def has_add_permission(self, request, obj=None):
        return False
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'slug', 'activo')
    exclude = ('slug',)

    def save_model(self, request, obj, form, change):
        obj.slug = slugify(obj.nombre)
        super().save_model(request, obj, form, change)


admin.site.register(Material)

@admin.register(Orden)
class OrdenAdmin(admin.ModelAdmin):
    """
    Personalización del panel de administrador para el modelo Orden.
    """
    inlines = [
        OrdenItemInline,
    ]

    list_display = (
        'numero_orden',
        'usuario',
        'fecha_creacion',
        'total',
        'estado_pago',
        'estado_orden'
    )

    list_editable = ('estado_pago', 'estado_orden')

    list_filter = ('estado_pago', 'estado_orden', 'metodo_pago', 'fecha_creacion')

    search_fields = ('numero_orden', 'usuario__username')

    fieldsets = (
        ('Información del Pedido', {
            'fields': ('numero_orden', 'fecha_creacion', 'total', 'metodo_pago')
        }),
        ('Estado y Comprobantes', {
            'fields': ('estado_pago', 'estado_orden', 'comprobante_pago', 'comprobante_envio')
        }),
        ('Información del Cliente', {
            'fields': ('get_usuario_info',)
        }),
        ('Dirección de Envío', {
            'fields': (
                'get_direccion_completa',
                'get_contacto_cliente'
            )
        }),
    )

    readonly_fields = (
        'numero_orden', 'fecha_creacion', 'total', 'metodo_pago',
        'get_usuario_info', 'get_direccion_completa', 'get_contacto_cliente'
    )

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def get_usuario_info(self, obj):
        if obj.usuario:
            nombre_completo = obj.usuario.get_full_name()
            return f"{nombre_completo} ({obj.usuario.username})"
        return "Usuario Eliminado"
    get_usuario_info.short_description = 'Cliente'

    def get_direccion_completa(self, obj):
        if obj.direccion:
            return (
                f"{obj.direccion.direccion_completo}, "
                f"{obj.direccion.distrito}, {obj.direccion.provincia}, "
                f"{obj.direccion.departamento}"
            )
        return "N/A"
    get_direccion_completa.short_description = 'Dirección Completa'

    def get_contacto_cliente(self, obj):
        if obj.direccion:
            return (
                f"Recibe: {obj.direccion.nombres} {obj.direccion.apellidos} | "
                f"DNI: {obj.direccion.dni} | Teléfono: {obj.direccion.telefono}"
            )
        return "N/A"
    get_contacto_cliente.short_description = 'Datos de Contacto'
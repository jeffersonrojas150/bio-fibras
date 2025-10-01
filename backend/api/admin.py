from django.contrib import admin
from django.utils.html import mark_safe
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
    # AÑADIMOS 'mostrar_imagen_principal' AL PRINCIPIO
    list_display = ('mostrar_imagen_principal', 'nombre', 'categoria', 'precio_unitario', 'stock', 'es_activo', 'es_destacado')
    list_filter = ('categoria', 'es_activo', 'es_destacado', 'materiales')
    search_fields = ('nombre', 'descripcion')
    # AÑADIMOS readonly_fields PARA QUE LA FUNCIÓN SE MUESTRE
    readonly_fields = ('mostrar_imagen_principal',)
    # Mantenemos el resto igual...
    list_editable = ('precio_unitario', 'stock', 'es_activo', 'es_destacado')
    
    fieldsets = (
        # ... (los fieldsets se quedan igual) ...
        ('Información Principal', {
            'fields': ('nombre', 'slug', 'descripcion')
        }),
        ('Precios y Stock', {
            'fields': ('precio_unitario', 'precio_mayor', 'cantidad_minima_mayor', 'precio_oferta', 'stock')
        }),
        ('Clasificación y Visibilidad', {
            'fields': ('categoria', 'materiales', 'es_activo', 'es_destacado')
        }),
    )
    
    prepopulated_fields = {'slug': ('nombre',)}
    inlines = [ImagenProductoInline]

    # --- NUEVA FUNCIÓN AÑADIDA ---
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

# =================================================================
# PERSONALIZACIÓN PARA CATEGORIA
# =================================================================
@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'slug', 'activo')
    prepopulated_fields = {'slug': ('nombre',)}

admin.site.register(Material)


# =================================================================
# Personalización del Admin para el modelo Orden
# =================================================================
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
    
    list_filter = ('estado_pago', 'estado_orden', 'metodo_pago', 'fecha_creacion')
    
    search_fields = ('numero_orden', 'usuario__username')

    readonly_fields = (
        'numero_orden', 
        'usuario', 
        'total', 
        'metodo_pago',
        'cantidad_compra',
        'fecha_creacion',
        'fecha_actualizacion'
    )
    
    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

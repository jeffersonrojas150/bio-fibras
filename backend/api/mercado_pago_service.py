import mercadopago
from django.conf import settings
from decimal import Decimal

class MercadoPagoService:
    """
    Servicio para manejar operaciones con Mercado Pago
    """
    
    def __init__(self):
        # Inicializamos el SDK con el Access Token
        self.sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)
    
    def crear_preferencia_pago(self, orden_data, usuario, items_carrito, request):
        """
        Crea una preferencia de pago en Mercado Pago.
        
        Args:
            orden_data: Diccionario con datos de la orden (total, direccion_id, etc.)
            usuario: Usuario que está comprando
            items_carrito: QuerySet de items del carrito
            request: Request de Django para construir URLs
            
        Returns:
            dict: Respuesta de Mercado Pago con preference_id e init_point
        """
        
        # Construimos las URLs de retorno
        base_url = settings.FRONTEND_URL
        
        # Items para Mercado Pago
        items_mp = []
        for item in items_carrito:
            precio = item.producto.precio_oferta or item.producto.precio_unitario
            items_mp.append({
                "title": item.producto.nombre,
                "quantity": item.cantidad,
                "unit_price": float(precio),  # MP requiere float
                "currency_id": "PEN",  # Soles peruanos
            })
        
        # Datos de la preferencia
        preference_data = {
            "items": items_mp,
            "payer": {
                "name": usuario.first_name,
                "surname": usuario.last_name,
                "email": usuario.email,
            },
            "back_urls": {
                "success": f"{base_url}/pago/success",
                "failure": f"{base_url}/pago/failure",
                "pending": f"{base_url}/pago/pending",
            },
            "auto_return": "approved",  # Redirección automática cuando se aprueba
            "notification_url": f"{request.build_absolute_uri('/api/pagos/webhook/')}",  # Webhook para notificaciones
            "statement_descriptor": "BIO-FIBRAS",  # Aparece en el resumen de la tarjeta
            "external_reference": f"pending_{usuario.id}_{orden_data.get('direccion_id')}",  # Referencia temporal
        }
        
        # Creamos la preferencia en Mercado Pago
        preference_response = self.sdk.preference().create(preference_data)
        
        return preference_response
    
    def obtener_informacion_pago(self, payment_id):
        """
        Obtiene información detallada de un pago desde Mercado Pago
        
        Args:
            payment_id: ID del pago en Mercado Pago
            
        Returns:
            dict: Información del pago
        """
        payment_info = self.sdk.payment().get(payment_id)
        return payment_info
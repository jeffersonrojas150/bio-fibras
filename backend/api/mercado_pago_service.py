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
        """
        
        # IMPORTANTE: Usar el FRONTEND_URL para las URLs de retorno
        from django.conf import settings
        base_url = settings.FRONTEND_URL
        
        print(f"🔵 Base URL para retorno: {base_url}")
        
        # Items para Mercado Pago
        items_mp = []
        for item in items_carrito:
            precio = item.producto.precio_oferta or item.producto.precio_unitario
            items_mp.append({
                "title": item.producto.nombre,
                "quantity": item.cantidad,
                "unit_price": float(precio),
                "currency_id": "PEN",
            })
        
        # Datos de la preferencia
        preference_data = {
            "items": items_mp,
            "payer": {
                "name": usuario.first_name or "Cliente",
                "surname": usuario.last_name or "Bio-Fibras",
                "email": usuario.email,
            },
            "back_urls": {
                "success": f"{base_url}/pago/success",
                "failure": f"{base_url}/pago/failure",
                "pending": f"{base_url}/pago/pending",
            },
            "auto_return": "approved",
            "notification_url": f"{request.build_absolute_uri('/api/pagos/webhook')}",
            "statement_descriptor": "BIO-FIBRAS",
            "external_reference": f"pending_{usuario.id}_{orden_data.get('direccion_id')}",
        }
        
        print(f"🔵 Preferencia a enviar: {preference_data}")
        
        # Creamos la preferencia en Mercado Pago
        preference_response = self.sdk.preference().create(preference_data)
        
        print(f"🔵 Respuesta completa de MP: {preference_response}")
        
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
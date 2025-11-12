# api/middleware.py
from django.utils.deprecation import MiddlewareMixin

class DisableAppendSlashForWebhookMiddleware(MiddlewareMixin):
    """
    Middleware que desactiva APPEND_SLASH para la URL del webhook de Mercado Pago.
    Esto evita que Django redirija con 302 y permita que el webhook funcione.
    """
    def process_request(self, request):
        if request.path.startswith('/api/pagos/webhook'):
            # Si la URL es del webhook, no agregar slash
            request.urlconf = None
        return None
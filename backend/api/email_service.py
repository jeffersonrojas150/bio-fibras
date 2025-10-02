from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string # Para usar plantillas HTML

def enviar_correo_confirmacion_orden(orden):
    """
    Envía un correo de confirmación al cliente cuando una orden se crea exitosamente.
    """
    try:
        asunto = f"Confirmación de tu pedido en Bio-Fibras: #{orden.numero_orden}"
        
        contexto = {
            'orden': orden,
            'items': orden.items.all(),
            'usuario': orden.usuario,
        }
        
        mensaje_texto = render_to_string('emails/confirmacion_orden.txt', contexto)
        mensaje_html = render_to_string('emails/confirmacion_orden.html', contexto)

        destinatario = orden.usuario.email
        
        send_mail(
            asunto,
            mensaje_texto,
            settings.DEFAULT_FROM_EMAIL,
            [destinatario],
            fail_silently=False,
            html_message=mensaje_html 
        )
        print(f"Correo de confirmación enviado exitosamente para la orden #{orden.numero_orden}")
        return True

    except Exception as e:
        print(f"ERROR al enviar correo para la orden #{orden.numero_orden}: {e}")
        return False
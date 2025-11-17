from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.urls import reverse
from django.conf import settings

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

def enviar_correo_nueva_orden_admin(orden, request):
    """
    Envía un correo de notificación al administrador cuando se crea una nueva orden.
    """
    try:
        admin_path = reverse('admin:api_orden_change', args=[orden.id])
        admin_url = request.build_absolute_uri(admin_path)

        asunto = f"¡Nueva Venta! Pedido #{orden.numero_orden}"
        
        contexto = {
            'orden': orden,
            'usuario': orden.usuario,
            'admin_url': admin_url, # Pasamos la URL a la plantilla
        }
        
        mensaje_texto = render_to_string('emails/nueva_orden_admin.txt', contexto)
        mensaje_html = render_to_string('emails/nueva_orden_admin.html', contexto)

        destinatario_admin = settings.DEFAULT_FROM_EMAIL

        send_mail(
            asunto,
            mensaje_texto,
            settings.DEFAULT_FROM_EMAIL,
            [destinatario_admin],
            fail_silently=False,
            html_message=mensaje_html
        )
        print(f"Correo de notificación al admin enviado para la orden #{orden.numero_orden}")
        return True

    except Exception as e:
        print(f"ERROR al enviar correo de notificación al admin para la orden #{orden.numero_orden}: {e}")
        return False

def enviar_correo_actualizacion_estado(orden):
    """
    Envía un correo de notificación al cliente cuando el estado de su orden cambia.
    """
    try:
        asunto = f"Actualización de tu pedido #{orden.numero_orden}"
        
        contexto = {
            'orden': orden,
            'usuario': orden.usuario,
            'items': orden.items.all(),
            'frontend_url': settings.FRONTEND_URL,
        }
        
        mensaje_texto = render_to_string('emails/actualizacion_estado.txt', contexto)
        mensaje_html = render_to_string('emails/actualizacion_estado.html', contexto)

        destinatario = orden.usuario.email
        
        send_mail(
            asunto,
            mensaje_texto,
            settings.DEFAULT_FROM_EMAIL,
            [destinatario],
            fail_silently=False,
            html_message=mensaje_html
        )
        print(f"Correo de actualización de estado enviado para la orden #{orden.numero_orden}")
        return True

    except Exception as e:
        print(f"ERROR al enviar correo de actualización de estado para #{orden.numero_orden}: {e}")
        return False

def enviar_correo_password_reset(request, usuario, token, uid):
    """
    Envía un correo al usuario con el enlace para restablecer su contraseña.
    """
    try:
        url_frontend = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

        asunto = "Restablece tu contraseña en Bio-Fibras"
        contexto = {
            'usuario': usuario,
            'reset_url': url_frontend
        }

        mensaje_texto = render_to_string('emails/password_reset.txt', contexto)
        mensaje_html = render_to_string('emails/password_reset.html', contexto)

        send_mail(
            asunto,
            mensaje_texto,
            settings.DEFAULT_FROM_EMAIL,
            [usuario.email],
            fail_silently=False,
            html_message=mensaje_html
        )
        print(f"Correo de restablecimiento de contraseña enviado a {usuario.email}")
        return True

    except Exception as e:
        print(f"ERROR al enviar correo de restablecimiento a {usuario.email}: {e}")
        return False

def enviar_correo_contacto(name, email, subject, message):
    """
    Envía el contenido del formulario de contacto al correo del administrador.
    """
    try:
        admin_email = "bio.fibras.j@gmail.com"
        
        asunto_correo = f"Nuevo Mensaje de Contacto: {subject}"
        
        contexto = {
            'nombre_remitente': name,
            'email_remitente': email,
            'asunto_mensaje': subject,
            'cuerpo_mensaje': message,
        }

        mensaje_texto = render_to_string('emails/contacto.txt', contexto)
        mensaje_html = render_to_string('emails/contacto.html', contexto)

        send_mail(
            asunto_correo,
            mensaje_texto,
            settings.DEFAULT_FROM_EMAIL,
            [admin_email],
            fail_silently=False,
            html_message=mensaje_html
        )
        print(f"Correo de contacto de '{email}' enviado exitosamente a '{admin_email}'.")
        return True

    except Exception as e:
        print(f"ERROR al enviar correo de contacto de '{email}': {e}")
        return False
    
def enviar_correo_recordatorio_pago(orden):
    """
    Envía un correo de recordatorio al cliente si su orden sigue pendiente de pago.
    """
    try:
        asunto = f"Recordatorio de pago para tu pedido #{orden.numero_orden}"
        
        contexto = {
            'orden': orden,
            'usuario': orden.usuario,
        }
    
        mensaje_texto = render_to_string('emails/recordatorio_pago.txt', contexto)
        mensaje_html = render_to_string('emails/recordatorio_pago.html', contexto)

        destinatario = orden.usuario.email
    
        send_mail(
            asunto,
            mensaje_texto,
            settings.DEFAULT_FROM_EMAIL,
            [destinatario],
            fail_silently=False,
            html_message=mensaje_html
        )
        print(f"Correo de recordatorio de pago enviado para la orden #{orden.numero_orden}")
        return True

    except Exception as e:
        print(f"ERROR al enviar correo de recordatorio para la orden #{orden.numero_orden}: {e}")
        return False

def enviar_correo_orden_cancelada(orden):
    """
    Envía un correo de notificación al cliente cuando su orden es cancelada.
    """
    try:
        asunto = f"Tu pedido #{orden.numero_orden} ha sido cancelado"
        
        contexto = {
            'orden': orden,
            'usuario': orden.usuario,
            'frontend_url': settings.FRONTEND_URL
        }
    
        mensaje_texto = render_to_string('emails/orden_cancelada.txt', contexto)
        mensaje_html = render_to_string('emails/orden_cancelada.html', contexto)

        destinatario = orden.usuario.email
    
        send_mail(
            asunto,
            mensaje_texto,
            settings.DEFAULT_FROM_EMAIL,
            [destinatario],
            fail_silently=False,
            html_message=mensaje_html
        )
        print(f"Correo de cancelación de orden enviado para la orden #{orden.numero_orden}")
        return True

    except Exception as e:
        print(f"ERROR al enviar correo de cancelación para la orden #{orden.numero_orden}: {e}")
        return False

def enviar_correo_voucher_disponible(orden):
    """
    Envía un correo al usuario cuando se sube el comprobante de envío.
    """
    try:
        usuario = orden.usuario
        if not usuario:
            print(f"ERROR: La orden #{orden.numero_orden} no tiene un usuario asociado. No se puede enviar correo.")
            return False

        asunto = f"¡Tu pedido #{orden.numero_orden} está en camino!"
        
        contexto = {
            'usuario': usuario,
            'orden': orden,
            'frontend_url': settings.FRONTEND_URL
        }

        mensaje_html = render_to_string('emails/voucher_disponible.html', contexto)

        send_mail(
            asunto,
            '',
            settings.DEFAULT_FROM_EMAIL,
            [usuario.email],
            fail_silently=False,
            html_message=mensaje_html
        )
        print(f"Correo de voucher disponible enviado a {usuario.email}")
        return True

    except Exception as e:
        print(f"ERROR al enviar correo de voucher disponible para la orden #{orden.numero_orden}: {e}")
        return False


def enviar_correo_confirmacion_mercadopago(orden):
    """
    Envía un correo de confirmación específico para pagos con Mercado Pago.
    Este correo indica que el pago ya fue procesado exitosamente.
    """
    try:
        usuario = orden.usuario
        items = orden.items.all()
        
        # Contexto para el template
        contexto = {
            'usuario': usuario,
            'orden': orden,
            'items': items,
        }
        
        # Renderizar el template HTML
        html_message = render_to_string('emails/confirmacion_orden_mercadopago.html', contexto)
        
        # Crear mensaje de correo
        subject = f'¡Pago Confirmado! - Pedido #{orden.numero_orden}'
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [usuario.email]
        
        # Usar send_mail en lugar de EmailMultiAlternatives
        send_mail(
            subject,
            '',  # Mensaje de texto plano (vacío)
            from_email,
            recipient_list,
            fail_silently=False,
            html_message=html_message
        )
        
        print(f"Correo de confirmación de Mercado Pago enviado exitosamente para la orden #{orden.numero_orden}")
        return True
        
    except Exception as e:
        print(f"Error al enviar correo de confirmación de Mercado Pago: {e}")
        import traceback
        traceback.print_exc()
        return False
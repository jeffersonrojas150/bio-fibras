import resend
from django.conf import settings
from django.template.loader import render_to_string
from django.urls import reverse

resend.api_key = settings.RESEND_API_KEY
FROM_EMAIL = "Bio-Fibras <noreply@bio-fibras.com.pe>"

def enviar_correo_confirmacion_orden(orden):
    try:
        contexto = {
            'orden': orden,
            'items': orden.items.all(),
            'usuario': orden.usuario,
        }
        html = render_to_string('emails/confirmacion_orden.html', contexto)
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [orden.usuario.email],
            "subject": f"Confirmación de tu pedido en Bio-Fibras: #{orden.numero_orden}",
            "html": html,
        })
        print(f"Correo de confirmación enviado para la orden #{orden.numero_orden}")
        return True
    except Exception as e:
        print(f"ERROR al enviar correo para la orden #{orden.numero_orden}: {e}")
        return False


def enviar_correo_nueva_orden_admin(orden, request):
    try:
        admin_url = f"https://admin.bio-fibras.com.pe/orders/{orden.id}"
        contexto = {
            'orden': orden,
            'usuario': orden.usuario,
            'admin_url': admin_url,
        }
        html = render_to_string('emails/nueva_orden_admin.html', contexto)
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": ["bio.fibras.j@gmail.com"],
            "subject": f"¡Nueva Venta! Pedido #{orden.numero_orden}",
            "html": html,
        })
        print(f"Correo de notificación al admin enviado para la orden #{orden.numero_orden}")
        return True
    except Exception as e:
        print(f"ERROR al enviar correo al admin para la orden #{orden.numero_orden}: {e}")
        return False


def enviar_correo_actualizacion_estado(orden):
    try:
        contexto = {
            'orden': orden,
            'usuario': orden.usuario,
            'items': orden.items.all(),
            'frontend_url': settings.FRONTEND_URL,
        }
        html = render_to_string('emails/actualizacion_estado.html', contexto)
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [orden.usuario.email],
            "subject": f"Actualización de tu pedido #{orden.numero_orden}",
            "html": html,
        })
        print(f"Correo de actualización de estado enviado para la orden #{orden.numero_orden}")
        return True
    except Exception as e:
        print(f"ERROR al enviar correo de actualización para #{orden.numero_orden}: {e}")
        return False


def enviar_correo_password_reset(request, usuario, token, uid):
    try:
        url_frontend = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
        contexto = {
            'usuario': usuario,
            'reset_url': url_frontend
        }
        html = render_to_string('emails/password_reset.html', contexto)
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [usuario.email],
            "subject": "Restablece tu contraseña en Bio-Fibras",
            "html": html,
        })
        print(f"Correo de restablecimiento enviado a {usuario.email}")
        return True
    except Exception as e:
        print(f"ERROR al enviar correo de restablecimiento a {usuario.email}: {e}")
        return False


def enviar_correo_contacto(name, email, phone, subject, message):
    try:
        contexto = {
            'nombre_remitente': name,
            'email_remitente': email,
            'telefono_remitente': phone,
            'asunto_mensaje': subject,
            'cuerpo_mensaje': message,
        }
        html = render_to_string('emails/contacto.html', contexto)
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": ["bio.fibras.j@gmail.com"],
            "subject": f"Nuevo Mensaje de Contacto: {subject}",
            "html": html,
        })
        print(f"Correo de contacto de '{email}' enviado exitosamente.")
        return True
    except Exception as e:
        print(f"ERROR al enviar correo de contacto de '{email}': {e}")
        return False


def enviar_correo_recordatorio_pago(orden):
    try:
        contexto = {
            'orden': orden,
            'usuario': orden.usuario,
        }
        html = render_to_string('emails/recordatorio_pago.html', contexto)
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [orden.usuario.email],
            "subject": f"Recordatorio de pago para tu pedido #{orden.numero_orden}",
            "html": html,
        })
        print(f"Correo de recordatorio enviado para la orden #{orden.numero_orden}")
        return True
    except Exception as e:
        print(f"ERROR al enviar correo de recordatorio para la orden #{orden.numero_orden}: {e}")
        return False


def enviar_correo_orden_cancelada(orden):
    try:
        contexto = {
            'orden': orden,
            'usuario': orden.usuario,
            'frontend_url': settings.FRONTEND_URL
        }
        html = render_to_string('emails/orden_cancelada.html', contexto)
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [orden.usuario.email],
            "subject": f"Tu pedido #{orden.numero_orden} ha sido cancelado",
            "html": html,
        })
        print(f"Correo de cancelación enviado para la orden #{orden.numero_orden}")
        return True
    except Exception as e:
        print(f"ERROR al enviar correo de cancelación para la orden #{orden.numero_orden}: {e}")
        return False


def enviar_correo_voucher_disponible(orden):
    try:
        usuario = orden.usuario
        if not usuario:
            print(f"ERROR: La orden #{orden.numero_orden} no tiene usuario. No se puede enviar correo.")
            return False
        contexto = {
            'usuario': usuario,
            'orden': orden,
            'frontend_url': settings.FRONTEND_URL
        }
        html = render_to_string('emails/voucher_disponible.html', contexto)
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [usuario.email],
            "subject": f"¡Tu pedido #{orden.numero_orden} está en camino!",
            "html": html,
        })
        print(f"Correo de voucher disponible enviado a {usuario.email}")
        return True
    except Exception as e:
        print(f"ERROR al enviar correo de voucher para la orden #{orden.numero_orden}: {e}")
        return False


def enviar_correo_confirmacion_mercadopago(orden):
    try:
        usuario = orden.usuario
        contexto = {
            'usuario': usuario,
            'orden': orden,
            'items': orden.items.all(),
        }
        html = render_to_string('emails/confirmacion_orden_mercadopago.html', contexto)
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [usuario.email],
            "subject": f"¡Pago Confirmado! - Pedido #{orden.numero_orden}",
            "html": html,
        })
        print(f"Correo de confirmación MP enviado para la orden #{orden.numero_orden}")
        return True
    except Exception as e:
        print(f"ERROR al enviar correo de confirmación MP para la orden #{orden.numero_orden}: {e}")
        import traceback
        traceback.print_exc()
        return False

def enviar_correo_orden_cancelada_admin(orden):
    """
    Correo enviado al usuario cuando el ADMIN cancela manualmente su orden.
    Diferente al de cancelación automática por falta de pago.
    """
    try:
        contexto = {
            'orden': orden,
            'usuario': orden.usuario,
            'items': orden.items.all(),
            'frontend_url': settings.FRONTEND_URL,
        }
        html = render_to_string('emails/orden_cancelada_admin.html', contexto)
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [orden.usuario.email],
            "subject": f"Tu pedido #{orden.numero_orden} ha sido cancelado por nuestro equipo",
            "html": html,
        })
        print(f"Correo de cancelación por admin enviado para la orden #{orden.numero_orden}")
        return True
    except Exception as e:
        print(f"ERROR al enviar correo de cancelación por admin para #{orden.numero_orden}: {e}")
        return False


def enviar_correo_pago_rechazado(orden):
    try:
        contexto = {
            'orden': orden,
            'usuario': orden.usuario,
            'frontend_url': settings.FRONTEND_URL,
        }
        html = render_to_string('emails/pago_rechazado.html', contexto)
        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": [orden.usuario.email],
            "subject": f"Tu comprobante del pedido #{orden.numero_orden} necesita revisión",
            "html": html,
        })
        print(f"Correo de rechazo de pago enviado para la orden #{orden.numero_orden}")
        return True
    except Exception as e:
        print(f"ERROR al enviar correo de rechazo para #{orden.numero_orden}: {e}")
        return False
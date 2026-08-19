from django.contrib.auth.models import User
from django.test import TestCase

from .models import Orden


class OrdenEstadoPagoTest(TestCase):
    def test_en_revision_es_un_estado_de_pago_valido(self):
        self.assertIn(
            ('en_revision', 'En Revisión'),
            Orden.EstadoPago.choices,
        )

    def test_motivo_rechazo_por_defecto_es_vacio(self):
        usuario = User.objects.create_user(username='cliente1', password='x')
        orden = Orden.objects.create(usuario=usuario, total=100, cantidad_compra=1)
        self.assertEqual(orden.motivo_rechazo, '')

    def test_se_puede_guardar_motivo_rechazo(self):
        usuario = User.objects.create_user(username='cliente2', password='x')
        orden = Orden.objects.create(usuario=usuario, total=100, cantidad_compra=1)
        orden.estado_pago = Orden.EstadoPago.RECHAZADO
        orden.motivo_rechazo = 'El monto no coincide con el total del pedido.'
        orden.save()
        orden.refresh_from_db()
        self.assertEqual(orden.estado_pago, 'rechazado')
        self.assertEqual(orden.motivo_rechazo, 'El monto no coincide con el total del pedido.')

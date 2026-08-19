from django.contrib.auth.models import User
from django.test import TestCase

from .models import Orden
from .serializers import OrdenSerializer


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


class OrdenSerializerClienteTest(TestCase):
    def test_estado_pago_no_se_puede_asignar_por_el_cliente_al_crear(self):
        serializer = OrdenSerializer(data={
            'direccion_id': 1,
            'metodo_pago': 'yape',
            'estado_pago': 'pagado',
        })
        serializer.is_valid()
        self.assertNotIn('estado_pago', serializer.validated_data)

    def test_expone_comprobante_pago_y_motivo_rechazo_de_solo_lectura(self):
        usuario = User.objects.create_user(username='cliente4', password='x')
        orden = Orden.objects.create(usuario=usuario, total=100, cantidad_compra=1)
        data = OrdenSerializer(orden).data
        self.assertIn('comprobante_pago', data)
        self.assertIn('motivo_rechazo', data)

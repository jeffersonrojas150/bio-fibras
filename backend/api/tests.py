import io
from unittest.mock import patch

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from PIL import Image
from rest_framework import status
from rest_framework.test import APIClient

from .models import Orden
from .serializers import OrdenSerializer


def _imagen_de_prueba(nombre='comprobante.png'):
    buffer = io.BytesIO()
    Image.new('RGB', (10, 10), color='white').save(buffer, format='PNG')
    buffer.seek(0)
    return SimpleUploadedFile(nombre, buffer.read(), content_type='image/png')


TEST_STORAGES = {
    'default': {'BACKEND': 'django.core.files.storage.InMemoryStorage'},
    'staticfiles': {'BACKEND': 'django.contrib.staticfiles.storage.StaticFilesStorage'},
}


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


@override_settings(STORAGES=TEST_STORAGES)
class SubirComprobantePagoViewTest(TestCase):
    def setUp(self):
        self.cliente = User.objects.create_user(username='dueno', password='x')
        self.otro_usuario = User.objects.create_user(username='otro', password='x')
        self.api = APIClient()
        self.api.force_authenticate(user=self.cliente)

    def _crear_orden(self, **kwargs):
        defaults = dict(usuario=self.cliente, total=100, cantidad_compra=1, metodo_pago='yape')
        defaults.update(kwargs)
        return Orden.objects.create(**defaults)

    def test_sube_comprobante_y_pasa_a_en_revision(self):
        orden = self._crear_orden()
        url = f'/api/ordenes/{orden.id}/comprobante/'
        response = self.api.post(url, {'comprobante_pago': _imagen_de_prueba()}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        orden.refresh_from_db()
        self.assertEqual(orden.estado_pago, 'en_revision')
        self.assertTrue(bool(orden.comprobante_pago))

    def test_no_permite_subir_a_orden_de_otro_usuario(self):
        orden = self._crear_orden(usuario=self.otro_usuario)
        url = f'/api/ordenes/{orden.id}/comprobante/'
        response = self.api.post(url, {'comprobante_pago': _imagen_de_prueba()}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_rechaza_metodo_de_pago_no_elegible(self):
        orden = self._crear_orden(metodo_pago='mercado_pago')
        url = f'/api/ordenes/{orden.id}/comprobante/'
        response = self.api.post(url, {'comprobante_pago': _imagen_de_prueba()}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rechaza_si_ya_esta_pagado(self):
        orden = self._crear_orden(estado_pago='pagado')
        url = f'/api/ordenes/{orden.id}/comprobante/'
        response = self.api.post(url, {'comprobante_pago': _imagen_de_prueba()}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rechaza_sin_archivo(self):
        orden = self._crear_orden()
        url = f'/api/ordenes/{orden.id}/comprobante/'
        response = self.api.post(url, {}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_resubir_tras_rechazo_limpia_motivo_y_vuelve_a_en_revision(self):
        orden = self._crear_orden(estado_pago='rechazado', motivo_rechazo='Monto incorrecto')
        url = f'/api/ordenes/{orden.id}/comprobante/'
        response = self.api.post(url, {'comprobante_pago': _imagen_de_prueba()}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        orden.refresh_from_db()
        self.assertEqual(orden.estado_pago, 'en_revision')
        self.assertEqual(orden.motivo_rechazo, '')


class RechazoPagoEmailTest(TestCase):
    @patch('api.email_service.resend.Emails.send')
    def test_rechazar_pago_envia_correo_dedicado_no_el_generico(self, mock_send):
        usuario = User.objects.create_user(username='cliente5', password='x', email='cliente5@test.com')
        orden = Orden.objects.create(
            usuario=usuario, total=100, cantidad_compra=1, estado_pago='en_revision'
        )
        mock_send.reset_mock()

        orden.estado_pago = Orden.EstadoPago.RECHAZADO
        orden.motivo_rechazo = 'El monto no coincide.'
        orden.save()

        self.assertEqual(mock_send.call_count, 1)
        call_kwargs = mock_send.call_args[0][0]
        self.assertIn('El monto no coincide.', call_kwargs['html'])
        self.assertEqual(call_kwargs['to'], ['cliente5@test.com'])

    @patch('api.email_service.resend.Emails.send')
    def test_en_revision_sigue_usando_correo_generico(self, mock_send):
        usuario = User.objects.create_user(username='cliente6', password='x', email='cliente6@test.com')
        orden = Orden.objects.create(usuario=usuario, total=100, cantidad_compra=1)
        mock_send.reset_mock()

        orden.estado_pago = Orden.EstadoPago.EN_REVISION
        orden.save()

        self.assertEqual(mock_send.call_count, 1)
        call_kwargs = mock_send.call_args[0][0]
        self.assertIn('Actualización de tu pedido', call_kwargs['subject'])

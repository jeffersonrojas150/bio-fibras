from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import Orden, OrdenItem, Producto
from api.email_service import enviar_correo_recordatorio_pago

class Command(BaseCommand):
    help = 'Revisa las órdenes pendientes de pago, envía recordatorios y cancela las órdenes antiguas.'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS(f"--- Iniciando revisión de órdenes pendientes [{timezone.now()}] ---"))
        
        self.send_payment_reminders()

        self.cancel_old_orders()

        self.stdout.write(self.style.SUCCESS("--- Revisión de órdenes completada. ---"))

    def send_payment_reminders(self):
        """
        Busca órdenes pendientes de pago que tienen entre 2 y 3 días de antigüedad
        y les envía un correo de recordatorio si no se ha enviado antes.
        """
        self.stdout.write(self.style.NOTICE("\n[+] Buscando órdenes para enviar recordatorio de pago..."))
        
        tiempo_inicio = timezone.now() - timedelta(days=3)
        tiempo_fin = timezone.now() - timedelta(days=2)

        ordenes_para_recordar = Orden.objects.filter(
            estado_pago=Orden.EstadoPago.PENDIENTE_COMPROBANTE,
            fecha_creacion__range=(tiempo_inicio, tiempo_fin),
            recordatorio_enviado=False
        )

        if not ordenes_para_recordar.exists():
            self.stdout.write("No se encontraron órdenes para enviar recordatorios.")
            return

        self.stdout.write(self.style.SUCCESS(f"Se encontraron {ordenes_para_recordar.count()} órdenes para enviar recordatorio."))
        
        contador_enviados = 0
        for orden in ordenes_para_recordar:
            if enviar_correo_recordatorio_pago(orden):
                orden.recordatorio_enviado = True
                orden.save(update_fields=['recordatorio_enviado'])
                contador_enviados += 1
        
        self.stdout.write(self.style.SUCCESS(f"Se enviaron {contador_enviados} recordatorios exitosamente."))

    def cancel_old_orders(self):
        """
        Busca órdenes pendientes de pago con más de 3 días de antigüedad,
        las cancela y restaura el stock de los productos.
        """
        self.stdout.write(self.style.NOTICE("\n[+] Buscando órdenes antiguas para cancelar..."))
        
        limite_de_tiempo = timezone.now() - timedelta(days=3)

        ordenes_a_cancelar = Orden.objects.filter(
            estado_pago=Orden.EstadoPago.PENDIENTE_COMPROBANTE,
            fecha_creacion__lt=limite_de_tiempo
        )

        if not ordenes_a_cancelar.exists():
            self.stdout.write("No se encontraron órdenes para cancelar.")
            return

        self.stdout.write(self.style.WARNING(f"Se encontraron {ordenes_a_cancelar.count()} órdenes para cancelar."))
        
        contador_canceladas = 0
        for orden in ordenes_a_cancelar:
            self.stdout.write(f"  - Cancelando orden #{orden.numero_orden}...")
            
            for item in orden.items.all():
                producto = item.producto
                if producto:
                    producto.stock += item.cantidad
                    producto.save(update_fields=['stock'])
                    self.stdout.write(f"    - Stock de '{producto.nombre}' restaurado (+{item.cantidad}). Nuevo stock: {producto.stock}")
            
            orden.estado_pago = Orden.EstadoPago.CANCELADO
            orden.save(update_fields=['estado_pago'])
            contador_canceladas += 1
            
            
        self.stdout.write(self.style.SUCCESS(f"\nSe cancelaron y restauraron el stock de {contador_canceladas} órdenes exitosamente."))
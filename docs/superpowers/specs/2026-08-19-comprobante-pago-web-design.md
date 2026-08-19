# Subida de comprobante de pago desde la web

Fecha: 2026-08-19
Estado: Aprobado por el usuario, pendiente de plan de implementación

## Contexto y motivación

Hoy, cuando un cliente elige pagar por Yape o Transferencia Bancaria, la
orden se crea con `estado_pago = 'pendiente'` y la página de confirmación
(`OrderConfirmation.jsx`) le muestra las instrucciones de pago (QR de Yape o
datos de la cuenta BCP) junto con un botón que abre WhatsApp con un mensaje
prellenado, donde el cliente debe **adjuntar manualmente** la captura de
pantalla de su pago.

Se quiere reemplazar ese último paso: en vez de que el cliente adjunte la
imagen en WhatsApp, la sube directamente en la web. Una vez subida, la orden
queda en un estado intermedio de revisión, y el admin la aprueba o la
rechaza desde el panel. El botón de WhatsApp se mantiene, pero ahora solo
sirve para avisar al dueño que ya hay un comprobante subido y pendiente de
revisión (ya no para enviar la imagen).

## Estado actual relevante (para quien implemente)

- `backend/api/models.py` — `Orden.EstadoPago`: `PENDIENTE`, `PAGADO`,
  `RECHAZADO`, `CANCELADO`. `Orden.save()` ya dispara correos automáticos
  cuando cambian `estado_pago`/`estado_orden` (ver lógica de
  `hubo_cambio_estado_general`).
- El modelo `Orden` ya tiene el campo `comprobante_pago` (ImageField), pero
  hoy solo es editable desde el panel admin
  (`AdminOrdenSerializer`/`AdminOrdenDetailView`) — el serializer orientado
  al cliente (`OrdenSerializer`) no lo expone.
- `frontend/src/components/Checkout/YapeInstructions.jsx` y
  `TransferInstructions.jsx` — muestran las instrucciones y el botón actual
  de WhatsApp (`wa.me/51910881837?text=...`).
- `frontend/src/pages/Orders/OrderConfirmation.jsx` — página de éxito del
  checkout, solo accesible vía `location.state` justo después de crear la
  orden.
- `frontend/src/pages/Orders/OrderDetail.jsx` y `MyOrders.jsx` — vista del
  cliente de una orden ya creada / listado de sus órdenes. Hoy el badge de
  estado que muestran es el de `estado_orden`, no el de `estado_pago`.
- `admin/src/pages/Orders/OrderDetail.jsx` (+ `useOrderDetail.js`) — ya
  permite al admin subir/reemplazar `comprobante_pago` y cambiar
  `estado_pago`/`estado_orden` con un único botón "Guardar cambios".
- Los badges de `estado_pago` están duplicados en tres archivos del admin:
  `admin/src/pages/Orders/Orders.jsx`, `admin/src/components/Orders/OrderCard.jsx`
  y `admin/src/pages/Orders/OrderDetail.jsx` (cada uno con su propio mapa
  `ESTADO_PAGO_COLORS`/`ESTADO_PAGO_OPTIONS`).

## Decisiones tomadas

1. Nuevo estado de pago: `en_revision` / "En Revisión".
2. El cliente puede subir el comprobante en dos lugares: justo después de
   comprar (`OrderConfirmation`) y, más adelante, desde el detalle de su
   orden en "Mis Órdenes" (`OrderDetail.jsx` del frontend) — necesario para
   los reintentos tras un rechazo.
3. Si el admin rechaza el comprobante, debe escribir un motivo (texto
   libre, obligatorio). Se guarda en la orden y se envía por correo al
   cliente. El cliente puede volver a subir un comprobante corregido.
4. Tras una subida exitosa, se muestra un botón "Avisar por WhatsApp" (sin
   redirección automática).
5. El bloque de subida va **al final de las instrucciones de pago**
   (después del QR de Yape o de los datos de la cuenta BCP), con
   prominencia visual alta (tipo tarjeta destacada, título "Último paso:
   sube tu comprobante de pago") para que quede claro que es el paso final
   obligatorio.
6. Mercado Pago no se toca — este flujo aplica solo a `metodo_pago` en
   (`yape`, `transferencia`).

## Diseño

### 1. Modelo de datos (`backend/api/models.py`)

- `Orden.EstadoPago` gana un nuevo choice:
  `EN_REVISION = 'en_revision', 'En Revisión'`.
- Nuevo campo `motivo_rechazo = models.TextField(blank=True, default='')` en
  `Orden`. Se limpia (`''`) cada vez que se sube un nuevo comprobante o que
  la orden pasa a `pagado`.
- Requiere `makemigrations api` + `migrate`.

### 2. Backend — endpoint de subida para el cliente

Nueva vista `POST /api/ordenes/<int:pk>/comprobante/`
(`SubirComprobantePagoView`, `IsAuthenticated`, `MultiPartParser`):

- Busca la orden filtrando por `usuario=request.user` (404 si no es suya o
  no existe — nunca revela que existe la orden de otro usuario).
- Valida `metodo_pago in ('yape', 'transferencia')`; si no, 400.
- Valida `estado_pago in ('pendiente', 'en_revision', 'rechazado')`; si no
  (p. ej. ya está `pagado` o `cancelado`), 400 con mensaje claro.
- Requiere el archivo `comprobante_pago` en el body (multipart); si falta,
  400.
- Guarda: `comprobante_pago = <archivo>`, `estado_pago = 'en_revision'`,
  `motivo_rechazo = ''`, `orden.save()`.
- `orden.save()` ya dispara el correo genérico de cambio de estado
  (`enviar_correo_actualizacion_estado`) automáticamente — no hace falta
  lógica de correo aquí.
- Responde 200 con la orden serializada (`OrdenSerializer`, que se extiende
  para incluir `comprobante_pago` de solo lectura — ver más abajo).

`OrdenSerializer` (cliente): agrega `comprobante_pago` (read-only) y
`motivo_rechazo` (read-only) a `fields`, para que el frontend pueda leer la
imagen ya subida y el motivo de rechazo desde `/api/ordenes/` y
`/api/ordenes/<id>/`.

`AdminOrdenSerializer`: agrega `motivo_rechazo` como campo editable (mismo
patrón que `estado_pago`).

`urls.py`: nueva ruta
`path('ordenes/<int:pk>/comprobante/', SubirComprobantePagoView.as_view(), name='subir-comprobante-pago')`.

### 3. Correos (`backend/api/email_service.py`)

- Transición a `en_revision`: usa el correo genérico ya existente
  (`enviar_correo_actualizacion_estado`) — sin plantilla nueva.
- Transición a `rechazado`: correo nuevo `enviar_correo_pago_rechazado(orden)`
  con plantilla `emails/pago_rechazado.html`, incluye `orden.motivo_rechazo`
  y un enlace a "Mis Órdenes" para volver a subir el comprobante.
- `Orden.save()` se actualiza: en la rama de `hubo_cambio_estado_general`,
  antes del `else` genérico, se agrega un caso explícito para
  `estado_pago == RECHAZADO` que llama a `enviar_correo_pago_rechazado`
  en vez del correo genérico.

### 4. Frontend — cliente

**Componente nuevo** `frontend/src/components/Checkout/SubirComprobantePago.jsx`
(+ CSS a juego con `YapePayment.css`/`Checkout.css`):

- Props: `orden` (objeto orden actual), `onUploaded(ordenActualizada)`.
- Muestra: título destacado "Último paso: sube tu comprobante de pago",
  input de archivo (imagen), botón "Subir comprobante" (estilo
  `btn-fiofibras`), estado de carga y manejo de error (mensaje del backend).
- Si `orden.estado_pago === 'rechazado'`, muestra primero el motivo
  (`orden.motivo_rechazo`) en un `Alert` de advertencia, y el texto del
  botón cambia a algo como "Subir comprobante corregido".
- Al subir con éxito: llama `onUploaded` con la orden actualizada y se
  reemplaza el formulario por un mensaje de éxito + botón "Avisar por
  WhatsApp" — mismo estilo que los botones de WhatsApp actuales, mensaje
  prellenado tipo *"Hola, ya subí el comprobante de pago de mi pedido
  #{numero_orden} a la web, por favor revísenlo."* (sin pedir adjuntar
  nada).
- Si `orden.estado_pago === 'pagado'` o `'cancelado'`, el componente no
  se muestra en absoluto (nada que subir).

**`OrderConfirmation.jsx`**: se agrega `<SubirComprobantePago .../>`
inmediatamente después de `YapeInstructions`/`TransferInstructions` (mismo
bloque condicional por `metodo_pago`).

**`OrderDetail.jsx`** (cliente): se agrega el mismo componente cuando
`metodo_pago` es yape/transferencia y `estado_pago` es
`pendiente`/`en_revision`/`rechazado`. Se necesita cargar la orden completa
desde el backend (ya lo hace) — como el serializer ahora expone
`comprobante_pago`/`motivo_rechazo`, no hace falta un endpoint nuevo para
leerlos.

**Badges de pago en vista del cliente**: `MyOrders.jsx` y `OrderDetail.jsx`
(cliente) agregan un segundo badge (junto al de `estado_orden` que ya
existe) mostrando `estado_pago` con las etiquetas: Pendiente, En Revisión,
Pagado, Rechazado, Cancelado.

### 5. Admin

- Se crea `admin/src/constants/orderStatus.js` con `ESTADO_PAGO_COLORS`,
  `ESTADO_ORDEN_COLORS` (y sus versiones "options" con `Icon` para
  `OrderDetail.jsx`) como única fuente de verdad. Se agrega `'en_revision'`
  con un color distintivo (ej. azul/celeste, para diferenciarlo de
  "Pendiente" que es amarillo). `Orders.jsx`, `OrderCard.jsx` y
  `OrderDetail.jsx` (admin) importan de ahí en vez de redefinir sus propios
  mapas.
- `admin/src/pages/Orders/OrderDetail.jsx`: cuando `estadoPago === 'rechazado'`
  aparece un `<textarea>` obligatorio para `motivoRechazo` (mismo patrón de
  estado local que `estadoPago`/`estadoOrden` en `useOrderDetail.js`);
  bloquea "Guardar cambios" si está vacío. Se incluye en el payload de
  `handleSave` (JSON o FormData, según haya o no archivo adjunto, igual que
  hoy).
- El campo de subida de `comprobante_pago` que ya existe en el admin
  (`ComprobanteUpload`) sigue igual — es donde el admin ve la imagen que
  subió el cliente.

### 6. Máquina de estados de `estado_pago` resultante

```
pendiente ──(cliente sube comprobante)──> en_revision
en_revision ──(admin aprueba)──> pagado
en_revision ──(admin rechaza + motivo)──> rechazado
rechazado ──(cliente sube nuevo comprobante)──> en_revision
(cualquier estado) ──(admin, manual)──> cancelado
```

El admin conserva la libertad de poner cualquier estado manualmente desde
el panel (como ya puede hacer hoy) — la máquina de arriba describe el flujo
normal esperado, no una restricción dura en el backend del lado admin.

## Fuera de alcance

- Mercado Pago (rutas siguen comentadas, código no se toca).
- `check_unpaid_orders.py` (bug conocido, en pausa por decisión del usuario).
- Validación automática de que el monto del comprobante coincide con el
  total de la orden — sigue siendo revisión manual del admin.
- Notificaciones push/WhatsApp automáticas del lado del servidor (Twilio,
  WhatsApp Business API, etc.) — se mantiene el enlace `wa.me` manual.

## Testing

- Backend: casos del nuevo endpoint — éxito, orden ajena (404), método de
  pago no elegible (400), estado no elegible ya pagado/cancelado (400), sin
  archivo (400), transición `rechazado -> en_revision` limpia
  `motivo_rechazo`.
- Frontend/Admin: verificación manual en navegador (subida real, ver
  badges, ver flujo de rechazo/reintento) — no hay infraestructura de tests
  de frontend en el repo hoy.

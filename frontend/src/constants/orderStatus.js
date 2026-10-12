// src/constants/orderStatus.js
// Config compartida para los badges de estado de orden/pago, usada por
// MyOrders.jsx y OrderDetail.jsx (antes duplicada en ambos archivos).

export const ESTADO_ORDEN_CONFIG = {
  pendiente: { text: 'Pendiente', variant: 'warning' },
  enviado: { text: 'Enviado', variant: 'info' },
  entregado: { text: 'Entregado', variant: 'success' },
};

export const getEstadoOrdenConfig = (estadoOrden, estadoPago) => {
  if (estadoPago === 'cancelado') {
    return { text: 'Cancelado', variant: 'danger' };
  }
  return ESTADO_ORDEN_CONFIG[estadoOrden] || { text: 'Procesando', variant: 'secondary' };
};

export const ESTADO_PAGO_CONFIG = {
  pendiente: { text: 'Pago pendiente', variant: 'warning' },
  en_revision: { text: 'Comprobante en revisión', variant: 'info' },
  pagado: { text: 'Pagado', variant: 'success' },
  rechazado: { text: 'Comprobante rechazado', variant: 'danger' },
  cancelado: { text: 'Cancelado', variant: 'danger' },
};

export const getEstadoPagoConfig = (estadoPago) =>
  ESTADO_PAGO_CONFIG[estadoPago] || { text: estadoPago, variant: 'secondary' };

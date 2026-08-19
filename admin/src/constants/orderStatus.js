// src/constants/orderStatus.js
import { Clock, CheckCircle, XCircle, Truck, AlertCircle, Search } from 'lucide-react'

export const ESTADO_PAGO_COLORS = {
  'pendiente':   { bg: '#f2d811', color: '#080706', label: 'Pendiente'   },
  'en_revision': { bg: '#52a9fa', color: '#080706', label: 'En Revisión' },
  'pagado':      { bg: '#c4fa82', color: '#080706', label: 'Pagado'      },
  'rechazado':   { bg: '#ba0404', color: '#ffffff', label: 'Rechazado'   },
  'cancelado':   { bg: '#fa0505', color: '#ffffff', label: 'Cancelado'   },
}

export const ESTADO_ORDEN_COLORS = {
  'pendiente': { bg: '#f2d811', color: '#080706', label: 'Pendiente' },
  'enviado':   { bg: '#52faec', color: '#080706', label: 'Enviado'   },
  'entregado': { bg: '#3c95fa', color: '#080706', label: 'Entregado' },
  'cancelado': { bg: '#fa0505', color: '#ffffff', label: 'Cancelado' },
}

export const ESTADO_PAGO_OPTIONS = [
  { value: 'pendiente',   label: 'Pendiente',   bg: '#f2d811', color: '#080706', Icon: Clock       },
  { value: 'en_revision', label: 'En Revisión', bg: '#52a9fa', color: '#080706', Icon: Search      },
  { value: 'pagado',      label: 'Pagado',      bg: '#c4fa82', color: '#080706', Icon: CheckCircle },
  { value: 'rechazado',   label: 'Rechazado',   bg: '#ba0404', color: '#ffffff', Icon: AlertCircle },
  { value: 'cancelado',   label: 'Cancelado',   bg: '#fa0505', color: '#ffffff', Icon: XCircle     },
]

export const ESTADO_ORDEN_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente', bg: '#f2d811', color: '#080706', Icon: Clock       },
  { value: 'enviado',   label: 'Enviado',   bg: '#52faec', color: '#080706', Icon: Truck       },
  { value: 'entregado', label: 'Entregado', bg: '#3c95fa', color: '#080706', Icon: CheckCircle },
  { value: 'cancelado', label: 'Cancelado', bg: '#fa0505', color: '#ffffff', Icon: XCircle     },
]

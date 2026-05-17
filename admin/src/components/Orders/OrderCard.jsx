// src/components/Orders/OrderCard.jsx
import { useNavigate } from 'react-router-dom'
import { Eye, ShoppingCart, User, CreditCard, Package } from 'lucide-react'

const ESTADO_PAGO_COLORS = {
  'pendiente': { bg: '#f2d811', color: '#080706', label: 'Pendiente' },
  'pagado':    { bg: '#c4fa82', color: '#080706', label: 'Pagado'    },
  'rechazado': { bg: '#ba0404', color: '#ffffff', label: 'Rechazado' },
  'cancelado': { bg: '#fa0505', color: '#ffffff', label: 'Cancelado' },
}

const ESTADO_ORDEN_COLORS = {
  'pendiente': { bg: '#f2d811', color: '#080706', label: 'Pendiente' },
  'enviado':   { bg: '#52faec', color: '#080706', label: 'Enviado'   },
  'entregado': { bg: '#3c95fa', color: '#080706', label: 'Entregado' },
  'cancelado': { bg: '#fa0505', color: '#ffffff', label: 'Cancelado' },
}

function Badge({ value, map }) {
  const cfg = map[value] || { bg: '#f5f5f5', color: '#555', label: value }
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}

function OrderCard({ order }) {
  const navigate = useNavigate()

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: '1.5px solid #7e4400',
        background: 'white',
        boxShadow: '0 2px 8px rgba(126,68,0,0.10)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 pt-3 pb-2"
        style={{
          background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 50%)',
          borderBottom: '1px solid #7e4400',
        }}
      >
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
            Orden
          </span>
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}
          >
            #{order.numero_orden}
          </span>
        </div>
        <p className="font-bold text-base leading-tight text-white truncate">
          {order.usuario_nombre || '—'}
        </p>
        <p className="text-white/70 text-xs truncate">{order.usuario_email}</p>
      </div>

      {/* Fecha + Total */}
      <div
        className="grid grid-cols-2 divide-x"
        style={{ borderBottom: '1px solid #e8d5a3' }}
      >
        <div className="px-4 py-3" style={{ borderRight: '1px solid #e8d5a3' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#92590a' }}>
            Fecha
          </p>
          <p className="text-xs font-medium text-gray-700">
            {new Date(order.fecha_creacion).toLocaleDateString('es-PE', {
              day: '2-digit', month: 'short', year: 'numeric'
            })}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#92590a' }}>
            Total
          </p>
          <p className="text-sm font-bold" style={{ color: '#2d1a00' }}>
            S/ {parseFloat(order.total).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Método + Productos */}
      <div
        className="grid grid-cols-2 divide-x"
        style={{ borderBottom: '1px solid #e8d5a3' }}
      >
        <div className="px-4 py-3" style={{ borderRight: '1px solid #e8d5a3' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1" style={{ color: '#92590a' }}>
            <CreditCard size={9} /> Método
          </p>
          <p className="text-xs text-gray-700 capitalize">{order.metodo_pago || '—'}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1" style={{ color: '#92590a' }}>
            <Package size={9} /> Productos
          </p>
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
            style={{ backgroundColor: '#e0d182', color: '#473703', border: '1.5px solid #7e4400' }}
          >
            {order.cantidad_compra ?? 0}
          </span>
        </div>
      </div>

      {/* Estados */}
      <div
        className="grid grid-cols-2 divide-x"
        style={{ borderBottom: '1px solid #e8d5a3' }}
      >
        <div className="px-4 py-3" style={{ borderRight: '1px solid #e8d5a3' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#92590a' }}>
            Estado pago
          </p>
          <Badge value={order.estado_pago} map={ESTADO_PAGO_COLORS} />
        </div>
        <div className="px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#92590a' }}>
            Estado orden
          </p>
          <Badge value={order.estado_orden} map={ESTADO_ORDEN_COLORS} />
        </div>
      </div>

      {/* Acción */}
      <div className="flex items-center justify-end px-4 py-2.5" style={{ backgroundColor: '#fffefc' }}>
        <button
          onClick={() => navigate(`/orders/${order.id}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          style={{ color: '#f7f5f5', backgroundColor: '#166534', border: '1px solid #5cb85c' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#087508' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#166534' }}
        >
          <Eye size={13} />
          Ver detalle
        </button>
      </div>
    </div>
  )
}

export default OrderCard
// src/pages/Orders/Orders.jsx
import { useNavigate } from 'react-router-dom'
import { Eye, Search, Package, ShoppingCart } from 'lucide-react'
import { useOrders } from './hooks/useOrders'

const ESTADO_PAGO_COLORS = {
  'pendiente':  { bg: '#f2d811', color: '#080706', label: 'Pendiente'  },
  'pagado':     { bg: '#c4fa82', color: '#080706', label: 'Pagado'     },
  'rechazado':  { bg: '#ba0404', color: '#ffffff', label: 'Rechazado'  },
  'cancelado':  { bg: '#fa0505', color: '#ffffff', label: 'Cancelado'  },
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
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}22` }}
    >
      {cfg.label}
    </span>
  )
}

function Pagination({ currentPage, totalPages, getPageNumbers, setCurrentPage }) {
  const activeStyle   = { backgroundColor: '#166534', color: 'white', border: 'none' }
  const inactiveStyle = { backgroundColor: 'white', color: '#555', border: '1px solid #e0e0e0' }
  const navEnabled    = { color: '#166534', borderColor: '#166534', backgroundColor: 'white' }
  const navDisabled   = { color: '#ccc', borderColor: '#e0e0e0', backgroundColor: 'white' }

  return (
    <div
      className="flex items-center justify-center gap-2 py-4 border-t"
      style={{ borderColor: '#cfcfcf', backgroundColor: '#ffffff' }}
    >
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
        style={currentPage === 1 ? navDisabled : navEnabled}
      >
        Anterior
      </button>
      {getPageNumbers().map(n => (
        <button key={n} onClick={() => setCurrentPage(n)}
          className="w-8 h-8 rounded-lg text-sm font-semibold transition-colors"
          style={n === currentPage ? activeStyle : inactiveStyle}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
        style={currentPage === totalPages ? navDisabled : navEnabled}
      >
        Siguiente
      </button>
    </div>
  )
}

function Orders() {
  const navigate = useNavigate()
  const {
    filtered, paginated, loading,
    search, setSearch,
    currentPage, setCurrentPage, totalPages, getPageNumbers,
    fetchOrders,
  } = useOrders()

  return (
    <div className="space-y-4" style={{ fontFamily: 'Raleway, sans-serif' }}>

      {/* Contenedor unificado */}
      <div className="rounded-2xl shadow-md overflow-hidden">

        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between text-white"
          style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 10%)' }}
        >
          <div className="flex items-center gap-3">
            <ShoppingCart size={28} strokeWidth={2} className="text-white/90" />
            <div>
              <h1 className="text-xl font-bold tracking-wide">Gestión de Órdenes</h1>
              <p className="text-sm text-white/75">Administra los pedidos de tus clientes</p>
            </div>
          </div>
        </div>

        {/* Filtros + Tabla */}
        <div className="bg-white px-6 py-5 space-y-4">

          {/* Buscador */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center flex-1 rounded-xl overflow-hidden"
              style={{ border: '1.5px solid #e8d5a3' }}
            >
              <div className="flex items-center gap-2 flex-1 px-3 py-2">
                <Search size={16} style={{ color: '#b8860b' }} className="shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar por N° orden, cliente o email..."
                  className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>
              <button
                onClick={fetchOrders}
                className="px-4 py-2 text-sm font-semibold text-white shrink-0 transition-colors"
                style={{ backgroundColor: '#b8860b' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#92590a' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#b8860b' }}
              >
                Buscar
              </button>
            </div>
            <div
              className="flex items-center gap-2 px-8 py-2 rounded-xl text-sm font-semibold shrink-0"
              style={{ backgroundColor: '#166534', color: 'white' }}
            >
              <Package size={15} />
              {filtered.length} orden{filtered.length !== 1 ? 'es' : ''}
            </div>
          </div>

          {/* Tabla */}
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#cfcfcf' }}>
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="text-white text-xs uppercase tracking-wider"
                  style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 10%)' }}
                >
                  <th className="px-4 py-3 text-left font-semibold">N° Orden</th>
                  <th className="px-4 py-3 text-left font-semibold">Cliente</th>
                  <th className="px-4 py-3 text-left font-semibold">Fecha</th>
                  <th className="px-4 py-3 text-left font-semibold">Total</th>
                  <th className="px-4 py-3 text-left font-semibold">Método</th>
                  <th className="px-4 py-3 text-center font-semibold">Estado Pago</th>
                  <th className="px-4 py-3 text-center font-semibold">Estado Orden</th>
                  <th className="px-4 py-3 text-center font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">Cargando...</td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">No se encontraron órdenes</td>
                  </tr>
                ) : paginated.map((o, i) => (
                  <tr
                    key={o.id}
                    className="border-t transition-colors duration-150"
                    style={{ borderColor: '#cfcfcf', backgroundColor: i % 2 === 0 ? '#ffffff' : '#f5f5f5' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e6e6e6')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#ffffff' : '#f5f5f5')}
                  >
                    <td className="px-4 py-3 font-bold text-xs" style={{ color: '#92590a' }}>
                      #{o.numero_orden}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{o.usuario_nombre || '—'}</p>
                      <p className="text-xs text-gray-400">{o.usuario_email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {new Date(o.fecha_creacion).toLocaleDateString('es-PE', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3 font-semibold" style={{ color: '#92590a' }}>
                      S/ {parseFloat(o.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize text-xs">{o.metodo_pago || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge value={o.estado_pago}  map={ESTADO_PAGO_COLORS}  />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge value={o.estado_orden} map={ESTADO_ORDEN_COLORS} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => navigate(`/orders/${o.id}`)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: '#0eb505' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#abebae' }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                          title="Ver detalle"
                        >
                          <Eye size={15} />
                        </button>
                        <span className="text-xs text-gray-400">Ver detalle</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                getPageNumbers={getPageNumbers}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders
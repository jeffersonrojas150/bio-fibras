import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, RefreshCw, Eye } from 'lucide-react'
import { getOrders } from '../../api/orders'

const ITEMS_PER_PAGE = 10

const ESTADO_PAGO_COLORS = {
  'pagado': { bg: '#f0fdf4', color: '#009929', label: 'Pagado' },
  'pendiente_de_pago': { bg: '#fff8e1', color: '#b8860b', label: 'Pendiente' },
  'reembolsado': { bg: '#fff0f0', color: '#cc0000', label: 'Reembolsado' },
}

const ESTADO_ORDEN_COLORS = {
  'pendiente': { bg: '#fff8e1', color: '#b8860b', label: 'Pendiente' },
  'enviado': { bg: '#e3f2fd', color: '#1565c0', label: 'Enviado' },
  'entregado': { bg: '#f0fdf4', color: '#009929', label: 'Entregado' },
  'cancelado': { bg: '#fff0f0', color: '#cc0000', label: 'Cancelado' },
}

function Badge({ value, map }) {
  const config = map[value] || { bg: '#f5f5f5', color: '#555', label: value }
  return (
    <span className="px-2 py-1 rounded-md text-xs font-semibold"
      style={{ backgroundColor: config.bg, color: config.color }}>
      {config.label}
    </span>
  )
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => { fetchOrders() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(orders.filter(o =>
      o.numero_orden?.toString().includes(q) ||
      o.usuario_nombre?.toLowerCase().includes(q) ||
      o.usuario_email?.toLowerCase().includes(q)
    ))
    setCurrentPage(1)
  }, [search, orders])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await getOrders()
      const data = res.data.results || res.data
      setOrders(data)
      setFiltered(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="rounded-xl p-5 flex items-center justify-between text-white"
        style={{ backgroundColor: '#b8860b' }}>
        <div>
          <h1 className="text-xl font-bold">Gestión de Órdenes</h1>
          <p className="text-sm text-white/80">Administra los pedidos de tus clientes</p>
        </div>
      </div>

      {/* Card contenedor */}
      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">

        {/* Buscador */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-72 bg-white">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por orden, cliente..."
              className="text-sm outline-none w-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium bg-white transition-colors"
            style={{ borderColor: '#009929', color: '#009929' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#009929'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#009929' }}
          >
            <RefreshCw size={15} />
            Actualizar
          </button>
        </div>

        {/* Contador */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl w-full border"
          style={{ backgroundColor: '#f0fdf4', borderColor: '#f0fdf4' }}>
          <span className="rounded-lg w-8 h-8 flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: '#5ccb5f' }}>
            {filtered.length}
          </span>
          <span className="text-sm" style={{ color: '#009929' }}>
            órdenes encontradas
          </span>
        </div>

        {/* Tabla */}
        <div className="rounded-xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#b8860b' }}>
              <tr className="text-white text-xs uppercase">
                <th className="px-4 py-4 text-left">N° Orden</th>
                <th className="px-4 py-4 text-left">Cliente</th>
                <th className="px-4 py-4 text-left">Fecha</th>
                <th className="px-4 py-4 text-left">Total</th>
                <th className="px-4 py-4 text-left">Método</th>
                <th className="px-4 py-4 text-center">Estado Pago</th>
                <th className="px-4 py-4 text-center">Estado Orden</th>
                <th className="px-4 py-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">Cargando...</td>
                </tr>
              ) : paginated.map((o, i) => (
                <tr key={o.id}
                  className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'white' : '#f9f9f9'}
                >
                  <td className="px-4 py-3 font-bold text-xs" style={{ color: '#92590a' }}>
                    #{o.numero_orden}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{o.usuario_nombre || '-'}</p>
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
                  <td className="px-4 py-3 text-gray-600 capitalize">{o.metodo_pago}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge value={o.estado_pago} map={ESTADO_PAGO_COLORS} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge value={o.estado_orden} map={ESTADO_ORDEN_COLORS} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => navigate(`/orders/${o.id}`)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: '#009929' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
                style={{ color: currentPage === 1 ? '#ccc' : '#009929', borderColor: currentPage === 1 ? '#e0e0e0' : '#009929' }}
              >
                Anterior
              </button>
              {getPageNumbers().map(n => (
                <button key={n} onClick={() => setCurrentPage(n)}
                  className="w-8 h-8 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: n === currentPage ? '#009929' : 'white',
                    color: n === currentPage ? 'white' : '#555',
                    border: n === currentPage ? 'none' : '1px solid #e0e0e0'
                  }}>
                  {n}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
                style={{ color: currentPage === totalPages ? '#ccc' : '#009929', borderColor: currentPage === totalPages ? '#e0e0e0' : '#009929' }}
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Orders
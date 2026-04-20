import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, RefreshCw, Pencil, Trash2 } from 'lucide-react'
import { getProducts, deleteProduct } from '../../api/products'

const ITEMS_PER_PAGE = 10

function Products() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => { fetchProducts() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(products.filter(p => p.nombre.toLowerCase().includes(q)))
    setCurrentPage(1)
  }, [search, products])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await getProducts()
      const data = res.data.results || res.data
      setProducts(data)
      setFiltered(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await deleteProduct(id)
      fetchProducts()
    } catch (e) {
      console.error(e)
    }
  }

  // Lógica de paginación
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
          <h1 className="text-xl font-bold">Gestión de Productos</h1>
          <p className="text-sm text-white/80">Administra el catálogo de productos de tu empresa</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border bg-white transition-colors"
            style={{ borderColor: '#92590a', color: '#92590a' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#92590a'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#92590a' }}
        >
          <Plus size={16} />
          Agregar Producto
        </button>
      </div>

      {/* Card contenedor */}
      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">

        {/* Buscador */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-72 bg-white">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos"
              className="text-sm outline-none w-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={fetchProducts}
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
          style={{ backgroundColor: '#f0fdf4', borderColor: '#f0fdf4', color: '#555' }}>
          <span className="rounded-lg w-8 h-8 flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: '#5ccb5f' }}>
            {filtered.length}
          </span>
          <span className="text-sm " style={{ color: '#009929' }}>
            productos encontrados
          </span>
        </div>

        {/* Tabla */}
        <div className="rounded-xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#b8860b' }}>
              <tr className="text-white text-xs uppercase">
                <th className="px-4 py-4 text-left">ID</th>
                <th className="px-4 py-4 text-left">Nombre</th>
                <th className="px-4 py-4 text-left">Categoría</th>
                <th className="px-4 py-4 text-left">Precio</th>
                <th className="px-4 py-4 text-left">Stock</th>
                <th className="px-4 py-4 text-center">Imagen</th>
                <th className="px-4 py-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">Cargando...</td>
                </tr>
              ) : paginated.map((p, i) => (
                <tr key={p.id}
                  className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'white' : '#f9f9f9'}>
                  <td className="px-4 py-3 text-amber-700 font-medium">#{p.id}</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{p.nombre}</td>
                  <td className="px-4 py-3 text-amber-600">
                    {p.categoria?.nombre || p.categoria || '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-700">S/ {p.precio_unitario}</td>
                  <td className="px-4 py-3 text-gray-700">{p.stock ?? '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      {p.imagen_principal ? (
                        <img src={p.imagen_principal} alt={p.nombre}
                          className="w-12 h-12 object-cover rounded-lg" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/products/${p.id}/edit`)}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
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
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 transition-colors"
            style={{ color: currentPage === 1 ? '#ccc' : '#009929', borderColor: currentPage === 1 ? '#e0e0e0' : '#009929' }}
            >
            Anterior
            </button>

              {getPageNumbers().map(n => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className="w-8 h-8 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: n === currentPage ? '#009929' : 'white',
                    color: n === currentPage ? 'white' : '#555',
                    border: n === currentPage ? 'none' : '1px solid #e0e0e0'
                    }}
                >
                  {n}
                </button>
              ))}

              <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 transition-colors"
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

export default Products
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, RefreshCw, Pencil, Trash2 } from 'lucide-react'
import { getCategories, deleteCategory } from '../../api/categories'

function Categories() {
  const [categories, setCategories] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => { fetchCategories() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(categories.filter(c => c.nombre.toLowerCase().includes(q)))
  }, [search, categories])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await getCategories()
      const data = res.data.results || res.data
      setCategories(data)
      setFiltered(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug) => {
    if (!confirm('¿Eliminar esta categoría?')) return
    try {
      await deleteCategory(slug)
      fetchCategories()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="rounded-xl p-5 flex items-center justify-between text-white"
        style={{ backgroundColor: '#b8860b' }}>
        <div>
          <h1 className="text-xl font-bold">Gestión de Categorías</h1>
          <p className="text-sm text-white/80">Administra las categorías de productos</p>
        </div>
        <button
        onClick={() => navigate('/categories/new')}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border bg-white transition-colors"
        style={{ borderColor: '#92590a', color: '#92590a' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#92590a'; e.currentTarget.style.color = 'white' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#92590a' }}
        >
        <Plus size={16} />
        Agregar Categoría
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
              placeholder="Buscar categorías"
              className="text-sm outline-none w-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={fetchCategories}
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
            categorías encontradas
          </span>
        </div>

        {/* Tabla */}
        <div className="rounded-xl overflow-hidden border border-gray-100">
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#b8860b' }}>
              <tr className="text-white text-xs uppercase">
                <th className="px-4 py-4 text-left">Imagen</th>
                <th className="px-4 py-4 text-left">Nombre</th>
                <th className="px-4 py-4 text-left">Slug</th>
                <th className="px-4 py-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-400">Cargando...</td>
                </tr>
              ) : filtered.map((c, i) => (
                <tr key={c.slug}
                  className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0fdf4'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'white' : '#f9f9f9'}>
                  <td className="px-4 py-3">
                    {c.imagen_url ? (
                      <img src={c.imagen_url} alt={c.nombre}
                        className="w-12 h-12 object-cover rounded-lg" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-800">{c.nombre}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                      {c.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => navigate(`/categories/${c.slug}/edit`)}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.slug)}
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
        </div>
      </div>
    </div>
  )
}

export default Categories
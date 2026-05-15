// src/pages/Users/Users.jsx
import { Search, Package, Users2 } from 'lucide-react'
import { useUsers } from './hooks/useUsers'

// ── Paginación ────────────────────────────────────────────────────────────────
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

// ── Componente principal ──────────────────────────────────────────────────────
function Users() {
  const {
    filtered, paginated, loading,
    search, setSearch,
    currentPage, setCurrentPage,
    totalPages, getPageNumbers,
    fetchUsers,
  } = useUsers()

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
            <Users2 size={28} strokeWidth={2} className="text-white/90" />
            <div>
              <h1 className="text-xl font-bold tracking-wide">Gestión de Usuarios</h1>
              <p className="text-sm text-white/75">Consulta los usuarios registrados en la plataforma</p>
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
                  placeholder="Buscar por nombre, usuario o email..."
                  className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>
              <button
                onClick={fetchUsers}
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
              {filtered.length} usuario{filtered.length !== 1 ? 's' : ''}
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
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Usuario</th>
                  <th className="px-4 py-3 text-left font-semibold">Nombre completo</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-center font-semibold">Rol</th>
                  <th className="px-4 py-3 text-center font-semibold">Registro</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">Cargando...</td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">No se encontraron usuarios</td>
                  </tr>
                ) : paginated.map((u, i) => (
                  <tr
                    key={u.id}
                    className="border-t transition-colors duration-150"
                    style={{ borderColor: '#cfcfcf', backgroundColor: i % 2 === 0 ? '#ffffff' : '#f5f5f5' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e6e6e6')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#ffffff' : '#f5f5f5')}
                  >
                    {/* ID */}
                    <td className="px-4 py-3 font-semibold text-xs" style={{ color: '#92590a' }}>
                      #{u.id}
                    </td>

                    {/* Usuario con avatar inicial */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ backgroundColor: '#7a4d04' }}
                        >
                          {(u.username?.[0] ?? '?').toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{u.username || '—'}</span>
                      </div>
                    </td>

                    {/* Nombre completo */}
                    <td className="px-4 py-3 text-gray-700">
                      {u.first_name || u.last_name
                        ? `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim()
                        : <span className="text-gray-300">—</span>
                      }
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-gray-500 text-xs">{u.email || '—'}</td>

                    {/* Rol */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={u.is_staff
                          ? { backgroundColor: '#ffe070', color: '#0d0d0d', border: '1px solid #0d0d0d' }
                          : { backgroundColor: '#f5f5f5', color: '#0d0d0d', border: '1px solid #0d0d0d' }
                        }
                      >
                        {u.is_staff ? 'Admin' : 'Cliente'}
                      </span>
                    </td>

                    {/* Fecha de registro */}
                    <td className="px-4 py-3 text-center text-gray-500 text-xs">
                      {u.date_joined
                        ? 
                        new Date(u.date_joined).toLocaleDateString('es-PE', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })
                        : '—'
                      }
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

export default Users
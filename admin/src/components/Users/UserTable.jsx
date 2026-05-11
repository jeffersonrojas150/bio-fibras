// src/components/Users/UserTable.jsx
import { ChevronLeft, ChevronRight, UserCircle } from 'lucide-react'

function UserTable({ paginated, loading, currentPage, totalPages, getPageNumbers, setCurrentPage }) {
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#f5e6cc' }}>
      <table className="w-full text-sm text-gray-600">
        <thead>
          <tr style={{ backgroundColor: '#b8860b' }} className="text-white">
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Usuario</th>
            <th className="px-4 py-3 text-left">Nombre completo</th>
            <th className="px-4 py-3 text-left">Email</th>
            <th className="px-4 py-3 text-center">Estado</th>
            <th className="px-4 py-3 text-center">Rol</th>
            {/* <th className="px-4 py-3 text-center">Fecha registro</th> */}
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
          ) : (
            paginated.map((u, idx) => (
              <tr
                key={u.id}
                className="border-t transition-colors"
                style={{
                  borderColor: '#f5e6cc',
                  backgroundColor: idx % 2 === 0 ? 'white' : '#fffdf7',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fdf3e0' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = idx % 2 === 0 ? 'white' : '#fffdf7' }}
              >
                <td className="px-4 py-3 font-mono text-xs" style={{ color: '#92590a' }}>
                  #{u.id}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: '#b8860b' }}
                    >
                      {u.username?.[0]?.toUpperCase() ?? <UserCircle size={14} />}
                    </div>
                    <span className="font-medium">{u.username}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {u.first_name || u.last_name
                    ? `${u.first_name} ${u.last_name}`.trim()
                    : <span className="text-gray-300">—</span>
                  }
                </td>
                <td className="px-4 py-3 text-gray-500">{u.email || <span className="text-gray-300">—</span>}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={u.is_active
                      ? { backgroundColor: '#f0fdf4', color: '#009929' }
                      : { backgroundColor: '#fef2f2', color: '#ef4444' }
                    }
                  >
                    {u.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={u.is_staff
                      ? { backgroundColor: '#f5e6cc', color: '#7e4400' }
                      : { backgroundColor: '#f3f4f6', color: '#6b7280' }
                    }
                  >
                    {u.is_staff ? 'Staff' : 'Cliente'}
                  </span>
                </td>
                {/* <td className="px-4 py-3 text-center text-xs text-gray-400">
                  {u.date_joined
                    ? new Date(u.date_joined).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
                    : '—'
                  }
                </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 px-4 py-3 border-t" style={{ borderColor: '#f5e6cc' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border disabled:opacity-40 transition-colors"
            style={{ borderColor: '#b8860b', color: '#b8860b' }}
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map(n => (
            <button
              key={n}
              onClick={() => setCurrentPage(n)}
              className="w-8 h-8 rounded-lg text-sm font-semibold border transition-colors"
              style={n === currentPage
                ? { backgroundColor: '#b8860b', color: 'white', borderColor: '#b8860b' }
                : { backgroundColor: 'white', color: '#b8860b', borderColor: '#b8860b' }
              }
            >
              {n}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border disabled:opacity-40 transition-colors"
            style={{ borderColor: '#b8860b', color: '#b8860b' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default UserTable
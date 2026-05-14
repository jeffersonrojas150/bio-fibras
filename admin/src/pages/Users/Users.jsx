// src/pages/Users/Users.jsx
import { Users2 } from 'lucide-react'
import { useUsers } from './hooks/useUsers'
import UserFilters from '../../components/Users/UserFilters'
import UserTable from '../../components/Users/UserTable'

function Users() {
  const {
    filtered, paginated, loading,
    search, setSearch,
    currentPage, setCurrentPage,
    totalPages, getPageNumbers,
    fetchUsers,
  } = useUsers()

  return (
    <div className="space-y-4">

      {/* Header */}
      <div
        className="rounded-xl p-5 flex items-center justify-between text-white"
        style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 0%)' }}
      >
        <div className="flex items-center gap-3">
          <Users2 size={32} strokeWidth={2} className="text-white" />
          <div>
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
            <p className="text-sm text-white/80">Consulta los usuarios registrados en la plataforma</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">
        <UserFilters
          search={search}
          onSearchChange={setSearch}
          onRefresh={fetchUsers}
          count={filtered.length}
        />
        <UserTable
          paginated={paginated}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          getPageNumbers={getPageNumbers}
          setCurrentPage={setCurrentPage}
        />
      </div>

    </div>
  )
}

export default Users
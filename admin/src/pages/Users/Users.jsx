// src/pages/Users/Users.jsx
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
        style={{ backgroundColor: '#b8860b' }}
      >
        <div>
          <h1 className="text-xl font-bold">Gestión de Usuarios</h1>
          <p className="text-sm text-white/80">Consulta los usuarios registrados en la plataforma</p>
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
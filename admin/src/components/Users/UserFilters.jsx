// src/components/Users/UserFilters.jsx
import { Search, RefreshCw } from 'lucide-react'

function UserFilters({ search, onSearchChange, onRefresh, count }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full sm:w-72 border"
          style={{ backgroundColor: '#f0fdf4', borderColor: '#f0fdf4' }}
        >
          <Search size={15} style={{ color: '#009929' }} />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: '#374151' }}
          />
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-colors"
          style={{ borderColor: '#009929', color: '#009929' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f0fdf4' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <RefreshCw size={15} />
          Actualizar
        </button>
      </div>

      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl border"
        style={{ backgroundColor: '#f0fdf4', borderColor: '#f0fdf4' }}
      >
        <span
          className="rounded-lg w-8 h-8 flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ backgroundColor: '#5ccb5f' }}
        >
          {count}
        </span>
        <span className="text-sm" style={{ color: '#009929' }}>usuarios encontrados</span>
      </div>
    </div>
  )
}

export default UserFilters
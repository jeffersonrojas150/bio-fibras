import { Search, RefreshCw } from 'lucide-react'

function ProductFilters({ search, onSearchChange, onRefresh, count }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-72 bg-white">
          <Search size={15} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar productos"
            className="text-sm outline-none w-full"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium bg-white transition-colors"
          style={{ borderColor: '#009929', color: '#009929' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#009929'; e.currentTarget.style.color = 'white' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#009929' }}
        >
          <RefreshCw size={15} />
          Actualizar
        </button>
      </div>

      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl w-full border"
        style={{ backgroundColor: '#f0fdf4', borderColor: '#f0fdf4' }}
      >
        <span
          className="rounded-lg w-8 h-8 flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ backgroundColor: '#5ccb5f' }}
        >
          {count}
        </span>
        <span className="text-sm" style={{ color: '#009929' }}>
          productos encontrados
        </span>
      </div>
    </div>
  )
}

export default ProductFilters
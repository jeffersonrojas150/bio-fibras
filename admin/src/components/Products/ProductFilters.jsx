// src/components/Products/ProductFilters.jsx
import { Search, Package } from 'lucide-react'

function ProductFilters({ search, onSearchChange, onRefresh, count }) {
  return (
    <div className="flex items-center gap-3">

      {/* Buscador con botón integrado */}
      <div
        className="flex items-center flex-1 rounded-xl overflow-hidden"
        style={{ border: '1.5px solid #e8d5a3' }}
      >
        <div className="flex items-center gap-2 flex-1 px-3 py-2">
          <Search size={16} style={{ color: '#b8860b' }} className="shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Buscar producto por nombre o categoría..."
            className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
          />
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 text-sm font-semibold text-white shrink-0 transition-colors"
          style={{ backgroundColor: '#b8860b' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#92590a' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#b8860b' }}
        >
          Buscar
        </button>
      </div>

      {/* Contador de productos */}
      <div
        className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold shrink-0"
        style={{ backgroundColor: '#166534', color: 'white' }}
      >
        <Package size={15} />
        {count} producto{count !== 1 ? 's' : ''}
      </div>

    </div>
  )
}

export default ProductFilters
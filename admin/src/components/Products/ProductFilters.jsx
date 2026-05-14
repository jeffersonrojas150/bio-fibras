// src/components/Products/ProductFilters.jsx
import { Search, Package, X } from 'lucide-react'

function ProductFilters({ search, onSearchChange, onRefresh, count }) {
  return (
    <div className="flex items-center gap-3">

      {/* Buscador extendido */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border flex-1"
        style={{ borderColor: '#000000', backgroundColor: 'white' }}
      >
        <Search size={15} className="shrink-0" style={{ color: '#000000' }} />
        <input
          type="text"
          placeholder="Buscar producto por nombre o categoría..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="bg-transparent outline-none text-sm w-full text-black placeholder-gray-400"
        />
        {search && (
          <button onClick={() => onSearchChange('')} className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={15} />
          </button>
        )}
      </div>

      {/* Contador como badge verde */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold shrink-0"
        style={{ backgroundColor: '#14532d', color: 'white' }}
      >
        <Package size={14} />
        {count} productos
      </div>

    </div>
  )
}

export default ProductFilters
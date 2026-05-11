// src/components/Products/ProductFilters.jsx
import { Search, Package } from 'lucide-react'

function ProductFilters({ search, onSearchChange, onRefresh, count }) {
  return (
    <div className="flex items-center gap-3">

      {/* Buscador extendido */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border flex-1"
        style={{ borderColor: '#d1d5db', backgroundColor: 'white' }}
      >
        <Search size={15} className="text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar productos"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="bg-transparent outline-none text-sm w-full"
          style={{ color: '#374151' }}
        />
      </div>

      {/* Contador como badge verde */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold flex-shrink-0"
        style={{ backgroundColor: '#009929', color: 'white' }}
      >
        <Package size={14} />
        {count} productos
      </div>

    </div>
  )
}

export default ProductFilters
// src/components/Products/ProductFilters.jsx
import { Search, Package, X } from 'lucide-react'

function ProductFilters({ search, onSearchChange, onRefresh, count }) {
  return (
    <div className="flex flex-col md:flex-row items-stretch gap-3">

      {/* ── Móvil ── */}
      <div className="flex items-center flex-1 md:hidden rounded-xl px-3 py-1.5 gap-2"
        style={{ border: '1.5px solid #e8d5a3', backgroundColor: 'white' }}>
        <input
          type="text" value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar producto..."
          className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
        />
        {search && (
          <button onClick={() => onSearchChange('')} className="shrink-0 p-0.5 rounded-full" style={{ color: '#999' }}>
            <X size={14} />
          </button>
        )}
        <button
          onClick={onRefresh}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ backgroundColor: '#b8860b' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#b8941a' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#b8860b' }}
        >
          <Search size={15} className="text-white" />
        </button>
      </div>

      {/* ── Desktop: buscador  ── */}
      <div className="hidden md:flex items-center flex-1 rounded-xl overflow-hidden"
        style={{ border: '1.5px solid #e8d5a3' }}>
        <div className="flex items-center gap-2 flex-1 px-3 py-2">
          <Search size={16} style={{ color: '#b8860b' }} className="shrink-0" />
          <input
            type="text" value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Buscar producto por nombre o categoría..."
            className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="p-0.5 rounded-full transition-colors shrink-0"
              style={{ color: '#b8860b' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5e6cc' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={onRefresh}
          className="px-4 py-2 text-sm font-semibold text-white shrink-0 transition-colors"
          style={{ backgroundColor: '#b8860b' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d99c07' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#b8860b' }}
        >
          Buscar
        </button>
      </div>

      {/* Contador */}
      <div
        className="flex items-center justify-center gap-2 px-8 py-2 rounded-xl text-sm font-semibold shrink-0"
        style={{ backgroundColor: '#166534', color: 'white', border: '1px solid #5cb85c' }}
      >
        <Package size={15} />
        {count} producto{count !== 1 ? 's' : ''}
      </div>

    </div>
  )
}

export default ProductFilters
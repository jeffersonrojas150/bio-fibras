// src/components/Products/ProductTable.jsx
import { Pencil, Trash2 } from 'lucide-react'

// ── Sub-componentes reutilizables ─────────────────────────────────────────────

function StockBadge({ stock }) {
  if (stock === null || stock === undefined) return <span className="text-gray-400 text-xs">—</span>
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: '#deb437', color: '#473703', border: '1px solid #473703' }}
    >
      {stock}
    </span>
  )
}

function CategoryBadge({ nombre }) {
  if (!nombre) return <span className="text-gray-400 text-xs">—</span>
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: '#fef3c7', color: '#92590a', border: '1px solid #473703' }}
    >
      {nombre}
    </span>
  )
}

function ProductImage({ imagenes, nombre }) {
  const img = imagenes?.find(i => i.es_principal) || imagenes?.[0]
  if (img) {
    return (
      <img
        src={img.imagen_url}
        alt={nombre}
        className="w-11 h-11 object-cover rounded-lg shadow-sm mx-auto block"
        style={{ border: '1.5px solid #e8d5a3' }}
      />
    )
  }
  return (
    <div
      className="w-11 h-11 rounded-lg mx-auto flex items-center justify-center text-xs text-gray-400"
      style={{ backgroundColor: '#f5e6cc', border: '1.5px dashed #d4a84b' }}
    >
      —
    </div>
  )
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={onEdit}
        className="p-1.5 rounded-lg transition-colors"
        style={{ color: '#0eb505' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#abebae' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
        title="Editar"
      >
        <Pencil size={15} />
      </button>
      <button
        onClick={onDelete}
        className="p-1.5 rounded-lg transition-colors"
        style={{ color: '#ef4444' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef2f2' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
        title="Eliminar"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}

// ── Fila ──────────────────────────────────────────────────────────────────────
function ProductRow({ product: p, index: i, onEdit, onDelete }) {
  const isEven = i % 2 === 0
  return (
    <tr
      className="border-t transition-colors duration-150"
      style={{ borderColor: '#cfcfcf', backgroundColor: isEven ? '#ffffff' : '#f5f5f5' }}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e6e6e6')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = isEven ? '#ffffff' : '#f5f5f5')}
    >
      <td className="px-4 py-3 font-semibold text-xs" style={{ color: '#92590a' }}>#{p.id}</td>
      <td className="px-4 py-3 font-medium text-gray-800">{p.nombre}</td>
      <td className="px-4 py-3"><CategoryBadge nombre={p.categoria_nombre} /></td>
      <td className="px-4 py-3 text-gray-700 font-medium">S/ {p.precio_unitario}</td>
      <td className="px-4 py-3"><StockBadge stock={p.stock} /></td>
      <td className="px-4 py-3"><ProductImage imagenes={p.imagenes} nombre={p.nombre} /></td>
      <td className="px-4 py-3"><ActionButtons onEdit={() => onEdit(p)} onDelete={() => onDelete(p)} /></td>
    </tr>
  )
}

// ── Paginación ────────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, getPageNumbers, setCurrentPage }) {
  const activeStyle = { backgroundColor: '#166534', color: 'white', border: 'none' }
  const inactiveStyle = { backgroundColor: 'white', color: '#555', border: '1px solid #e0e0e0' }
  const navEnabledStyle = { color: '#166534', borderColor: '#166534', backgroundColor: 'white' }
  const navDisabledStyle = { color: '#ccc', borderColor: '#e0e0e0', backgroundColor: 'white' }

  return (
    <div
      className="flex items-center justify-center gap-2 py-4 border-t"
      style={{ borderColor: '#cfcfcf', backgroundColor: '#ffffff' }}
    >
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
        style={currentPage === 1 ? navDisabledStyle : navEnabledStyle}
      >
        Anterior
      </button>

      {getPageNumbers().map(n => (
        <button
          key={n}
          onClick={() => setCurrentPage(n)}
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
        style={currentPage === totalPages ? navDisabledStyle : navEnabledStyle}
      >
        Siguiente
      </button>
    </div>
  )
}

// ── Tabla principal ───────────────────────────────────────────────────────────
function ProductTable({ paginated, loading, onEdit, onDelete, currentPage, totalPages, getPageNumbers, setCurrentPage }) {
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#cfcfcf' }}>
      <table className="w-full text-sm">
        <thead>
          <tr
            className="text-white text-xs uppercase tracking-wider"
            style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 10%)' }}
          >
            <th className="px-4 py-3 text-left font-semibold">ID</th>
            <th className="px-4 py-3 text-left font-semibold">Nombre</th>
            <th className="px-4 py-3 text-left font-semibold">Categoría</th>
            <th className="px-4 py-3 text-left font-semibold">Precio</th>
            <th className="px-4 py-3 text-left font-semibold">Stock</th>
            <th className="px-4 py-3 text-center font-semibold">Imagen</th>
            <th className="px-4 py-3 text-center font-semibold">Acción</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-400">Cargando...</td>
            </tr>
          ) : paginated.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-400">No se encontraron productos</td>
            </tr>
          ) : (
            paginated.map((p, i) => (
              <ProductRow key={p.id} product={p} index={i} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
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
  )
}

export default ProductTable
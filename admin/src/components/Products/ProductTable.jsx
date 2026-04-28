import { Pencil, Trash2 } from 'lucide-react'

function ProductTable({ paginated, loading, onEdit, onDelete, currentPage, totalPages, getPageNumbers, setCurrentPage }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-100">
      <table className="w-full text-sm">
        <thead style={{ backgroundColor: '#b8860b' }}>
          <tr className="text-white text-xs uppercase">
            <th className="px-4 py-4 text-left">ID</th>
            <th className="px-4 py-4 text-left">Nombre</th>
            <th className="px-4 py-4 text-left">Categoría</th>
            <th className="px-4 py-4 text-left">Precio</th>
            <th className="px-4 py-4 text-left">Stock</th>
            <th className="px-4 py-4 text-center">Imagen</th>
            <th className="px-4 py-4 text-center">Acción</th>
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

// ── Fila ──────────────────────────────────────────────────────────────────────
function ProductRow({ product: p, index: i, onEdit, onDelete }) {
  const imgPrincipal = p.imagenes?.find(img => img.es_principal) || p.imagenes?.[0]

  return (
    <tr
      className={`border-t border-gray-100 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
      onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'white' : '#f9f9f9')}
    >
      <td className="px-4 py-3 text-amber-700 font-medium">#{p.id}</td>
      <td className="px-4 py-3 text-gray-800 font-medium">{p.nombre}</td>
      <td className="px-4 py-3 text-amber-600">{p.categoria_nombre || '-'}</td>
      <td className="px-4 py-3 text-gray-700">S/ {p.precio_unitario}</td>
      <td className="px-4 py-3 text-gray-700">{p.stock ?? '-'}</td>
      <td className="px-4 py-3">
        <div className="flex justify-center">
          {imgPrincipal ? (
            <img src={imgPrincipal.imagen_url} alt={p.nombre} className="w-12 h-12 object-cover rounded-lg" />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => onEdit(p)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors" title="Editar">
            <Pencil size={15} />
          </button>
          <button onClick={() => onDelete(p)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Eliminar">
            <Trash2 size={15} />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── Paginación ────────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, getPageNumbers, setCurrentPage }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 border-t border-gray-100">
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
        style={{ color: currentPage === 1 ? '#ccc' : '#009929', borderColor: currentPage === 1 ? '#e0e0e0' : '#009929' }}
      >
        Anterior
      </button>

      {getPageNumbers().map(n => (
        <button
          key={n}
          onClick={() => setCurrentPage(n)}
          className="w-8 h-8 rounded-lg text-sm font-semibold transition-colors"
          style={{
            backgroundColor: n === currentPage ? '#009929' : 'white',
            color: n === currentPage ? 'white' : '#555',
            border: n === currentPage ? 'none' : '1px solid #e0e0e0',
          }}
        >
          {n}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
        style={{ color: currentPage === totalPages ? '#ccc' : '#009929', borderColor: currentPage === totalPages ? '#e0e0e0' : '#009929' }}
      >
        Siguiente
      </button>
    </div>
  )
}

export default ProductTable
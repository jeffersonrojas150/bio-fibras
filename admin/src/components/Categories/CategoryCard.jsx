// src/components/Categories/CategoryCard.jsx
import { Pencil, Trash2, Tag, Package, CheckCircle, XCircle } from 'lucide-react'

function CategoryCard({ category, onEdit, onDelete }) {
  const { nombre, imagen_url, total_productos, activo } = category

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: '1.5px solid #7e4400',
        background: 'white',
        boxShadow: '0 2px 8px rgba(126,68,0,0.10)',
      }}
    >
      {/* ── Header: mismo gradiente que el header principal ── */}
      <div
        className="px-4 pt-3 pb-2"
        style={{
          background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 50%)',
          borderBottom: '1px solid #7e4400',
        }}
      >
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
            Categoría
          </span>
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}
          >
            #{category.id}
          </span>
        </div>
        <h3 className="font-bold text-base leading-tight text-white">
          {nombre}
        </h3>
      </div>

      {/* ── Imagen ── */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: '1px solid #e8d5a3' }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-2"
          style={{ color: '#92590a' }}
        >
          Imagen
        </p>
        {imagen_url ? (
          <img
            src={imagen_url}
            alt={nombre}
            className="w-full h-36 object-cover rounded-xl"
            style={{ border: '1.5px solid #e8d5a3' }}
          />
        ) : (
          <div
            className="w-full h-36 rounded-xl flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: '#f5e6cc', border: '1.5px dashed #c8a055' }}
          >
            <Tag size={24} style={{ color: '#b8860b' }} />
            <span className="text-xs" style={{ color: '#92590a' }}>Sin imagen</span>
          </div>
        )}
      </div>

      {/* ── Datos: Productos + Estado ── */}
      <div
        className="grid grid-cols-2 divide-x"
        style={{ borderBottom: '1px solid #e8d5a3', divideColor: '#e8d5a3' }}
      >
        {/* Productos */}
        <div className="px-4 py-3" style={{ borderRight: '1px solid #e8d5a3' }}>
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
            style={{ color: '#92590a' }}
          >
            Productos
          </p>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
              style={{ backgroundColor: '#e0d182', color: '#473703', border: '1.5px solid #7e4400' }}
            >
              {total_productos ?? 0}
            </span>
            <div className="flex items-center gap-1">
              <Package size={13} style={{ color: '#92590a' }} />
              <span className="text-xs" style={{ color: '#7e4400' }}>
                {total_productos === 1 ? 'producto' : 'productos'}
              </span>
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="px-4 py-3">
          <p
            className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
            style={{ color: '#92590a' }}
          >
            Estado
          </p>
          <div className="flex items-center gap-1.5">
            {activo ? (
              <CheckCircle size={15} className="shrink-0" style={{ color: '#166534' }} />
            ) : (
              <XCircle size={15} className="shrink-0" style={{ color: '#991b1b' }} />
            )}
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={
                activo
                  ? { backgroundColor: '#c5f57d', color: '#1a3a0a', border: '1px solid #5a8a1a' }
                  : { backgroundColor: '#fccccc', color: '#5a0a0a', border: '1px solid #c05050' }
              }
            >
              {activo ? 'Activa' : 'Inactiva'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Acciones ── */}
      <div
        className="flex items-center justify-end gap-2 px-4 py-2.5"
        style={{ backgroundColor: '#fffefc' }}
      >
        <button
          onClick={() => onEdit(category)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          style={{ color: '#f7f5f5', backgroundColor: '#166534', border: '1px solid #5cb85c' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#087508' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#057305' }}
        >
          <Pencil size={13} />
          Editar
        </button>
        <button
          onClick={() => onDelete(category)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          style={{ color: '#f7f5f5', backgroundColor: '#f20707', border: '1px solid #f87171' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e30707' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fa0707' }}
        >
          <Trash2 size={13} />
          Eliminar
        </button>
      </div>

    </div>
  )
}

export default CategoryCard
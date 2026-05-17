// src/components/Products/ProductCard.jsx
import { Pencil, Trash2, Package, Tag, Layers } from 'lucide-react'

function ProductCard({ product, onEdit, onDelete }) {
  const { nombre, categoria_nombre, precio_unitario, stock, imagenes } = product

  const img = imagenes?.find(i => i.es_principal) || imagenes?.[0]

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: '1.5px solid #7e4400',
        background: 'white',
        boxShadow: '0 2px 8px rgba(126,68,0,0.10)',
      }}
    >
      {/* ── Header ── */}
      <div
        className="px-4 pt-3 pb-2"
        style={{
          background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 50%)',
          borderBottom: '1px solid #7e4400',
        }}
      >
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
            Producto
          </span>
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}
          >
            #{product.id}
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
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#92590a' }}>
          Imagen
        </p>
        {img ? (
          <img
            src={img.imagen_url}
            alt={nombre}
            className="w-full h-40 object-cover rounded-xl"
            style={{ border: '1.5px solid #e8d5a3' }}
          />
        ) : (
          <div
            className="w-full h-40 rounded-xl flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: '#f5e6cc', border: '1.5px dashed #c8a055' }}
          >
            <Package size={28} style={{ color: '#b8860b' }} />
            <span className="text-xs" style={{ color: '#92590a' }}>Sin imagen</span>
          </div>
        )}
      </div>

      {/* ── Datos: Categoría | Precio | Stock ── */}
      <div
        className="grid grid-cols-3 divide-x"
        style={{ borderBottom: '1px solid #e8d5a3' }}
      >
        {/* Categoría */}
        <div className="px-3 py-3" style={{ borderRight: '1px solid #e8d5a3' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1" style={{ color: '#92590a' }}>
            <Tag size={9} /> Categoría
          </p>
          {categoria_nombre ? (
            <span
              className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold leading-tight"
              style={{ backgroundColor: '#e0d182', color: '#473703', border: '1px solid #7e4400' }}
            >
              {categoria_nombre}
            </span>
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>

        {/* Precio */}
        <div className="px-3 py-3" style={{ borderRight: '1px solid #e8d5a3' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1" style={{ color: '#92590a' }}>
            <span className="text-[9px] font-bold">S/</span> Precio
          </p>
          <span className="text-sm font-bold" style={{ color: '#2d1a00' }}>
            S/ {precio_unitario}
          </span>
        </div>

        {/* Stock */}
        <div className="px-3 py-3">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1" style={{ color: '#92590a' }}>
            <Layers size={9} /> Stock
          </p>
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
            style={{ backgroundColor: '#deb437', color: '#473703', border: '1.5px solid #7e4400' }}
          >
            {stock ?? 0}
          </span>
        </div>
      </div>

      {/* ── Acciones ── */}
      <div
        className="flex items-center justify-end gap-2 px-4 py-2.5"
        style={{ backgroundColor: '#fffefc' }}
      >
        <button
          onClick={() => onEdit(product)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          style={{ color: '#f7f5f5', backgroundColor: '#166534', border: '1px solid #5cb85c' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#087508' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#166534' }}
        >
          <Pencil size={13} />
          Editar
        </button>
        <button
          onClick={() => onDelete(product)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          style={{ color: '#f7f5f5', backgroundColor: '#f20707', border: '1px solid #f87171' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e30707' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f20707' }}
        >
          <Trash2 size={13} />
          Eliminar
        </button>
      </div>

    </div>
  )
}

export default ProductCard
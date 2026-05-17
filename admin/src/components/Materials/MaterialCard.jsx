// src/components/Materials/MaterialCard.jsx
import { Pencil, Trash2, Layers } from 'lucide-react'

function MaterialCard({ material, onEdit, onDelete }) {
  const { nombre, descripcion, imagen_url, es_sostenible } = material

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: '1.5px solid #7e4400',
        background: 'white',
        boxShadow: '0 2px 8px rgba(126,68,0,0.10)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 pt-3 pb-2"
        style={{
          background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 50%)',
          borderBottom: '1px solid #7e4400',
        }}
      >
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
            Material
          </span>
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}
          >
            #{material.id}
          </span>
        </div>
        <h3 className="font-bold text-base leading-tight text-white">{nombre}</h3>
      </div>

      {/* Imagen */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #e8d5a3' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#92590a' }}>
          Imagen
        </p>
        {imagen_url ? (
          <img
            src={imagen_url} alt={nombre}
            className="w-full h-36 object-cover rounded-xl"
            style={{ border: '1.5px solid #e8d5a3' }}
          />
        ) : (
          <div
            className="w-full h-36 rounded-xl flex flex-col items-center justify-center gap-2"
            style={{ backgroundColor: '#f5e6cc', border: '1.5px dashed #c8a055' }}
          >
            <Layers size={24} style={{ color: '#b8860b' }} />
            <span className="text-xs" style={{ color: '#92590a' }}>Sin imagen</span>
          </div>
        )}
      </div>

      {/* Descripción */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #e8d5a3' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#92590a' }}>
          Descripción
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">
          {descripcion || <span className="text-gray-300">Sin descripción</span>}
        </p>
      </div>

      {/* Sostenible */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #e8d5a3' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#92590a' }}>
          Sostenible
        </p>
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={
            es_sostenible
              ? { backgroundColor: '#c5f57d', color: '#070808', border: '1px solid #070808' }
              : { backgroundColor: '#b8f2fc', color: '#070808', border: '1px solid #070808' }
          }
        >
          {es_sostenible ? 'Sí' : 'No'}
        </span>
      </div>

      {/* Acciones */}
      <div className="flex items-center justify-end gap-2 px-4 py-2.5" style={{ backgroundColor: '#fffefc' }}>
        <button
          onClick={() => onEdit(material)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          style={{ color: '#f7f5f5', backgroundColor: '#166534', border: '1px solid #5cb85c' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#087508' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#166534' }}
        >
          <Pencil size={13} /> Editar
        </button>
        <button
          onClick={() => onDelete(material)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          style={{ color: '#f7f5f5', backgroundColor: '#f20707', border: '1px solid #f87171' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#e30707' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f20707' }}
        >
          <Trash2 size={13} /> Eliminar
        </button>
      </div>
    </div>
  )
}

export default MaterialCard
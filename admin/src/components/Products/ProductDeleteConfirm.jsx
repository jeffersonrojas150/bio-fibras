// src/components/Products/ProductDeleteConfirm.jsx
import { Trash2, X, Loader2 } from 'lucide-react'

function ProductDeleteConfirm({ product, onConfirm, onCancel, deleting }) {
  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
    >
      <div className="w-full max-w-sm mx-4 rounded-2xl shadow-2xl bg-white overflow-hidden">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <Trash2 size={24} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">¿Eliminar producto?</h3>
            <p className="text-sm text-gray-500 mt-1">
              Se eliminará permanentemente <strong>"{product.nombre}"</strong>. Esta acción no se puede deshacer.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
              style={{ borderColor: '#e5e7eb', color: '#6b7280', border: '1px solid #e5e7eb' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9fafb' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <X size={14} /> Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-colors"
              style={{ backgroundColor: deleting ? '#ccc' : '#f20707', border: '1px solid #f87171' }}
              onMouseEnter={e => { if (!deleting) e.currentTarget.style.backgroundColor = '#e30707' }}
              onMouseLeave={e => { if (!deleting) e.currentTarget.style.backgroundColor = '#f20707' }}
            >
              {deleting
                ? <><Loader2 size={14} className="animate-spin" /> Eliminando...</>
                : <><Trash2 size={14} /> Eliminar</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDeleteConfirm
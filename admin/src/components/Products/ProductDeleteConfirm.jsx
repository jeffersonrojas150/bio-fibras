import { Trash2, X } from 'lucide-react'

function ProductDeleteConfirm({ product, onConfirm, onCancel }) {
  if (!product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 size={26} className="text-red-500" />
          </div>
        </div>

        <h2 className="text-center text-lg font-bold text-gray-800 mb-1">
          ¿Eliminar producto?
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Se eliminará permanentemente{' '}
          <span className="font-semibold text-gray-700">"{product.nombre}"</span>.
          Esta acción no se puede deshacer.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <X size={15} /> Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={15} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDeleteConfirm
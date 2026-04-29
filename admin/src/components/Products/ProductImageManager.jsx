import { useState } from 'react'
import { Upload, Trash2, Star } from 'lucide-react'
import { uploadProductImage, deleteProductImage } from '../../api/products'

/**
 * Props:
 *  - productId : number
 *  - images    : [{ id, imagen_url, es_principal }]
 *  - onRefresh : () => void  — recarga el producto para actualizar imágenes
 */
function ProductImageManager({ productId, images = [], onRefresh }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    try {
      for (const file of files) {
        const fd = new FormData()
        fd.append('imagen', file)
        await uploadProductImage(productId, fd)
      }
      onRefresh()
    } catch (err) {
      console.error('Error al subir imagen:', err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  // DELETE /admin-api/productos/{productId}/imagenes/{imageId}/
  const handleDelete = async (imageId) => {
    try {
      await deleteProductImage(productId, imageId)
      onRefresh()
    } catch (err) {
      console.error('Error al eliminar imagen:', err)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Imágenes
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map(img => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border border-gray-200">
              <img src={img.imagen_url} alt="producto" className="w-full h-20 object-cover" />

              {img.es_principal && (
                <span className="absolute top-1 left-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Star size={9} /> Principal
                </span>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  title="Eliminar imagen"
                  className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <label
        className={`inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl border-2 border-dashed text-sm transition-colors
          ${uploading
            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
            : 'border-amber-400 text-amber-600 hover:bg-amber-50'
          }`}
      >
        <Upload size={15} />
        {uploading ? 'Subiendo...' : 'Subir imágenes'}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>
    </div>
  )
}

export default ProductImageManager
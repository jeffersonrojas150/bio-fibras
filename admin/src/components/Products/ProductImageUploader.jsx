import { ImagePlus, Trash2, Star, AlertCircle } from 'lucide-react'

function ProductImageUploader({
  images,
  newFiles,
  canAddMore,
  remaining,
  onFileSelect,
  onRemoveNewFile,
  onSetNewFileMain,
  onDeleteServer,
  onSetServerMain,
  fileInputRef,
}) {
  return (
    <div className="space-y-4">

      {/* Imágenes guardadas en el servidor */}
      {images.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Imágenes actuales
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map(img => (
              <div
                key={img.id}
                className="relative rounded-xl overflow-hidden border-2 group"
                style={{ borderColor: img.es_principal ? '#009929' : '#e5e7eb', aspectRatio: '1' }}
              >
                <img src={img.imagen_url} alt="" className="w-full h-full object-cover" />
                {img.es_principal && (
                  <span
                    className="absolute top-1 left-1 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#009929', color: 'white' }}
                  >
                    Principal
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!img.es_principal && (
                    <button
                      type="button"
                      onClick={() => onSetServerMain(img.id)}
                      title="Marcar como principal"
                      className="p-1.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white"
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDeleteServer(img.id)}
                    title="Eliminar"
                    className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Imágenes nuevas (pendientes de subir) */}
      {newFiles.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Nuevas imágenes (se subirán al guardar)
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {newFiles.map((nf, idx) => (
              <div
                key={idx}
                className="relative rounded-xl overflow-hidden border-2 group"
                style={{ borderColor: nf.es_principal ? '#5ccb5f' : '#d1d5db', aspectRatio: '1' }}
              >
                <img src={nf.preview} alt="" className="w-full h-full object-cover" />
                {nf.es_principal && (
                  <span
                    className="absolute top-1 left-1 text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#5ccb5f', color: 'white' }}
                  >
                    Principal
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!nf.es_principal && (
                    <button
                      type="button"
                      onClick={() => onSetNewFileMain(idx)}
                      title="Marcar como principal"
                      className="p-1.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-white"
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveNewFile(idx)}
                    title="Quitar"
                    className="p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón agregar / límite alcanzado */}
      {canAddMore ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onFileSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed text-sm font-semibold transition-colors"
            style={{ borderColor: '#0c0d0c', color: '#0c0d0c' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#faefd2' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <ImagePlus size={17} />
            Agregar imagen ({remaining} restantes)
          </button>
        </>
      ) : (
        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-xl">
          <AlertCircle size={15} />
          Límite de 7 imágenes alcanzado
        </div>
      )}

      <p className="text-xs text-gray-400">
        Pasa el cursor sobre una imagen para marcarla como principal o eliminarla.
      </p>
    </div>
  )
}

export default ProductImageUploader
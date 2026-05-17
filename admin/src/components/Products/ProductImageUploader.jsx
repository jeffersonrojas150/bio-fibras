import { Star, Trash2, ImagePlus, AlertCircle } from 'lucide-react'

function ProductImageUploader({
  images, newFiles, canAddMore, remaining,
  onFileSelect, onRemoveNewFile, onSetNewFileMain,
  onDeleteServer, onSetServerMain,
  fileInputRef,
  error, 
}) {
  const hasImages   = images.length > 0
  const hasNewFiles = newFiles.length > 0
  const totalImages = images.length + newFiles.length
  const hayPrincipal =
    images.some(img => img.es_principal) ||
    newFiles.some(nf => nf.es_principal)

  return (
    <div className="space-y-4">

      {/* Aviso si no hay imagen principal definida y hay imágenes */}
      {totalImages > 0 && !hayPrincipal && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
          style={{ backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #d97706' }}
        >
          <AlertCircle size={13} className="shrink-0" />
          <span>Ninguna imagen está marcada como principal. Usa <Star size={11} className="inline mx-0.5 text-amber-500" /> para marcarla.</span>
        </div>
      )}

      {/* Imágenes actuales (servidor) */}
      {hasImages && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#7e4400' }}>
            Imágenes actuales
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map(img => (
              <div
                key={img.id}
                className="relative rounded-xl overflow-hidden border-2 transition-colors flex flex-col"
                style={{ borderColor: img.es_principal ? '#166534' : '#e8d5a3' }}
              >
                {img.es_principal && (
                  <div
                    className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-xs font-bold text-white z-10"
                    style={{ backgroundColor: '#166534' }}
                  >
                    Principal
                  </div>
                )}
                <img
                  src={img.imagen_url}
                  alt="producto"
                  className="w-full aspect-square object-cover"
                />
                <div
                  className="flex items-center justify-center gap-2 px-2 py-2 border-t mt-auto"
                  style={{ borderColor: '#f0e6cc', backgroundColor: '#fffdf8' }}
                >
                  {!img.es_principal && (
                    <button
                      onClick={() => onSetServerMain(img.id)}
                      title="Marcar como principal"
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: '#b8860b' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef3c7' }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteServer(img.id)}
                    title="Eliminar imagen"
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: '#ef4444' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef2f2' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nuevas imágenes (pendientes de subir) */}
      {hasNewFiles && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#7e4400' }}>
            Nuevas imágenes <span className="text-gray-400 normal-case font-normal">(se subirán al guardar)</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {newFiles.map((nf, idx) => (
              <div
                key={idx}
                className="relative rounded-xl overflow-hidden border-2 transition-colors flex flex-col"
                style={{ borderColor: nf.es_principal ? '#166534' : '#e8d5a3' }}
              >
                {nf.es_principal && (
                  <div
                    className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-xs font-bold text-white z-10"
                    style={{ backgroundColor: '#166534' }}
                  >
                    Principal
                  </div>
                )}
                <img
                  src={nf.preview}
                  alt="nueva"
                  className="w-full aspect-square object-cover"
                />
                <div
                  className="flex items-center justify-center gap-2 px-2 py-2 border-t mt-auto"
                  style={{ borderColor: '#f0e6cc', backgroundColor: '#fffdf8' }}
                >
                  {!nf.es_principal && (
                    <button
                      onClick={() => onSetNewFileMain(idx)}
                      title="Marcar como principal"
                      className="p-1.5 rounded-lg transition-colors"
                      style={{ color: '#b8860b' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef3c7' }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                    >
                      <Star size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => onRemoveNewFile(idx)}
                    title="Quitar imagen"
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: '#ef4444' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef2f2' }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón agregar */}
      {canAddMore && (
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
            className="flex items-center justify-center sm:justify-start w-full sm:w-auto gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ backgroundColor: '#f5f5f5', color: '#211b05', border: '1px solid #1a1a1a' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d4d4d4' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
          >
            <ImagePlus size={16} />
            Agregar imagen
            <span
              className="px-1.5 py-0.5 rounded-md text-xs font-bold whitespace-nowrap"
              style={{ border: '1.5px dashed #4f4f4f', color: '#211b05', backgroundColor: 'rgba(255,255,255,0.5)' }}
            >
              {remaining} restante{remaining !== 1 ? 's' : ''}
            </span>
          </button>
        </>
      )}

      {/* Error de validación (imagen obligatoria) */}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={11} className="shrink-0" /> {error}
        </p>
      )}

      {/* Leyenda con iconos */}
      <p className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400 leading-tight">
        <span>Usa</span>
        <Star size={12} className="inline text-amber-500" />
        <span>para marcar la imagen principal y</span>
        <Trash2 size={12} className="inline text-red-400" />
        <span>para eliminar.</span>
      </p>

    </div>
  )
}

export default ProductImageUploader
import { useEffect } from 'react'
import { X } from 'lucide-react'

function ImageLightbox({ src, alt, onClose }) {
  useEffect(() => {
    if (!src) return
    const handleKeyDown = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [src, onClose])

  if (!src) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(3px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full transition-colors"
        style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)' }}
        aria-label="Cerrar"
      >
        <X size={22} />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
      />
    </div>
  )
}

export default ImageLightbox

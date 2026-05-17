// src/components/InitLoader.jsx
import { useEffect } from 'react'
import { Loader2, Package, Tag, ShoppingCart, Users, Layers } from 'lucide-react'
import { useAdminStore } from '../store/useAdminStore'

const ITEMS = [
  { icon: Package,      label: 'Productos'   },
  { icon: Tag,          label: 'Categorías'  },
  { icon: Layers,       label: 'Materiales'  },
  { icon: ShoppingCart, label: 'Órdenes'     },
  { icon: Users,        label: 'Usuarios'    },
]

export default function InitLoader() {
  const { loading, loadError, initialized, initializeData } = useAdminStore()

  useEffect(() => {
    initializeData()
  }, [initializeData])

  // Ya cargó todo — no muestra nada
  if (initialized) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-sm mx-4 rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#ffffff' }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 text-white text-center"
          style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 40%, #92590a 100%)' }}
        >
          <div className="flex items-center justify-center gap-3 mb-1">
            {loadError ? (
              <span className="text-2xl">⚠️</span>
            ) : (
              <Loader2 size={24} className="animate-spin text-white/90" />
            )}
            <h2 className="text-lg font-bold tracking-wide" style={{ fontFamily: 'Raleway, sans-serif' }}>
              {loadError ? 'Error de conexión' : 'Preparando el panel'}
            </h2>
          </div>
          <p className="text-xs text-white/70" style={{ fontFamily: 'Raleway, sans-serif' }}>
            {loadError
              ? 'No se pudo conectar con el servidor'
              : 'Cargando datos para una navegación rápida...'}
          </p>
        </div>

        {/* Lista de módulos */}
        <div className="px-6 py-5 space-y-3">
          {ITEMS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#f5e6cc' }}
              >
                <Icon size={15} style={{ color: '#b8860b' }} />
              </div>
              <span
                className="text-sm text-gray-600 flex-1"
                style={{ fontFamily: 'Raleway, sans-serif' }}
              >
                {label}
              </span>
              {loadError ? (
                <span className="text-xs font-semibold" style={{ color: '#ef4444' }}>
                  Error
                </span>
              ) : loading ? (
                <Loader2 size={13} className="animate-spin" style={{ color: '#b8860b' }} />
              ) : null}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t text-center"
          style={{ borderColor: '#f5e6cc', backgroundColor: '#fffdf7' }}
        >
          {loadError ? (
            <button
              onClick={() => initializeData()}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: '#b8860b', fontFamily: 'Raleway, sans-serif' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#92590a' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#b8860b' }}
            >
              Reintentar
            </button>
          ) : (
            <p className="text-xs text-gray-400" style={{ fontFamily: 'Raleway, sans-serif' }}>
              Esto solo ocurre una vez por sesión
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
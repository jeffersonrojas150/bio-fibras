// src/components/UI/NotificationPanel.jsx
import { useEffect, useRef } from 'react'
import { Bell, ShoppingCart, Package, User, X } from 'lucide-react'

const GOLD = 'linear-gradient(135deg, #d7ad44 0%, #b8941a 30%)'

const NOTIF_STYLES = {
  orden:   { icon: ShoppingCart, bg: '#f2d811', iconColor: '#080706' },
  stock:   { icon: Package,      bg: '#fa0505', iconColor: '#ffffff' },
  usuario: { icon: User, bg: '#52faec', iconColor: '#080706' },
}

function NotificationPanel({ notificaciones = [], onClose }) {
  const panelRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <>
      {/* Overlay con blur*/}
        <div
        className="fixed inset-0"
        style={{
            backgroundColor: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 9998,
        }}
        onClick={onClose}
        />

      {/* Panel */}
      <div
        ref={panelRef}
        className="
          fixed md:absolute
          inset-x-3 top-[72px]
          md:inset-auto md:top-12 md:right-0 md:w-80
          rounded-2xl shadow-2xl overflow-hidden
        "
        style={{
          zIndex: 9999,
          fontFamily: 'Raleway, sans-serif',
          background: '#f5f5f5',
          border: '1px solid #e0e0e0',
        }}
      >
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between"
          style={{ background: GOLD }}>
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-white" />
            <p className="font-bold text-white text-sm">Notificaciones</p>
          </div>
          <div className="flex items-center gap-2">
            {notificaciones.length > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white"
                style={{ color: '#b8941a' }}>
                {notificaciones.length}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-0.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X size={14} className="text-white" />
            </button>
          </div>
        </div>

        {/* Lista */}
        {notificaciones.length === 0 ? (
          <div className="py-10 text-center">
            <Bell size={28} className="mx-auto mb-2" style={{ color: '#d1d5db' }} />
            <p className="text-sm font-medium" style={{ color: '#6b7280' }}>
              Sin notificaciones
            </p>
            <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
              Todo está al día
            </p>
          </div>
        ) : (
          <div className="max-h-72 overflow-y-auto">
            {notificaciones.map((n, i) => {
              const style = NOTIF_STYLES[n.tipo] || NOTIF_STYLES.usuario
              const IconComponent = style.icon
              return (
                <div
                  key={i}
                  className="px-4 py-3 flex items-start gap-3 transition-colors cursor-default"
                  style={{
                    borderBottom: i < notificaciones.length - 1
                      ? '1px solid #e5e7eb'
                      : 'none',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#ebebeb'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Ícono */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: style.bg }}
                  >
                    <IconComponent size={14} style={{ color: style.iconColor }} strokeWidth={2.5} />
                  </div>

                  {/* Texto */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold" style={{ color: '#080706' }}>
                      {n.titulo}
                    </p>
                    <p className="text-xs mt-0.5 leading-relaxed"
                      style={{ color: '#6b7280' }}>
                      {n.mensaje}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Footer */}
        <div
          className="px-4 py-2.5"
          style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#efefef' }}
        >
          <p className="text-[10px] text-center" style={{ color: '#9ca3af' }}>
            Basado en los datos actuales del sistema
          </p>
        </div>
      </div>
    </>
  )
}

export default NotificationPanel
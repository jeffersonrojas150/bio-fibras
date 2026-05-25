// src/components/Topbar.jsx
import { useState } from 'react'
import { Bell, Menu, Globe } from 'lucide-react'
import logo from '../assets/logo.png'
import NotificationPanel from './UI/NotificationPanel'

const GOLD = 'linear-gradient(135deg, #d7ad44 0%, #b8941a 30%)'

function Topbar({ onMenuClick, notificaciones = [] }) {
  const [showNotif, setShowNotif] = useState(false)

  return (
    <header
      className="px-4 md:px-6 py-3 flex items-center justify-between shadow-md rounded-b-2xl mx-2 z-10"
      style={{ background: GOLD }}
    >
      {/* ── Izquierda: Logo + Texto ── */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Biofibras" className="h-8 md:h-10 w-auto" />
        <div>
          <h1 className="font-semibold tracking-widest text-base md:text-lg text-white leading-tight">
            BIOFIBRAS
          </h1>
          <p className="text-[10px] md:text-xs tracking-wide text-white/80">
            Panel Administrativo
          </p>
        </div>
      </div>

      {/* ── Derecha ── */}
      <div className="flex items-center gap-2 md:gap-3">

        {/* Campana */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(prev => !prev)}
            className="relative p-2.5 rounded-xl hover:bg-white/20 active:bg-white/30 transition-colors"
          >
            <Bell size={24} className="text-white" />
            {notificaciones.length > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center
                           bg-red-500 border-2 border-white rounded-full text-white font-bold"
                style={{ fontSize: '9px', lineHeight: 1 }}
              >
                {notificaciones.length > 9 ? '9+' : notificaciones.length}
              </span>
            )}
          </button>

          {/* Panel — componente separado */}
          {showNotif && (
            <NotificationPanel
              notificaciones={notificaciones}
              onClose={() => setShowNotif(false)}
            />
          )}
        </div>

        <div className="w-px h-6 bg-white/30 hidden sm:block" />

        {/* Ver Tienda */}
        <a
          href={import.meta.env.VITE_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl font-semibold border-2 transition-all whitespace-nowrap text-sm"
          style={{ borderColor: 'white', color: 'white', backgroundColor: 'transparent' }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.color = '#b8941a'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'white'
          }}
        >
          <Globe size={18} />
          <span className="hidden sm:inline">Ver Tienda</span>
        </a>

        {/* Hamburguesa — solo móvil */}
        <button
          onClick={onMenuClick}
          className="md:hidden flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-xl
                     text-white hover:bg-white/20 active:bg-white/30 transition-colors"
        >
          <Menu size={22} />
          <span className="text-[9px] font-semibold tracking-widest uppercase leading-none">
            Menú
          </span>
        </button>

      </div>
    </header>
  )
}

export default Topbar
// src/components/Topbar.jsx
import { Bell, Menu, Globe } from 'lucide-react'
import logo from '../assets/logo.png'

const goldGradient = 'linear-gradient(135deg, #d7ad44 0%, #b8941a 25%)'

function Topbar({ onMenuClick }) {
  return (
    <header
      className="px-4 md:px-6 py-3 flex items-center justify-between shadow-md rounded-b-2xl mx-2 z-10"
      style={{ background: goldGradient }}
    >
      {/* ── Logo + Texto ── */}
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

      <div className="flex items-center gap-2 md:gap-3">

        {/* Campana */}
        <button className="relative p-2.5 rounded-xl hover:bg-white/20 active:bg-white/30 transition-colors">
          <Bell size={24} className="text-white" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
        </button>

        <div className="w-px h-6 bg-white/30" />

        {/* Ver Tienda */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border-2 transition-all whitespace-nowrap text-sm"
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
          <span>Ver Tienda</span>
        </a>

        {/* ── Hamburguesa  ── */}
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
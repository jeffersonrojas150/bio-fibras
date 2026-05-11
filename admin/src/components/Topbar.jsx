// src/components/Topbar.jsx
import { Bell, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

function Topbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header
      className="px-6 py-4 flex items-center justify-between shadow-md rounded-b-2xl mx-2"
      style={{ backgroundColor: '#b8860b' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Biofibras" className="h-10 w-auto" />
        <div>
          <h1 className="font-semibold tracking-widest text-lg text-white">BIOFIBRAS</h1>
          <p className="text-xs tracking-wide  text-white">Panel Administrativo</p>
        </div>
      </div>

      {/* Derecha */}
      <div className="flex items-center gap-3">

        {/* Campana */}
        <button className="relative p-2 rounded-lg hover:bg-white/20 transition-colors">
          <Bell size={18} className="text-white" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
        </button>

        <div className="w-px h-6 bg-white/30" />

        {/* Usuario */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">Administrador</p>
            <p className="text-xs text-white/70">admin@biofibras.com</p>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-amber-800 text-sm font-bold bg-white shadow">
            A
          </div>
        </div>

        <div className="w-px h-6 bg-white/30" />

        {/* Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all"
          style={{ borderColor: 'white', color: 'white', backgroundColor: 'transparent' }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.color = '#cc0000'
            e.currentTarget.style.borderColor = 'white'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'white'
            e.currentTarget.style.borderColor = 'white'
          }}
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}

export default Topbar
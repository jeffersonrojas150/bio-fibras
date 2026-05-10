import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, Package, Tag, ShoppingCart,
  Users, Layers, Moon, Sun, LogOut,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard },
  { to: '/products', label: 'Productos', icon: Package },
  { to: '/categories', label: 'Categorías', icon: Tag },
  { to: '/orders', label: 'Órdenes', icon: ShoppingCart },
  { to: '/materials', label: 'Materiales', icon: Layers },
  { to: '/users', label: 'Usuarios', icon: Users },
]

function Sidebar() {
  const [darkMode, setDarkMode] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-56 flex flex-col bg-white border-r border-gray-200">

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold w-full text-white"
            style={({ isActive }) => ({
            backgroundColor: isActive ? 'white' : '#b8860b',
            border: isActive ? '1px solid #92590a' : '2px solid transparent',
            color: isActive ? '#92590a' : 'white',
          })}
            onMouseEnter={e => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
              if (!isActive) e.currentTarget.style.backgroundColor = '#92590a'
            }}
            onMouseLeave={e => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
              if (!isActive) e.currentTarget.style.backgroundColor = '#b8860b'
            }}
          >
            <Icon size={17} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

       
          

      {/* Cerrar sesión */}
      <div className="px-3 pb-4 pt-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-sm font-semibold transition-all border"
          style={{ backgroundColor: '#cc0000', borderColor: '#cc0000', color: 'white' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#cc0000' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#cc0000'; e.currentTarget.style.color = 'white' }}
        >
          <LogOut size={17} strokeWidth={2} />
          <span>Cerrar Sesión</span>
        </button>
      </div>

    </aside>
  )
}

export default Sidebar
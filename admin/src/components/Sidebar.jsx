// src/components/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, ShoppingCart,
  Users, Layers, LogOut, X, Menu,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/',           label: 'Inicio',      icon: LayoutDashboard },
  { to: '/products',   label: 'Productos',   icon: Package         },
  { to: '/categories', label: 'Categorías',  icon: Tag             },
  { to: '/orders',     label: 'Órdenes',     icon: ShoppingCart    },
  { to: '/materials',  label: 'Materiales',  icon: Layers          },
  { to: '/users',      label: 'Usuarios',    icon: Users           },
]

const goldGradient = 'linear-gradient(135deg, #d7ad44 0%, #b8941a 50%)'
const goldHover    = 'linear-gradient(135deg, #b8941a 0%, #996f0d 50%)'

function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = (user?.username?.[0] ?? user?.email?.[0] ?? 'A').toUpperCase()

  return (
    <>
      {/* ── Overlay  ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Sidebar desktop  ── */}
      <aside className="hidden md:flex w-56 flex-col bg-white border-r border-gray-200 h-full shrink-0">
        <SidebarContent
          initials={initials}
          user={user}
          onClose={() => {}}
          onLogout={handleLogout}
          showClose={false}
        />
      </aside>

      {/* ── Drawer móvil ── */}
      <div
        className={`
          fixed top-0 left-0 h-full z-[70] flex items-stretch
          md:hidden
          transform transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        <div
          className="w-64 flex flex-col shadow-2xl overflow-hidden"
          style={{
            borderRadius: '0 2rem 0rem 0',
            background: 'white',
          }}
        >
          <SidebarContent
            initials={initials}
            user={user}
            onClose={onClose}
            onLogout={handleLogout}
            showClose={true}
          />
        </div>
      </div>
    </>
  )
}

function SidebarContent({ initials, user, onClose, onLogout, showClose }) {
  return (
    <div className="flex flex-col h-full">

      {/* Cabecera*/}
      {showClose && (
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ background: goldGradient }}
        >
          <div className="flex items-center gap-2">
            <Menu size={18} className="text-white" />
            <span className="text-white font-bold tracking-widest text-sm">MENÚ</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors text-white/70 hover:text-white hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Nav links  */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold w-full"
            style={({ isActive }) => ({
              background: isActive ? 'white' : goldGradient,
              border:     isActive ? '2px solid #92590a' : '2px solid transparent',
              color:      isActive ? '#92590a' : 'white',
            })}
            onMouseEnter={e => {
              const active = e.currentTarget.getAttribute('aria-current') === 'page'
              if (!active) e.currentTarget.style.background = goldHover
            }}
            onMouseLeave={e => {
              const active = e.currentTarget.getAttribute('aria-current') === 'page'
              if (!active) e.currentTarget.style.background = goldGradient
            }}
          >
            <Icon size={18} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Tarjeta bienvenido  */}
      <div className="p-3 border-t border-gray-100 shrink-0">
        <div
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{ border: '1.5px solid #e8d5a3' }}
        >
          <div
            className="px-4 pt-4 pb-7 flex flex-col items-center text-center"
            style={{ background: goldGradient }}
          >
            <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-2">
              Panel Admin
            </p>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shadow-md"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.5)',
              }}
            >
              {initials}
            </div>
          </div>

          <div className="bg-white px-4 pt-3 pb-4 flex flex-col items-center text-center">
            <h3 className="font-bold text-gray-800 text-sm">Bienvenido</h3>
            <div className="flex items-center gap-1.5 mt-0.5 mb-3">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-gray-500">
                {user?.is_staff ? 'Administrador' : user?.username ?? 'Admin'}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold text-white transition-colors"
              style={{ background: goldGradient }}
              onMouseEnter={e => { e.currentTarget.style.background = goldHover }}
              onMouseLeave={e => { e.currentTarget.style.background = goldGradient }}
            >
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Sidebar
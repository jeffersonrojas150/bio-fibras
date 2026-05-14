// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, ShoppingCart,
  Users, Layers,
} from 'lucide-react'

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

function Sidebar() {
  return (
    <aside className="w-56 flex flex-col bg-white border-r border-gray-200">
      <nav className="flex-1 px-3 py-4 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold w-full"
            style={({ isActive }) => ({
              background:      isActive ? 'white' : goldGradient,
              border:          isActive ? '2px solid #92590a' : '2px solid transparent',
              color:           isActive ? '#92590a' : 'white',
            })}
            onMouseEnter={e => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
              if (!isActive) e.currentTarget.style.background = goldHover
            }}
            onMouseLeave={e => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page'
              if (!isActive) e.currentTarget.style.background = goldGradient
            }}
          >
            <Icon size={17} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
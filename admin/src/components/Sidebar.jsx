import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Layers,
  Moon,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard },
  { to: '/products', label: 'Productos', icon: Package },
  { to: '/categories', label: 'Categorías', icon: Tag },
  { to: '/orders', label: 'Órdenes', icon: ShoppingCart },
  { to: '/materials', label: 'Materiales', icon: Layers },
  { to: '/users', label: 'Usuarios', icon: Users },
]

function Sidebar() {
  return (
    <aside className="w-52 flex flex-col bg-white border-r border-gray-200">

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold w-full ${
                isActive ? 'text-white' : 'text-white'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#92590a' : '#b8860b',
            })}
          >
            <Icon size={16} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Dark mode */}
      <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Moon size={16} />
          <span>Dark mode</span>
        </div>
        <div className="w-10 h-5 bg-gray-300 rounded-full cursor-pointer" />
      </div>
    </aside>
  )
}

export default Sidebar
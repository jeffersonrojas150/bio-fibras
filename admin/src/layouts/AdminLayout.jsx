import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Topbar from '../components/Topbar'
import Sidebar from '../components/Sidebar'

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* Topbar */}
      <Topbar onMenuClick={() => setMobileOpen(true)} />

      {/* Cuerpo */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Overlay oscuro para modo celular */}
        {mobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AdminLayout
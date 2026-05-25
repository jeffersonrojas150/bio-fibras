import { useState, useEffect, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import Topbar from '../components/Topbar'
import Sidebar from '../components/Sidebar'
import { getDashboard } from '../api/dashboard'

function AdminLayout() {
  const [mobileOpen, setMobileOpen]       = useState(false)
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    getDashboard()
      .then(res => setDashboardData(res.data))
      .catch(() => {})
  }, [])

  const notificaciones = useMemo(() => {
    if (!dashboardData) return []
    const lista = []

    if (dashboardData.ordenes_pendientes > 0)
      lista.push({
        tipo:   'orden',
        titulo: 'Órdenes pendientes',
        mensaje: `Tienes ${dashboardData.ordenes_pendientes} orden(es) sin atender`,
      })

    if (dashboardData.productos_sin_stock > 0)
      lista.push({
        tipo:   'stock',
        titulo: 'Productos sin stock',
        mensaje: `${dashboardData.productos_sin_stock} producto(s) se han agotado`,
      })

    const recientes = dashboardData.ordenes_recientes?.slice(0, 3) || []
    recientes.forEach(o => {
      lista.push({
        tipo:   'usuario',
        titulo: `Nueva orden #${o.numero_orden || o.id}`,
        mensaje: `${o.usuario_nombre || o.usuario_email?.split('@')[0]} — S/ ${parseFloat(o.total).toFixed(2)}`,
      })
    })

    return lista
  }, [dashboardData])

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Topbar
        onMenuClick={() => setMobileOpen(true)}
        notificaciones={notificaciones}
      />
      <div className="flex flex-1 overflow-hidden relative">
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
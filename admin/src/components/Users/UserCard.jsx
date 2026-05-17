// src/components/Users/UserCard.jsx
import { Users2 } from 'lucide-react'

function UserCard({ user: u }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: '1.5px solid #7e4400',
        background: 'white',
        boxShadow: '0 2px 8px rgba(126,68,0,0.10)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 pt-3 pb-2"
        style={{
          background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 50%)',
          borderBottom: '1px solid #7e4400',
        }}
      >
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
            Usuario
          </span>
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}
          >
            #{u.id}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: 'white', border: '2px solid rgba(255,255,255,0.5)' }}
          >
            {(u.username?.[0] ?? '?').toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-white truncate">{u.username || '—'}</p>
            <p className="text-white/70 text-xs truncate">{u.email || '—'}</p>
          </div>
        </div>
      </div>

      {/* Nombre completo */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #e8d5a3' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#92590a' }}>
          Nombre completo
        </p>
        <p className="text-sm font-medium text-gray-800">
          {u.first_name || u.last_name
            ? `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim()
            : <span className="text-gray-300">—</span>
          }
        </p>
      </div>

      {/* Rol */}
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #e8d5a3' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#92590a' }}>
          Rol
        </p>
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={u.is_staff
            ? { backgroundColor: '#ffe070', color: '#0d0d0d', border: '1px solid #0d0d0d' }
            : { backgroundColor: '#f5f5f5', color: '#0d0d0d', border: '1px solid #0d0d0d' }
          }
        >
          {u.is_staff ? 'Admin' : 'Cliente'}
        </span>
      </div>

      {/* Fecha de registro */}
      <div className="px-4 py-3" style={{ backgroundColor: '#fffefc' }}>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#92590a' }}>
          Registro
        </p>
        <p className="text-xs text-gray-600">
          {u.date_joined
            ? new Date(u.date_joined).toLocaleString('es-PE', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
                })
            : '—'
            }
        </p>
      </div>
    </div>
  )
}

export default UserCard
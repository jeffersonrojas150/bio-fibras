// src/pages/Dashboard/Dashboard.jsx
import {
  ShoppingCart, Clock, Send, CheckCircle2,
  Package, Users, AlertTriangle,
  TrendingUp, BarChart2, RefreshCw,
} from 'lucide-react'

// Ícono de Sol peruano (S/)
function SolIcon({ size = 24, color = '#080706' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="1" y="18" fontSize="15" fontWeight="bold" fill={color} fontFamily="Raleway, sans-serif">S/</text>
    </svg>
  )
}
import {
  BarChart, Bar, PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Legend,
} from 'recharts'
import { useDashboard, fmt, fmtMes } from './hooks/useDashboard'

// ─── Gradiente oficial ─────────────────
const GOLD = 'linear-gradient(135deg, #d7ad44 0%, #b8941a 30%)'

// ─── Colores de badges ─────────────────────────────────
const ESTADO_PAGO_COLORS = {
  pendiente: { bg: '#f2d811', color: '#080706', label: 'Pendiente' },
  pagado:    { bg: '#c4fa82', color: '#080706', label: 'Pagado'    },
  rechazado: { bg: '#ba0404', color: '#ffffff', label: 'Rechazado' },
  cancelado: { bg: '#fa0505', color: '#ffffff', label: 'Cancelado' },
}
const ESTADO_ORDEN_COLORS = {
  pendiente: { bg: '#f2d811', color: '#080706', label: 'Pendiente' },
  enviado:   { bg: '#52faec', color: '#080706', label: 'Enviado'   },
  entregado: { bg: '#3c95fa', color: '#080706', label: 'Entregado' },
  cancelado: { bg: '#fa0505', color: '#ffffff', label: 'Cancelado' },
}

// Colores para el pie chart
const PIE_COLORS = ['#f2d811', '#52faec', '#3c95fa']

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function Skeleton({ h = 'h-10', w = 'w-full' }) {
  return <div className={`${h} ${w} rounded-xl animate-pulse bg-gray-100`} />
}

// Badge
function Badge({ value, map }) {
  const cfg = map[value] || { bg: '#f5f5f5', color: '#555', label: value }
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}` }}
    >
      {cfg.label}
    </span>
  )
}

function StatCard({ icon: Icon, label, value, sub, iconBg, iconColor, loading }) {
  return (
    <div
      className="rounded-2xl p-4 md:p-5 flex items-center gap-4 shadow-sm bg-white"
      style={{ border: '1.5px solid #e5e7eb' }}
    >
      <div
        className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={24} style={{ color: iconColor }} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 truncate">{label}</p>
        {loading
          ? <Skeleton h="h-7" w="w-24" />
          : <p className="text-xl md:text-2xl font-bold leading-tight text-gray-800 truncate"
              style={{ fontFamily: 'Raleway, sans-serif' }}>{value}</p>
        }
        {sub && !loading && (
          <p className="text-xs mt-0.5 text-gray-400 truncate">{sub}</p>
        )}
      </div>
    </div>
  )
}

function EstadoCard({ icon: Icon, label, value, bg, color, loading }) {
  return (
    <div
      className="p-4 flex items-center gap-3 shadow-sm"
      style={{
        backgroundColor: bg,
        clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 50%, calc(100% - 24px) 100%, 0 100%, 0 0)',
        borderRadius: '12px 0 0 12px',
        minHeight: '80px',
      }}
    >
      <Icon size={20} style={{ color }} />
      <div>
        <p className="text-xs font-semibold uppercase" style={{ color }}>{label}</p>
        {loading
          ? <div className="h-6 w-12 mt-1 rounded-md animate-pulse bg-black/10" />
          : <p className="text-2xl font-bold" style={{ color, fontFamily: 'Raleway, sans-serif' }}>{value ?? '—'}</p>
        }
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl shadow-lg px-4 py-3 text-sm bg-white"
      style={{fontFamily: 'Raleway, sans-serif' }}>
      <p className="font-bold mb-1" style={{ color: '#7e4400' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.name === 'Ingresos' ? fmt(p.value) : p.value}</strong>
        </p>
      ))}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
function Dashboard() {
  const { data, loading, error, fetchData, barData, pieData, est, mostrarEstimacion } = useDashboard()

  return (
    <div className="space-y-5" style={{ fontFamily: 'Raleway, sans-serif' }}>

      {/* ── Header ── */}
      <div className="rounded-2xl shadow-md overflow-hidden">
        <div className="px-4 md:px-6 py-4 md:py-5 flex items-center justify-between gap-3"
          style={{ background: GOLD }}>
          <div className="flex items-center gap-3">
            <BarChart2 size={24} strokeWidth={2} className="text-white/90 shrink-0" />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white tracking-wide">Dashboard</h1>
              <p className="text-xs md:text-sm text-white/75 hidden sm:block">
                Resumen general del panel administrativo
              </p>
            </div>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold bg-white transition-all disabled:opacity-60 shrink-0"
            style={{ border: '2px solid white', color: '#b8941a' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#080706'
              e.currentTarget.style.color = '#d7ad44'
              e.currentTarget.style.borderColor = '#080706'
              e.currentTarget.style.transform = 'scale(1.04)'
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.color = '#b8941a'
              e.currentTarget.style.borderColor = 'white'
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-3"
          style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #080706' }}>
          <AlertTriangle size={16} className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={fetchData} className="underline text-xs shrink-0">Reintentar</button>
        </div>
      )}

      {/* ── Cards métricas ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard loading={loading} icon={ShoppingCart} label="Total Órdenes"
          value={data?.total_ordenes ?? '—'} sub={`${data?.ordenes_pendientes ?? 0} pendientes`}
          iconBg="#f2d811" iconColor="#080706" />


        <StatCard loading={loading} icon={SolIcon} label="Ingresos Pagados"
          value={data ? fmt(data.ingresos_pagados) : '—'}
          sub=" "
          iconBg="#c4fa82" iconColor="#080706" />

        <StatCard loading={loading} icon={Package} label="Productos Activos"
          value={data?.total_productos ?? '—'}
          sub={data?.productos_sin_stock > 0 ? `${data.productos_sin_stock} sin stock` : 'Stock completo'}
          iconBg="#fabf37" iconColor="#080706" />
        <StatCard loading={loading} icon={Users} label="Usuarios"
          value={data?.total_usuarios ?? '—'} sub="Clientes registrados"
          iconBg="#df72f2" iconColor="#080706" />
      </div>

      {/* ── Cards estado órdenes ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <EstadoCard loading={loading} icon={Clock}
          label="Pendientes" value={data?.ordenes_pendientes} bg="#f2d811" color="#080706" />
        <EstadoCard loading={loading} icon={Send}
          label="Enviadas" value={data?.ordenes_enviadas} bg="#52faec" color="#080706" />
        <EstadoCard loading={loading} icon={CheckCircle2}
          label="Entregadas" value={data?.ordenes_entregadas} bg="#3c95fa" color="#080706" />
      </div>

      {/* ── Gráficas ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Barras */}
        <div className="xl:col-span-2 rounded-2xl shadow-sm overflow-hidden"
          >
          <div className="px-4 py-3" style={{ background: GOLD }}>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-white/90" />
              <div>
                <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  Ingresos por Mes
                </h2>
                <p className="text-xs text-white/70">Últimos 6 meses</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            {loading
              ? <Skeleton h="h-52" />
              : barData.length === 0
                ? <p className="text-center py-16 text-sm text-gray-400">Sin datos de ingresos</p>
                : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="mes" tick={{ fontSize: 10, fill: '#6b7280', fontFamily: 'Raleway' }} />
                      <YAxis
                        tickFormatter={v => `S/${v.toLocaleString('es-PE')}`}
                        tick={{ fontSize: 10, fill: '#6b7280', fontFamily: 'Raleway' }}
                        width={65}
                        tickCount={6}
                        domain={[0, 'auto']}
                      />
                                            <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Raleway', color: '#080706' }} />
                      <Bar dataKey="Ingresos" fill="#b8941a" radius={[6,6,0,0]} />
                      <Bar dataKey="Órdenes"  fill="#009929" radius={[6,6,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )
            }
          </div>
        </div>

        {/* Torta */}
        <div className="rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3" style={{ background: GOLD }}>
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} className="text-white/90" />
              <div>
                <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
                  Estado de Órdenes
                </h2>
                <p className="text-xs text-white/70">Distribución actual</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-white">
            {loading
              ? <Skeleton h="h-52" />
              : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="42%"
                      innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} stroke="none" strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v, n) => [v, n]}
                      contentStyle={{ fontFamily: 'Raleway, sans-serif', borderRadius: 12, border: '1px solid #cfcfcf' }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: 11, color: '#080706', fontWeight: 400 }}
                      formatter={(value) => (
                        <span style={{ color: '#080706', fontSize: 11, fontWeight: 400 }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )
            }
          </div>
        </div>
      </div>

      {/* ── Estimación del mes ──
      {!loading && mostrarEstimacion && (
        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ border: '1px solid #080706' }}>
          <div className="px-4 py-3" style={{ background: GOLD }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-white/90" />
                <div>
                  <h2 className="text-sm font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
                    Estimación — {fmtMes(est.mes)}
                  </h2>
                  <p className="text-xs text-white/70">
                    {est.dias_transcurridos} de {est.dias_totales_mes} días transcurridos
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white"
                style={{ color: '#b8941a', border: '1px solid #080706' }}>
                Proyección
              </span>
            </div>
          </div>
          <div className="p-4 bg-white space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Ingresos reales', value: fmt(est.ingresos_reales),     highlight: false },
                { label: 'Órdenes reales',  value: est.ordenes_reales,           highlight: false },
                { label: 'Est. ingresos',   value: fmt(est.estimacion_ingresos), highlight: true  },
                { label: 'Est. órdenes',    value: est.estimacion_ordenes,       highlight: true  },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="rounded-xl p-3 text-center"
                  style={{
                    backgroundColor: highlight ? '#c4fa82' : '#f9fafb',
                    border: '1px solid #080706',
                  }}>
                  <p className="text-xs font-medium mb-1 text-gray-600">{label}</p>
                  <p className="text-base md:text-lg font-bold"
                    style={{ color: highlight ? '#166534' : '#1f2937', fontFamily: 'Raleway, sans-serif' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1 text-gray-600">
                <span>Progreso del mes</span>
                <span className="font-semibold">
                  {Math.round((est.dias_transcurridos / est.dias_totales_mes) * 100)}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: '#f3f4f6', border: '1px solid #080706' }}>
                <div className="h-full rounded-full"
                  style={{
                    width: `${Math.round((est.dias_transcurridos / est.dias_totales_mes) * 100)}%`,
                    backgroundColor: '#9c6814',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      ── fin Estimación ── */}

      {/* ── Tabla órdenes recientes ── */}
      <div className="rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 md:px-6 py-4" style={{ background: GOLD }}>
          <div className="flex items-center gap-3">
            <ShoppingCart size={18} className="text-white/90" />
            <div>
              <h2 className="text-sm md:text-base font-bold text-white" style={{ fontFamily: 'Raleway, sans-serif' }}>
                Órdenes Recientes
              </h2>
              <p className="text-xs text-white/70 hidden sm:block">
                Últimas órdenes registradas en el sistema
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-4 space-y-3 bg-white">
            {[...Array(4)].map((_, i) => <Skeleton key={i} h="h-10" />)}
          </div>
        ) : !data?.ordenes_recientes?.length ? (
          <p className="text-center py-12 text-sm text-gray-400 bg-white">No hay órdenes recientes</p>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider"
                    style={{ background: GOLD, color: '#f3f4f6' }}>
                    {['N° Orden', 'Cliente', 'Total', 'Estado Orden', 'Estado Pago', 'Fecha'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.ordenes_recientes.map((o, i) => (
                    <tr key={o.id}
                      className="border-t transition-colors duration-150"
                      style={{ borderColor: '#cfcfcf', backgroundColor: i % 2 === 0 ? '#ffffff' : '#f5f5f5' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e6e6e6')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#ffffff' : '#f5f5f5')}
                    >
                      <td className="px-4 py-3 font-bold text-xs" style={{ color: '#92590a' }}>
                        #{o.numero_orden || o.id}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">
                          {o.usuario_nombre || o.usuario_email?.split('@')[0] || `Usuario #${o.usuario}`}
                        </p>
                        {o.usuario_email && (
                          <p className="text-xs text-gray-400">{o.usuario_email}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold" style={{ color: '#92590a' }}>
                        S/ {parseFloat(o.total).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge value={o.estado_orden} map={ESTADO_ORDEN_COLORS} />
                      </td>
                      <td className="px-4 py-3">
                        <Badge value={o.estado_pago} map={ESTADO_PAGO_COLORS} />
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {o.fecha_creacion
                          ? new Date(o.fecha_creacion).toLocaleDateString('es-PE', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Móvil */}
            <div className="md:hidden p-4 space-y-3 bg-white">
              {data.ordenes_recientes.map(o => (
                <div key={o.id} className="rounded-xl p-4 space-y-2"
                  style={{ backgroundColor: '#f9fafb', border: '1px solid #cfcfcf' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm" style={{ color: '#92590a' }}>
                      #{o.numero_orden || o.id}
                    </span>
                    <span className="text-xs text-gray-400">
                      {o.fecha_creacion
                        ? new Date(o.fecha_creacion).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
                        : '—'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {o.usuario_nombre || o.usuario_email?.split('@')[0] || `Usuario #${o.usuario}`}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-gray-800">
                      S/ {parseFloat(o.total).toFixed(2)}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      <Badge value={o.estado_orden} map={ESTADO_ORDEN_COLORS} />
                      <Badge value={o.estado_pago}  map={ESTADO_PAGO_COLORS}  />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  )
}

export default Dashboard
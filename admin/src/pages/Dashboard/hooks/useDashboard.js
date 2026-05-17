// src/pages/Dashboard/hooks/useDashboard.js
import { useEffect, useState, useCallback } from 'react'
import { getDashboard } from '../../../api/dashboard'

export function useDashboard() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getDashboard()
        setData(res.data)
    } catch {
      setError('No se pudo cargar el dashboard. Verifica tu conexión.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Datos derivados para las gráficas ──────────────────────────────────────

  const barData = (data?.ingresos_por_mes || []).map(m => ({
    mes:      fmtMes(m.mes),
    Ingresos: parseFloat(m.ingresos),
    Órdenes:  m.ordenes,
  }))

  const pieData = data ? [
    { name: 'Pendientes', value: data.ordenes_pendientes },
    { name: 'Enviadas',   value: data.ordenes_enviadas   },
    { name: 'Entregadas', value: data.ordenes_entregadas },
  ] : []

  const est                = data?.estimacion_mes_actual
  const mostrarEstimacion  = est?.tiene_datos_suficientes === true

  return {
    data,
    loading,
    error,
    fetchData,
    barData,
    pieData,
    est,
    mostrarEstimacion,
  }
}

// ── Helpers exportados para usar en el componente ─────────────────────────────

export const fmt = (v) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(parseFloat(v) || 0)

export const fmtMes = (m) => {
  if (!m) return ''
  const [y, mo] = m.split('-')
  const nombres = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  return `${nombres[parseInt(mo, 10) - 1]} ${y}`
}
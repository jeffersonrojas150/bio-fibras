// src/pages/Orders/hooks/useOrderDetail.js
import { useEffect, useState, useCallback } from 'react'
import { getOrder, updateOrder } from '../../../api/orders'

export function useOrderDetail(id) {
  const [order,   setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [toast,   setToast]   = useState(null)

  const [estadoPago,  setEstadoPago]  = useState('')
  const [estadoOrden, setEstadoOrden] = useState('')

  const [pagFile,      setPagFile]      = useState(null)
  const [pagPreview,   setPagPreview]   = useState(null)
  const [envioFile,    setEnvioFile]    = useState(null)
  const [envioPreview, setEnvioPreview] = useState(null)

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const fetchOrder = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getOrder(id)
      const o   = res.data
      setOrder(o)
      setEstadoPago(o.estado_pago)
      setEstadoOrden(o.estado_orden)
    } catch (e) {
      console.error(e)
      showToast('No se pudo cargar la orden', 'error')
    } finally {
      setLoading(false)
    }
  }, [id, showToast])

  useEffect(() => { fetchOrder() }, [fetchOrder])

  function handleFileChange(file, setFile, setPreview) {
    if (!file) return
    setFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function clearFile(setFile, setPreview) {
    setFile(null)
    setPreview(null)
  }

  const hasChanges = order && (
    estadoPago  !== order.estado_pago  ||
    estadoOrden !== order.estado_orden ||
    pagFile   !== null ||
    envioFile !== null
  )

  async function handleSave() {
    setSaving(true)
    try {
      if (pagFile || envioFile) {
        const fd = new FormData()
        fd.append('estado_pago',  estadoPago)
        fd.append('estado_orden', estadoOrden)
        if (pagFile)   fd.append('comprobante_pago',  pagFile)
        if (envioFile) fd.append('comprobante_envio', envioFile)
        await updateOrder(id, fd)
      } else {
        await updateOrder(id, { estado_pago: estadoPago, estado_orden: estadoOrden })
      }
      showToast('Orden actualizada correctamente')
      clearFile(setPagFile, setPagPreview)
      clearFile(setEnvioFile, setEnvioPreview)
      fetchOrder()
    } catch (e) {
      console.error(e)
      showToast('Error al guardar los cambios', 'error')
    } finally {
      setSaving(false)
    }
  }

  return {
    order, loading, saving, toast, hasChanges,
    estadoPago,  setEstadoPago,
    estadoOrden, setEstadoOrden,
    pagFile,    pagPreview,
    envioFile,  envioPreview,
    handleFileChange, clearFile,
    setPagFile, setPagPreview, setEnvioFile, setEnvioPreview,
    handleSave,
  }
}
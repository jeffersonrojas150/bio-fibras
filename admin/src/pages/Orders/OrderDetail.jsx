import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Package, User, MapPin, CreditCard,
  FileImage, CheckCircle, Clock, XCircle, Truck,
  Save, Upload, X, AlertCircle, Building2
} from 'lucide-react'
import { getOrder, updateOrder } from '../../api/orders'

// ─── Paleta ──────────────────────────────────────────────────────────────────
const C = {
  mostaza:    '#b8860b',
  cafeMedio:  '#92590a',
  cafeOscuro: '#7e4400',
  verde:      '#009929',
  bgVerde:    '#f0fdf4',
  bgCafe:     '#f5e6cc',
}

// ─── Estados alineados con Django choices ────────────────────────────────────
const ESTADO_PAGO_OPTIONS = [
  { value: 'pendiente',  label: 'Pendiente',  bg: '#fff8e1', color: '#b8860b', Icon: Clock       },
  { value: 'pagado',     label: 'Pagado',     bg: '#f0fdf4', color: '#009929', Icon: CheckCircle },
  { value: 'rechazado',  label: 'Rechazado',  bg: '#fff0f0', color: '#cc0000', Icon: AlertCircle },
  { value: 'cancelado',  label: 'Cancelado',  bg: '#f5f5f5', color: '#555555', Icon: XCircle     },
]

const ESTADO_ORDEN_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente', bg: '#fff8e1', color: '#b8860b', Icon: Clock       },
  { value: 'enviado',   label: 'Enviado',   bg: '#e3f2fd', color: '#1565c0', Icon: Truck       },
  { value: 'entregado', label: 'Entregado', bg: '#f0fdf4', color: '#009929', Icon: CheckCircle },
]

// ─── Componentes base ─────────────────────────────────────────────────────────
function Badge({ value, options }) {
  const cfg = options.find(o => o.value === value) || { label: value, bg: '#f5f5f5', color: '#555' }
  return (
    <span className="px-3 py-1 rounded-full text-xs font-bold"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-medium text-gray-800 ${mono ? 'font-mono text-xs' : ''}`}>
        {value || '—'}
      </span>
    </div>
  )
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-3 flex items-center gap-2 border-b border-gray-100"
        style={{ backgroundColor: C.bgCafe }}>
        <Icon size={15} style={{ color: C.cafeMedio }} />
        <span className="text-sm font-semibold" style={{ color: C.cafeOscuro }}>{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function SelectEstado({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-gray-400 uppercase tracking-wide">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const active = opt.value === value
          return (
            <button key={opt.value} onClick={() => onChange(opt.value)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all"
              style={{
                backgroundColor: active ? opt.bg    : 'white',
                color:           active ? opt.color : '#888',
                borderColor:     active ? opt.color : '#e0e0e0',
              }}>
              <opt.Icon size={13} />
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ComprobanteUpload({ label, currentUrl, preview, onFileChange, onClear }) {
  const inputRef = useRef()
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span>

      {(preview || currentUrl) && (
        <div className="relative w-full max-w-xs">
          <img src={preview || currentUrl} alt={label}
            className="w-full rounded-xl border border-gray-200 object-contain max-h-48" />
          {preview && (
            <button onClick={onClear}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
              style={{ color: '#cc0000' }}>
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {!preview && (
        <button onClick={() => inputRef.current.click()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed text-sm font-medium w-fit transition-colors"
          style={{ borderColor: C.verde, color: C.verde }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = C.bgVerde}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
          <Upload size={15} />
          {currentUrl ? 'Cambiar imagen' : 'Subir imagen'}
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => onFileChange(e.target.files[0])} />
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order,   setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [toast,   setToast]   = useState(null)

  const [estadoPago,  setEstadoPago]  = useState('')
  const [estadoOrden, setEstadoOrden] = useState('')

  const [pagFile,    setPagFile]    = useState(null)
  const [pagPreview, setPagPreview] = useState(null)
  const [envioFile,    setEnvioFile]    = useState(null)
  const [envioPreview, setEnvioPreview] = useState(null)

  useEffect(() => { fetchOrder() }, [id])

  const fetchOrder = async () => {
    setLoading(true)
    try {
      const res = await getOrder(id)
      const o = res.data
      setOrder(o)
      setEstadoPago(o.estado_pago)
      setEstadoOrden(o.estado_orden)
    } catch (e) {
      console.error(e)
      showToast('No se pudo cargar la orden', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (file, setFile, setPreview) => {
    if (!file) return
    setFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const clearFile = (setFile, setPreview) => { setFile(null); setPreview(null) }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async () => {
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

  const hasChanges = order && (
    estadoPago  !== order.estado_pago  ||
    estadoOrden !== order.estado_orden ||
    pagFile   !== null ||
    envioFile !== null
  )

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      Cargando orden...
    </div>
  )
  if (!order) return null

  // ── Keys exactos de la API ──────────────────────────────────────────────────
  const dir = order.direccion || {}
  // Nombre completo: primero intenta usuario_nombre, luego nombres+apellidos de dirección
  const clienteNombre   = order.usuario_nombre || `${dir.nombres || ''} ${dir.apellidos || ''}`.trim()
  const clienteEmail    = order.usuario_email  || '—'
  const clienteTelefono = dir.telefono         || '—'
  const clienteDni      = dir.dni              || '—'

  const tieneMercadoPago = order.mercado_pago_payment_id || order.mercado_pago_status

  return (
    <div className="space-y-4 pb-10">

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white flex items-center gap-2"
          style={{ backgroundColor: toast.type === 'error' ? '#cc0000' : C.verde }}>
          {toast.type === 'error' ? <XCircle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="rounded-xl p-5 flex items-center justify-between text-white"
        style={{ backgroundColor: C.mostaza }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/orders')}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Orden #{order.numero_orden}</h1>
            <p className="text-sm text-white/70">
              {new Date(order.fecha_creacion).toLocaleDateString('es-PE', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge value={order.estado_pago}  options={ESTADO_PAGO_OPTIONS}  />
          <Badge value={order.estado_orden} options={ESTADO_ORDEN_OPTIONS} />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Info (izq) ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Cliente */}
          <SectionCard title="Información del cliente" icon={User}>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Nombre"   value={clienteNombre}   />
              <InfoRow label="Email"    value={clienteEmail}    />
              <InfoRow label="Teléfono" value={clienteTelefono} />
              <InfoRow label="DNI"      value={clienteDni}      />
            </div>
          </SectionCard>

          {/* Dirección */}
          <SectionCard title="Dirección de envío" icon={MapPin}>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Dirección completa" value={dir.direccion_completo} />
              <InfoRow label="Distrito"           value={dir.distrito}          />
              <InfoRow label="Provincia"          value={dir.provincia}         />
              <InfoRow label="Departamento"       value={dir.departamento}      />
              {dir.agencia_recojo && (
                <>
                  <InfoRow label="Agencia de recojo"   value={dir.agencia_recojo}   />
                  <InfoRow label="Dirección de agencia" value={dir.direccion_agencia} />
                </>
              )}
            </div>
          </SectionCard>

          {/* Productos */}
          <SectionCard title="Productos del pedido" icon={Package}>
            {order.items.length === 0 ? (
              <p className="text-sm text-gray-400">Sin items registrados</p>
            ) : (
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100"
                    style={{ backgroundColor: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    {item.producto_imagen && (
                      <img src={item.producto_imagen} alt={item.producto_nombre}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {item.producto_nombre}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.cantidad} × S/ {parseFloat(item.precio_unitario).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: C.cafeMedio }}>
                      S/ {parseFloat(item.precio_total).toFixed(2)}
                    </span>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {order.cantidad_compra} producto{order.cantidad_compra !== 1 ? 's' : ''}
                  </span>
                  <span className="text-lg font-bold" style={{ color: C.cafeMedio }}>
                    S/ {parseFloat(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        {/* ── Edición (der) ──────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Pago */}
          <SectionCard title="Pago" icon={CreditCard}>
            <div className="space-y-4">
              <InfoRow label="Método de pago" value={order.metodo_pago} />
              <SelectEstado
                label="Estado de pago"
                value={estadoPago}
                options={ESTADO_PAGO_OPTIONS}
                onChange={setEstadoPago}
              />
            </div>
          </SectionCard>

          {/* Mercado Pago — solo si aplica */}
          {tieneMercadoPago && (
            <SectionCard title="Mercado Pago" icon={Building2}>
              <div className="space-y-3">
                <InfoRow label="Payment ID" value={order.mercado_pago_payment_id} mono />
                <InfoRow label="Estado MP"  value={order.mercado_pago_status}     />
              </div>
            </SectionCard>
          )}

          {/* Estado orden */}
          <SectionCard title="Estado de la orden" icon={Truck}>
            <SelectEstado
              value={estadoOrden}
              options={ESTADO_ORDEN_OPTIONS}
              onChange={setEstadoOrden}
            />
          </SectionCard>

          {/* Comprobantes */}
          <SectionCard title="Comprobantes" icon={FileImage}>
            <div className="space-y-5">
              {/* comprobante_pago — sube el cliente */}
              <ComprobanteUpload
                label="Comprobante de pago (voucher del cliente)"
                currentUrl={order.comprobante_pago}
                preview={pagPreview}
                onFileChange={f => handleFileChange(f, setPagFile, setPagPreview)}
                onClear={() => clearFile(setPagFile, setPagPreview)}
              />
              <div className="border-t border-gray-100" />
              {/* comprobante_envio — sube el admin */}
              <ComprobanteUpload
                label="Comprobante de envío (admin)"
                currentUrl={order.comprobante_envio}
                preview={envioPreview}
                onFileChange={f => handleFileChange(f, setEnvioFile, setEnvioPreview)}
                onClear={() => clearFile(setEnvioFile, setEnvioPreview)}
              />
            </div>
          </SectionCard>

          {/* Guardar */}
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{
              backgroundColor: hasChanges && !saving ? C.verde : '#ccc',
              cursor: hasChanges && !saving ? 'pointer' : 'not-allowed',
            }}>
            <Save size={15} />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
// src/pages/Orders/OrderDetail.jsx
import { useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Package, User, MapPin, CreditCard,
  FileImage, CheckCircle, XCircle, Truck, Clock,
  Save, Upload, X, AlertCircle, Building2, ShoppingCart,
} from 'lucide-react'
import { useOrderDetail } from './hooks/useOrderDetail'

const ESTADO_PAGO_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente', bg: '#f2d811', color: '#080706', Icon: Clock       },
  { value: 'pagado',    label: 'Pagado',    bg: '#c4fa82', color: '#080706', Icon: CheckCircle },
  { value: 'rechazado', label: 'Rechazado', bg: '#ba0404', color: '#ffffff', Icon: AlertCircle },
  { value: 'cancelado', label: 'Cancelado', bg: '#fa0505', color: '#ffffff', Icon: XCircle     },
]

const ESTADO_ORDEN_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente', bg: '#f2d811', color: '#080706', Icon: Clock       },
  { value: 'enviado',   label: 'Enviado',   bg: '#52faec', color: '#080706', Icon: Truck       },
  { value: 'entregado', label: 'Entregado', bg: '#3c95fa', color: '#080706', Icon: CheckCircle },
  { value: 'cancelado', label: 'Cancelado', bg: '#fa0505', color: '#ffffff', Icon: XCircle     },
]

function Badge({ value, options }) {
  const cfg = options.find(o => o.value === value) || { label: value, bg: '#f5f5f5', color: '#555' }
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-bold"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border" style={{ borderColor: '#e8d5a3' }}>
      <div
        className="px-5 py-3 flex items-center gap-2 border-b"
        style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 10%)', borderColor: '#e8d5a3' }}
      >
        <Icon size={15} className="text-white/80" />
        <span className="text-sm font-semibold text-white tracking-wide">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function SelectEstado({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#7e4400' }}>
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const active = opt.value === value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all"
              style={{
                backgroundColor: active ? opt.bg    : 'white',
                color:           active ? opt.color : '#888',
                borderColor:     active ? opt.color : '#e0e0e0',
              }}
            >
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
      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#7e4400' }}>
        {label}
      </span>
      {(preview || currentUrl) && (
        <div className="relative w-full max-w-xs">
          <img
            src={preview || currentUrl} alt={label}
            className="w-full rounded-xl border object-contain max-h-48"
            style={{ borderColor: '#e8d5a3' }}
          />
          {preview && (
            <button
              onClick={onClear}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
              style={{ color: '#991b1b' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
      {!preview && (
        <button
          onClick={() => inputRef.current.click()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium w-fit transition-colors"
          style={{ backgroundColor: '#f5f5f5', color: '#211b05', border: '1px solid #1a1a1a' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d4d4d4' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
        >
          <Upload size={15} />
          {currentUrl ? 'Cambiar imagen' : 'Subir imagen'}
        </button>
      )}
      <input
        ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => onFileChange(e.target.files[0])}
      />
    </div>
  )
}

function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    order, loading, saving, toast, hasChanges,
    estadoPago,  setEstadoPago,
    estadoOrden, setEstadoOrden,
    pagFile,    pagPreview,
    envioFile,  envioPreview,
    handleFileChange,
    setPagFile, setPagPreview, setEnvioFile, setEnvioPreview,
    clearFile, handleSave,
  } = useOrderDetail(id)

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      Cargando orden...
    </div>
  )
  if (!order) return null

  const dir           = order.direccion || {}
  const clienteNombre = order.usuario_nombre || `${dir.nombres || ''} ${dir.apellidos || ''}`.trim()
  const tieneMercadoPago = order.mercado_pago_payment_id || order.mercado_pago_status

  return (
    <div className="space-y-4 pb-10" style={{ fontFamily: 'Raleway, sans-serif' }}>

      {toast && (
        <div
          className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white flex items-center gap-2"
          style={{ backgroundColor: toast.type === 'error' ? '#991b1b' : '#166534' }}
        >
          {toast.type === 'error' ? <XCircle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="rounded-2xl shadow-md overflow-hidden">
        <div
          className="px-5 py-4 text-white"
          style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 10%)' }}
        >
          {/* Botón regresar */}
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors w-fit"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft size={14} />
            Regresar
          </button>

          {/* Título + fecha + badges */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <ShoppingCart size={22} className="text-white/90 shrink-0 mt-0.5" />
              <div>
                <h1 className="text-lg font-bold tracking-wide leading-tight">
                  Orden #{order.numero_orden}
                </h1>
                <p className="text-xs text-white/70 mt-0.5">
                  {new Date(order.fecha_creacion).toLocaleDateString('es-PE', {
                    day: '2-digit', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
                {/* Badges en móvil */}
                <div className="flex flex-wrap gap-2 mt-2 md:hidden">
                  <Badge value={order.estado_pago}  options={ESTADO_PAGO_OPTIONS}  />
                  <Badge value={order.estado_orden} options={ESTADO_ORDEN_OPTIONS} />
                </div>
              </div>
            </div>
            {/* Badges en desktop */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <Badge value={order.estado_pago}  options={ESTADO_PAGO_OPTIONS}  />
              <Badge value={order.estado_orden} options={ESTADO_ORDEN_OPTIONS} />
            </div>
          </div>
        </div>

      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Columna izquierda */}
        <div className="lg:col-span-2 space-y-4">

          <SectionCard title="Información del cliente" icon={User}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Nombre"   value={clienteNombre}      />
              <InfoRow label="Email"    value={order.usuario_email} />
              <InfoRow label="Teléfono" value={dir.telefono}       />
              <InfoRow label="DNI"      value={dir.dni}            />
            </div>
          </SectionCard>

          <SectionCard title="Dirección de envío" icon={MapPin}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow label="Dirección completa"  value={dir.direccion_completo} />
              <InfoRow label="Distrito"            value={dir.distrito}           />
              <InfoRow label="Provincia"           value={dir.provincia}          />
              <InfoRow label="Departamento"        value={dir.departamento}       />
              {dir.agencia_recojo && (
                <>
                  <InfoRow label="Agencia de recojo"    value={dir.agencia_recojo}   />
                  <InfoRow label="Dirección de agencia" value={dir.direccion_agencia} />
                </>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Productos del pedido" icon={Package}>
            {order.items.length === 0 ? (
              <p className="text-sm text-gray-400">Sin items registrados</p>
            ) : (
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl border"
                    style={{
                      backgroundColor: i % 2 === 0 ? '#ffffff' : '#f5f5f5',
                      borderColor: '#cfcfcf',
                    }}
                  >
                    {item.producto_imagen && (
                      <img
                        src={item.producto_imagen} alt={item.producto_nombre}
                        className="w-12 h-12 object-cover rounded-lg border flex-shrink-0"
                        style={{ borderColor: '#e8d5a3' }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.producto_nombre}</p>
                      <p className="text-xs text-gray-400">
                        {item.cantidad} × S/ {parseFloat(item.precio_unitario).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-bold flex-shrink-0" style={{ color: '#92590a' }}>
                      S/ {parseFloat(item.precio_total).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div
                  className="flex items-center justify-between pt-3 border-t"
                  style={{ borderColor: '#e8d5a3' }}
                >
                  <span className="text-xs text-gray-400">
                    {order.cantidad_compra} producto{order.cantidad_compra !== 1 ? 's' : ''}
                  </span>
                  <span className="text-lg font-bold" style={{ color: '#92590a' }}>
                    S/ {parseFloat(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Columna derecha */}
        <div className="space-y-4">

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

          {tieneMercadoPago && (
            <SectionCard title="Mercado Pago" icon={Building2}>
              <div className="space-y-3">
                <InfoRow label="Payment ID" value={order.mercado_pago_payment_id} mono />
                <InfoRow label="Estado MP"  value={order.mercado_pago_status}     />
              </div>
            </SectionCard>
          )}

          <SectionCard title="Estado de la orden" icon={Truck}>
            <SelectEstado
              value={estadoOrden}
              options={ESTADO_ORDEN_OPTIONS}
              onChange={setEstadoOrden}
            />
          </SectionCard>

          <SectionCard title="Comprobantes" icon={FileImage}>
            <div className="space-y-5">
              <ComprobanteUpload
                label="Comprobante de pago (voucher del cliente)"
                currentUrl={order.comprobante_pago}
                preview={pagPreview}
                onFileChange={f => handleFileChange(f, setPagFile, setPagPreview)}
                onClear={() => clearFile(setPagFile, setPagPreview)}
              />
              <div className="border-t" style={{ borderColor: '#e8d5a3' }} />
              <ComprobanteUpload
                label="Comprobante de envío (admin)"
                currentUrl={order.comprobante_envio}
                preview={envioPreview}
                onFileChange={f => handleFileChange(f, setEnvioFile, setEnvioPreview)}
                onClear={() => clearFile(setEnvioFile, setEnvioPreview)}
              />
            </div>
          </SectionCard>

          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{
              backgroundColor: hasChanges && !saving ? '#166534' : '#ccc',
              border: hasChanges && !saving ? '1px solid #5cb85c' : 'none',
              cursor: hasChanges && !saving ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={e => { if (hasChanges && !saving) e.currentTarget.style.backgroundColor = '#087508' }}
            onMouseLeave={e => { if (hasChanges && !saving) e.currentTarget.style.backgroundColor = '#166534' }}
          >
            <Save size={15} />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>

        </div>
      </div>
    </div>
  )
}

export default OrderDetail
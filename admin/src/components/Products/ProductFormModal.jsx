// src/components/Products/ProductFormModal.jsx
import { useState, useEffect, useRef } from 'react'
import {
  X, Save, Loader2, Package, AlertCircle,
  DollarSign, Tag, Image, ToggleRight, Info,
} from 'lucide-react'
import {
  createProduct, updateProduct, getCategorias, getMateriales,
  uploadProductImage, deleteProductImage, setMainProductImage,
} from '../../api/products'
import ProductImageUploader from './ProductImageUploader'

const MAX_IMAGES = 7

const EMPTY_FORM = {
  nombre: '', descripcion: '',
  precio_unitario: '', precio_oferta: '', precio_mayor: '',
  cantidad_minima_mayor: '', stock: '',
  categoria: '', materiales: [],
  es_activo: true, es_destacado: false,
}

// ── Helpers de UI ─────────────────────────────────────────────────────────────
const inputCls = (error) =>
  `w-full px-3 py-2 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-amber-300 ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-amber-300'
  }`

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#e8d5a3' }}>
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 10%)', }}
      >
        {Icon && <Icon size={15} className="text-white/80" />}
        <div>
          <p className="text-white text-sm font-bold tracking-wide leading-tight">{title}</p>
          {subtitle && <p className="text-white/65 text-xs leading-tight">{subtitle}</p>}
        </div>
      </div>
      <div className="p-4 bg-white">{children}</div>
    </div>
  )
}

function Field({ label, hint, error, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: '#7e4400' }}>
        {label}
      </label>
      {hint && <p className="text-xs text-gray-400 -mt-0.5">{hint}</p>}
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-0.5">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  )
}

function CheckField({ name, checked, onChange, label, hint }) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer select-none group">
      <input
        type="checkbox" name={name} checked={checked} onChange={onChange}
        className="mt-0.5 w-4 h-4 rounded shrink-0"
        style={{ accentColor: '#009929' }}
      />
      <div>
        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">{label}</p>
        {hint && <p className="text-xs text-gray-400">{hint}</p>}
      </div>
    </label>
  )
}

// ── Modal principal ───────────────────────────────────────────────────────────
function ProductFormModal({ isOpen, product, onClose, onSuccess }) {
  const isEditing = !!product
  const [form, setForm] = useState(EMPTY_FORM)
  const [categorias, setCategorias] = useState([])
  const [materiales, setMateriales] = useState([])
  const [images, setImages] = useState([])
  const [newFiles, setNewFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    loadCatalogos()
    if (isEditing) {
      populateForm(product)
    } else {
      setForm(EMPTY_FORM)
      setImages([])
      setNewFiles([])
      setErrors({})
    }
  }, [isOpen, product])

  async function loadCatalogos() {
    try {
      const resCats = await getCategorias()
      setCategorias(resCats.data.results ?? resCats.data)
    } catch (e) { console.error('Error categorías:', e) }
    try {
      const resMats = await getMateriales()
      setMateriales(resMats.data.results ?? resMats.data)
    } catch (e) { console.error('Error materiales:', e) }
  }

  function populateForm(p) {
    setForm({
      nombre: p.nombre ?? '', descripcion: p.descripcion ?? '',
      precio_unitario: p.precio_unitario ?? '', precio_oferta: p.precio_oferta ?? '',
      precio_mayor: p.precio_mayor ?? '', cantidad_minima_mayor: p.cantidad_minima_mayor ?? '',
      stock: p.stock ?? '', categoria: p.categoria ?? '',
      materiales: p.materiales?.map(m => String(m.id ?? m)) ?? [],
      es_activo: p.es_activo ?? true, es_destacado: p.es_destacado ?? false,
    })
    setImages(p.imagenes ?? [])
    setNewFiles([])
    setErrors({})
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleMaterialToggle(id) {
    const sid = String(id)
    setForm(prev => ({
      ...prev,
      materiales: prev.materiales.includes(sid)
        ? prev.materiales.filter(m => m !== sid)
        : [...prev.materiales, sid],
    }))
  }

  function handleFileSelect(e) {
    const slots = MAX_IMAGES - images.length - newFiles.length
    if (slots <= 0) return
    const allowed = Array.from(e.target.files).slice(0, slots).map((file, i) => ({
      file, preview: URL.createObjectURL(file),
      es_principal: false, orden: images.length + newFiles.length + i,
    }))
    setNewFiles(prev => [...prev, ...allowed])
    e.target.value = ''
  }

  function handleRemoveNewFile(idx) {
    setNewFiles(prev => { URL.revokeObjectURL(prev[idx].preview); return prev.filter((_, i) => i !== idx) })
  }

  function handleSetNewFileMain(idx) {
    setImages(prev => prev.map(img => ({ ...img, es_principal: false })))
    setNewFiles(prev => prev.map((f, i) => ({ ...f, es_principal: i === idx })))
  }

  async function handleDeleteServer(imgId) {
    if (!window.confirm('¿Eliminar esta imagen?')) return
    try {
      await deleteProductImage(product.id, imgId)
      setImages(prev => prev.filter(img => img.id !== imgId))
    } catch { alert('Error al eliminar la imagen') }
  }

  async function handleSetServerMain(imgId) {
    
    setImages(prev => prev.map(img => ({ ...img, es_principal: img.id === imgId })))
    try {
      await setMainProductImage(product.id, imgId)
    } catch {
     
      setImages(prev => prev.map(img => ({ ...img, es_principal: img.id === imgId ? false : img.es_principal })))
      alert('Error al marcar imagen principal')
    }
  }

  function validate() {
    const errs = {}
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio'
    if (!form.precio_unitario || isNaN(form.precio_unitario)) errs.precio_unitario = 'Ingresa un precio válido'
    if (form.stock === '' || isNaN(form.stock)) errs.stock = 'Ingresa el stock'
    return errs
  }

  async function handleSubmit() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio_unitario: parseFloat(form.precio_unitario) || 0,
        stock: parseInt(form.stock) || 0,
        categoria: form.categoria || null,
        es_activo: form.es_activo,
        es_destacado: form.es_destacado,
        ...(form.precio_oferta !== '' && { precio_oferta: parseFloat(form.precio_oferta) }),
        ...(form.precio_mayor !== '' && { precio_mayor: parseFloat(form.precio_mayor) }),
        ...(form.cantidad_minima_mayor !== '' && { cantidad_minima_mayor: parseInt(form.cantidad_minima_mayor) }),
        ...(form.materiales.length > 0 && { materiales: form.materiales.map(Number) }),
      }
      let savedId
      if (isEditing) {
        const res = await updateProduct(product.id, payload)
        savedId = res.data.id ?? product.id
      } else {
        const res = await createProduct(payload)
        savedId = res.data.id
      }
      for (const nf of newFiles) {
        const fd = new FormData()
        fd.append('imagen', nf.file)
        fd.append('es_principal', nf.es_principal)
        fd.append('orden', nf.orden)
        await uploadProductImage(savedId, fd)
      }
      onSuccess()
      onClose()
    } catch (e) {
      console.error(e)
      const data = e.response?.data
      if (data?.nombre) {
        setErrors(prev => ({ ...prev, nombre: data.nombre[0] }))
      } else {
        alert('Ocurrió un error al guardar el producto.')
      }
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  const totalImages = images.length + newFiles.length
  const canAddMore = totalImages < MAX_IMAGES

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-3xl my-8 mx-4 rounded-2xl shadow-2xl bg-white"
        style={{ fontFamily: 'Raleway, sans-serif' }}
      >

        {/* ── Cabecera ── */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 10%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide leading-tight">
                {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <p className="text-white/65 text-xs">
                {isEditing
                  ? 'Modifica los datos del producto seleccionado'
                  : 'Completa los campos para agregar un nuevo producto'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'rgba(255,255,255,0.7)' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* ── Cuerpo ── */}
        <div className="p-6 space-y-5">

          {/* 1. Información Principal */}
          <Section icon={Info} title="Información Principal" subtitle="Nombre y descripción visible en la tienda">
            <div className="grid grid-cols-1 gap-4">
              <Field label="Nombre del producto *" error={errors.nombre} hint="Este nombre aparecerá en el catálogo público">
                <input
                  name="nombre" value={form.nombre} onChange={handleChange}
                  placeholder="Ej: Cartera tejida a mano en punto aguja"
                  className={inputCls(errors.nombre)}
                />
              </Field>
              <Field label="Descripción completa" hint="Describe materiales, dimensiones, usos o características especiales">
                <textarea
                  name="descripcion" value={form.descripcion} onChange={handleChange}
                  rows={3} placeholder="Ej: Cartera elaborada con fibra de junco natural, tejida artesanalmente en punto aguja. Dimensiones: 25cm x 20cm. Incluye cierre y asa de cuero..."
                  className={inputCls(false) + ' resize-none'}
                />
              </Field>
            </div>
          </Section>

          {/* 2. Precios y Stock */}
          <Section icon={DollarSign} title="Precios y Stock" subtitle="Define los precios y la disponibilidad del producto">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Precio unitario (S/) *" error={errors.precio_unitario} hint="Precio de venta para el público">
                <input
                  name="precio_unitario" type="number" min="0" step="0.01"
                  value={form.precio_unitario} onChange={handleChange}
                  placeholder="0.00" className={inputCls(errors.precio_unitario)}
                />
              </Field>
              <Field label="Precio de oferta (S/)" hint="Opcional — precio con descuento especial">
                <input
                  name="precio_oferta" type="number" min="0" step="0.01"
                  value={form.precio_oferta} onChange={handleChange}
                  placeholder="0.00" className={inputCls(false)}
                />
              </Field>
              <Field label="Precio al por mayor (S/)" hint="Aplica cuando supera la cantidad mínima">
                <input
                  name="precio_mayor" type="number" min="0" step="0.01"
                  value={form.precio_mayor} onChange={handleChange}
                  placeholder="0.00" className={inputCls(false)}
                />
              </Field>
              <Field label="Cantidad mínima para precio mayor" hint="Nº de unidades a partir del cual aplica el precio mayor">
                <input
                  name="cantidad_minima_mayor" type="number" min="1"
                  value={form.cantidad_minima_mayor} onChange={handleChange}
                  placeholder="Ej: 5" className={inputCls(false)}
                />
              </Field>
              <Field label="Cantidad en stock *" error={errors.stock} hint="Unidades disponibles actualmente">
                <input
                  name="stock" type="number" min="0"
                  value={form.stock} onChange={handleChange}
                  placeholder="0" className={inputCls(errors.stock)}
                />
              </Field>
            </div>
          </Section>

          {/* 3. Clasificación */}
          <Section icon={Tag} title="Clasificación y Visibilidad" subtitle="Categoría, materiales y estado de publicación">
            <div className="space-y-5">

              {/* Categoría */}
              <Field label="Categoría" hint="Selecciona una categoría para organizar el producto en la tienda">
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, categoria: '' }))}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                    style={
                      form.categoria === '' || form.categoria === null
                        ? { backgroundColor: '#166534', color: 'white', borderColor: '#14532d' }
                        : { backgroundColor: 'white', color: '#4b5563', borderColor: '#d1d5db' }
                    }
                  >
                    Sin categoría
                  </button>
                  {categorias.map(c => {
                    const isSelected = String(form.categoria) === String(c.id)
                    return (
                      <button
                        key={c.id} type="button"
                        onClick={() => setForm(prev => ({ ...prev, categoria: c.id }))}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                        style={
                          isSelected
                            ? { backgroundColor: '#166534', color: 'white', borderColor: '#14532d' }
                            : { backgroundColor: 'white', color: '#4b5563', borderColor: '#d1d5db' }
                        }
                      >
                        {c.nombre}
                      </button>
                    )
                  })}
                </div>
              </Field>

              {/* Materiales */}
              {materiales.length > 0 && (
                <Field label="Materiales" hint="Puedes seleccionar uno o más materiales con los que está elaborado el producto">
                  <div className="flex flex-wrap gap-2 pt-1">
                    {materiales.map(m => {
                      const sel = form.materiales.includes(String(m.id))
                      return (
                        <button
                          key={m.id} type="button"
                          onClick={() => handleMaterialToggle(m.id)}
                          className="px-3 py-1 rounded-full text-xs font-semibold border transition-colors"
                          style={sel
                            ? { backgroundColor: '#b8860b', color: 'white', borderColor: '#92590a' }
                            : { backgroundColor: 'white', color: '#7e4400', borderColor: '#b8860b' }
                          }
                        >
                          {m.nombre}
                        </button>
                      )
                    })}
                  </div>
                </Field>
              )}

              {/* Visibilidad */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#7e4400' }}>
                  Estado de publicación
                </p>
                <div
                  className="grid grid-cols-2 gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: '#f5f5f5', border: '1px solid #0f0f0f' }}
                >
                  <CheckField
                    name="es_activo" checked={form.es_activo} onChange={handleChange}
                    label="Producto activo"
                    hint="Visible y disponible para comprar en la tienda"
                  />
                  <CheckField
                    name="es_destacado" checked={form.es_destacado} onChange={handleChange}
                    label="Producto destacado"
                    hint="Aparece en la sección de productos destacados"
                  />
                </div>
              </div>

            </div>
          </Section>

          {/* 4. Imágenes */}
          <Section
            icon={Image}
            title={`Imágenes del producto (${totalImages}/${MAX_IMAGES})`}
            subtitle="Sube hasta 7 imágenes. Marca una como principal para que aparezca en el catálogo"
          >
            <ProductImageUploader
              images={images}
              newFiles={newFiles}
              canAddMore={canAddMore}
              remaining={MAX_IMAGES - totalImages}
              onFileSelect={handleFileSelect}
              onRemoveNewFile={handleRemoveNewFile}
              onSetNewFileMain={handleSetNewFileMain}
              onDeleteServer={handleDeleteServer}
              onSetServerMain={handleSetServerMain}
              fileInputRef={fileInputRef}
            />
          </Section>

        </div>

        {/* ── Footer ── */}
        <div
          className="flex items-center justify-between px-6 py-4 border-t rounded-b-2xl"
          style={{ borderColor: '#e8d5a3', backgroundColor: '#ffffff' }}
        >
          <p className="text-xs text-gray-400">
            Los campos marcados con <span className="text-red-400 font-bold">*</span> son obligatorios
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
              style={{ backgroundColor: '#b80e02', color: 'white', border: '1.5px solid #b80e02' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d92b1f' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#b80e02' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-colors"
              style={{ backgroundColor: saving ? '#aaa' : '#166534' }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.backgroundColor = '#14532d' }}
              onMouseLeave={e => { if (!saving) e.currentTarget.style.backgroundColor = '#166534' }}
            >
              {saving
                ? <><Loader2 size={15} className="animate-spin" /> Guardando...</>
                : <><Save size={15} /> {isEditing ? 'Guardar cambios' : 'Crear producto'}</>
              }
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProductFormModal
import { useState, useEffect, useRef } from 'react'
import { X, Save, Loader2, Package, AlertCircle } from 'lucide-react'
import {
  createProduct, updateProduct, getCategorias, getMateriales,
  uploadProductImage, deleteProductImage, setMainProductImage,
} from '../../api/products'
import ProductImageUploader from './ProductImageUploader'
import SelectCustom from '../UI/SelectCustom'

const MAX_IMAGES = 7

const EMPTY_FORM = {
  nombre: '', descripcion: '',
  precio_unitario: '', precio_oferta: '', precio_mayor: '',
  cantidad_minima_mayor: '', stock: '',
  categoria: '', materiales: [],
  es_activo: true, es_destacado: false,
}

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
      } catch (e) {
        console.error('Error categorías:', e)
      }
      try {
        const resMats = await getMateriales()
        setMateriales(resMats.data.results ?? resMats.data)
      } catch (e) {
        console.error('Error materiales:', e)
      }
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

  // ── Imágenes ──
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
    try {
      await setMainProductImage(product.id, imgId)
      setImages(prev => prev.map(img => ({ ...img, es_principal: img.id === imgId })))
    } catch { alert('Error al marcar imagen principal') }
  }

  // ── Validación y guardado ──
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
       
        slug: form.nombre.toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '') 
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-'),
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
      alert('Ocurrió un error al guardar el producto.')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  const totalImages = images.length + newFiles.length
  const canAddMore = totalImages < MAX_IMAGES

  return (
    // ── Overlay ──
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* ── Contenedor del modal ── */}
      <div
        className="relative w-full max-w-3xl my-8 mx-4 rounded-2xl shadow-2xl bg-white"
        style={{ fontFamily: 'Raleway, sans-serif' }}
      >
        {/* Cabecera */}
        <div
          className="flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{ backgroundColor: '#b8860b' }}
        >
          <div className="flex items-center gap-3">
            <Package size={20} className="text-white opacity-80" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors rounded-lg p-1">
            <X size={22} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-6">

          {/* ══ Información Principal ══ */}
          <Section title="Información Principal">
            <div className="grid grid-cols-1 gap-4">
              <Field label="Nombre del producto *" error={errors.nombre}>
                <input name="nombre" value={form.nombre} onChange={handleChange}
                  placeholder="Ej: Alfombra Piurana" className={inputCls(errors.nombre)} />
              </Field>
              <Field label="Descripción completa">
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                  rows={4} placeholder="Descripción detallada del producto..."
                  className={inputCls(false) + ' resize-none'} />
              </Field>
            </div>
          </Section>

          {/* ══ Precios y Stock ══ */}
          <Section title="Precios y Stock">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Precio unitario (S/) *" error={errors.precio_unitario}>
                <input name="precio_unitario" type="number" min="0" step="0.01"
                  value={form.precio_unitario} onChange={handleChange}
                  placeholder="0.00" className={inputCls(errors.precio_unitario)} />
              </Field>
              <Field label="Precio de oferta (S/)">
                <input name="precio_oferta" type="number" min="0" step="0.01"
                  value={form.precio_oferta} onChange={handleChange}
                  placeholder="0.00" className={inputCls(false)} />
              </Field>
              <Field label="Precio al por mayor (S/)">
                <input name="precio_mayor" type="number" min="0" step="0.01"
                  value={form.precio_mayor} onChange={handleChange}
                  placeholder="0.00" className={inputCls(false)} />
              </Field>
              <Field label="Cantidad mínima para precio mayor">
                <input name="cantidad_minima_mayor" type="number" min="1"
                  value={form.cantidad_minima_mayor} onChange={handleChange}
                  placeholder="1" className={inputCls(false)} />
              </Field>
              <Field label="Cantidad en stock *" error={errors.stock}>
                <input name="stock" type="number" min="0"
                  value={form.stock} onChange={handleChange}
                  placeholder="0" className={inputCls(errors.stock)} />
              </Field>
            </div>
          </Section>

          {/* ══ Clasificación y Visibilidad ══ */}
          <Section title="Clasificación y Visibilidad">
            <div className="space-y-4">
              <Field label="Categoría">
                <SelectCustom
                  value={form.categoria}
                  onChange={(val) => {
                    setForm(prev => ({ ...prev, categoria: val }))
                  }}
                  options={categorias.map(c => ({ value: c.id, label: c.nombre }))}
                  placeholder="Sin categoría"
                />
              </Field>

              {materiales.length > 0 && (
                <Field label="Materiales">
                  <div className="flex flex-wrap gap-2 pt-1">
                    {materiales.map(m => {
                      const sel = form.materiales.includes(String(m.id))
                      return (
                        <button key={m.id} type="button" onClick={() => handleMaterialToggle(m.id)}
                          className="px-3 py-1 rounded-full text-xs font-semibold border transition-colors"
                          style={sel
                            ? { backgroundColor: '#b8860b', color: 'white', borderColor: '#92590a' }
                            : { backgroundColor: 'white', color: '#7e4400', borderColor: '#b8860b' }}>
                          {m.nombre}
                        </button>
                      )
                    })}
                  </div>
                </Field>
              )}

              <div className="flex gap-6 pt-1">
                <CheckField name="es_activo" checked={form.es_activo} onChange={handleChange} label="¿Está activo en la tienda?" />
                <CheckField name="es_destacado" checked={form.es_destacado} onChange={handleChange} label="¿Es un producto destacado?" />
              </div>
            </div>
          </Section>

          {/* ══ Imágenes ══ */}
          <Section title={`Imágenes del producto (${totalImages}/${MAX_IMAGES})`} color="#b8860b">
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

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t rounded-b-2xl bg-white"
          style={{ borderColor: '#f5e6cc' }}>
          <button
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2 rounded-xl text-sm font-semibold border transition-colors"
            style={{
              borderColor: '#b80e02',
              backgroundColor: '#b80e02',
              color: '#ffffff'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#d92b1f'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#b80e02'
            }}
          >
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: saving ? '#ccc' : '#b8860b' }}>
            {saving
              ? <><Loader2 size={15} className="animate-spin" /> Guardando...</>
              : <><Save size={15} /> {isEditing ? 'Guardar cambios' : 'Crear producto'}</>}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Helpers de UI ── */
const inputCls = (error) =>
  `w-full px-3 py-2 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-amber-300 ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
  }`

function Section({ title, color = '#b8860b', children }) {
  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#f5e6cc' }}>
      <div className="px-4 py-2 text-white text-sm font-bold tracking-wide" style={{ backgroundColor: color }}>
        {title}
      </div>
      <div className="p-4 bg-white">{children}</div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="flex items-center gap-1 text-xs text-red-500"><AlertCircle size={11} /> {error}</p>}
    </div>
  )
}

function CheckField({ name, checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
      <input type="checkbox" name={name} checked={checked} onChange={onChange}
        className="w-4 h-4 rounded" style={{ accentColor: '#009929' }} />
      {label}
    </label>
  )
}

export default ProductFormModal
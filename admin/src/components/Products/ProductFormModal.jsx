import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { createProduct, updateProduct, getProductById, getCategorias } from '../../api/products'
import ProductImageManager from './ProductImageManager'


/**
 * Props:
 *  - isOpen    : boolean
 *  - product   : objeto | null   (null = modo crear)
 *  - onClose   : () => void
 *  - onSuccess : () => void
 */
function ProductFormModal({ isOpen, product, onClose, onSuccess }) {
  const isEditing = !!product

  const EMPTY_FORM = {
    nombre: '', descripcion: '',
    precio_unitario: '', precio_oferta: '', precio_mayor: '',
    cantidad_minima_mayor: '', stock: '',
    es_activo: true, es_destacado: false,
    categoria: '',
  }

  const [form, setForm] = useState(EMPTY_FORM)
  const [images, setImages] = useState([])
  const [categorias, setCategorias] = useState([])
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  // Estado post-creación: el producto ya fue creado, ahora subimos imágenes
  const [createdId, setCreatedId] = useState(null)

  useEffect(() => {
    if (!isOpen) return
    setErrors({})
    loadCategorias()

    if (isEditing) {
      populateForm(product)
      setCreatedId(null)
    } else {
      setForm(EMPTY_FORM)
      setImages([])
      setCreatedId(null)
    }
  }, [isOpen, product])

  const loadCategorias = async () => {
    try {
      const res = await getCategorias()
      setCategorias(res.data.results || res.data)
    } catch (e) {
      console.error('Error cargando categorías:', e)
    }
  }

  const populateForm = (p) => {
    setForm({
      nombre: p.nombre || '',
      descripcion: p.descripcion || '',
      precio_unitario: p.precio_unitario || '',
      precio_oferta: p.precio_oferta || '',
      precio_mayor: p.precio_mayor || '',
      cantidad_minima_mayor: p.cantidad_minima_mayor || '',
      stock: p.stock ?? '',
      es_activo: p.es_activo ?? true,
      es_destacado: p.es_destacado ?? false,
      categoria: p.categoria || '',
    })
    setImages(p.imagenes || [])
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.nombre.trim()) errs.nombre = 'El nombre es requerido'
    if (!form.precio_unitario) errs.precio_unitario = 'El precio es requerido'
    if (form.stock === '') errs.stock = 'El stock es requerido'
    return errs
  }

  const buildPayload = () => ({
    nombre: form.nombre,
    descripcion: form.descripcion,
    precio_unitario: parseFloat(form.precio_unitario),
    precio_oferta: form.precio_oferta ? parseFloat(form.precio_oferta) : null,
    precio_mayor: form.precio_mayor ? parseFloat(form.precio_mayor) : null,
    cantidad_minima_mayor: form.cantidad_minima_mayor ? parseInt(form.cantidad_minima_mayor) : null,
    stock: parseInt(form.stock),
    es_activo: form.es_activo,
    es_destacado: form.es_destacado,
    categoria: form.categoria || null,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      if (isEditing) {
        await updateProduct(product.id, buildPayload())
        onSuccess()
      } else {
        const res = await createProduct(buildPayload())
        setCreatedId(res.data.id)
        // No cerramos: permitimos subir imágenes antes de finalizar
      }
    } catch (err) {
      if (err.response?.data) setErrors(err.response.data)
      console.error('Error al guardar:', err)
    } finally {
      setSaving(false)
    }
  }

  // Recarga imágenes después de subir/eliminar
  const handleImagesRefresh = async () => {
    const id = isEditing ? product.id : createdId
    if (!id) return
    try {
      const res = await getProductById(id)
      setImages(res.data.imagenes || [])
    } catch (e) {
      console.error(e)
    }
  }

  if (!isOpen) return null

  const currentProductId = isEditing ? product.id : createdId
  const postCreatePhase = !isEditing && !!createdId

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ backgroundColor: '#b8860b', borderRadius: '1rem 1rem 0 0' }}
        >
          <h2 className="text-white font-bold text-lg">
            {postCreatePhase
              ? '✓ Creado — Agrega imágenes'
              : isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {postCreatePhase ? (
            // ── Fase 2: subir imágenes tras crear ────────────────────────────
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                El producto fue creado exitosamente. Puedes subir imágenes ahora o finalizar.
              </p>
              <ProductImageManager
                productId={currentProductId}
                images={images}
                onRefresh={handleImagesRefresh}
              />
            </div>
          ) : (
            // ── Fase 1: formulario ────────────────────────────────────────────
            <form id="product-form" onSubmit={handleSubmit} className="space-y-5">

              <Field label="Nombre *" error={errors.nombre}>
                <input name="nombre" value={form.nombre} onChange={handleChange}
                  placeholder="Ej: Alfombra Piurana"
                  className={inputCls(errors.nombre)} />
              </Field>

              <Field label="Descripción">
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                  rows={3} placeholder="Descripción del producto..."
                  className={`${inputCls()} resize-none`} />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Precio unitario *" error={errors.precio_unitario}>
                  <input type="number" step="0.01" min="0" name="precio_unitario"
                    value={form.precio_unitario} onChange={handleChange}
                    placeholder="0.00" className={inputCls(errors.precio_unitario)} />
                </Field>
                <Field label="Precio oferta">
                  <input type="number" step="0.01" min="0" name="precio_oferta"
                    value={form.precio_oferta} onChange={handleChange}
                    placeholder="0.00" className={inputCls()} />
                </Field>
                <Field label="Precio por mayor">
                  <input type="number" step="0.01" min="0" name="precio_mayor"
                    value={form.precio_mayor} onChange={handleChange}
                    placeholder="0.00" className={inputCls()} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Stock *" error={errors.stock}>
                  <input type="number" min="0" name="stock" value={form.stock}
                    onChange={handleChange} placeholder="0"
                    className={inputCls(errors.stock)} />
                </Field>
                <Field label="Cant. mínima por mayor">
                  <input type="number" min="1" name="cantidad_minima_mayor"
                    value={form.cantidad_minima_mayor} onChange={handleChange}
                    placeholder="1" className={inputCls()} />
                </Field>
              </div>

              <Field label="Categoría">
                <select name="categoria" value={form.categoria} onChange={handleChange}
                  className={inputCls()}>
                  <option value="">Sin categoría</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </Field>

              <div className="flex gap-6">
                <CheckField name="es_activo" checked={form.es_activo} onChange={handleChange} label="Activo" />
                <CheckField name="es_destacado" checked={form.es_destacado} onChange={handleChange} label="Destacado" />
              </div>

              {/* Imágenes solo en edición (en crear, se suben en la fase 2) */}
              {isEditing && (
                <ProductImageManager
                  productId={product.id}
                  images={images}
                  onRefresh={handleImagesRefresh}
                />
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={postCreatePhase ? onSuccess : onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {postCreatePhase ? 'Finalizar' : 'Cancelar'}
          </button>

          {!postCreatePhase && (
            <button
              type="submit"
              form="product-form"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors flex items-center gap-2"
              style={{ backgroundColor: saving ? '#ccc' : '#b8860b' }}
            >
              {saving
                ? <><Loader2 size={15} className="animate-spin" /> Guardando...</>
                : <><Save size={15} /> {isEditing ? 'Guardar cambios' : 'Crear producto'}</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const inputCls = (error) =>
  `w-full px-3 py-2 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-amber-300 ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
  }`

function Field({ label, error, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function CheckField({ name, checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
      <input type="checkbox" name={name} checked={checked} onChange={onChange}
        className="w-4 h-4 accent-amber-600" />
      {label}
    </label>
  )
}

export default ProductFormModal
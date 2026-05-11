// src/pages/Categories/Categories.jsx
import { useEffect, useState, useRef } from 'react'
import { Plus, Search, RefreshCw, Pencil, Trash2, X, Save, Loader2, Tag, ImagePlus } from 'lucide-react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories'
import Toast from '../../components/UI/Toast'

function Categories() {
  const [categories, setCategories] = useState([])
  const [filtered, setFiltered]     = useState([])
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)
  const [toast, setToast]           = useState(null)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected]   = useState(null)
  const [nombre, setNombre]       = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving]       = useState(false)
  const [errors, setErrors]       = useState({})

  // Modal eliminar
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => { fetchCategories() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(categories.filter(c => c.nombre.toLowerCase().includes(q)))
  }, [search, categories])

  async function fetchCategories() {
    setLoading(true)
    try {
      const res = await getCategories()
      const data = res.data.results ?? res.data
      setCategories(data)
      setFiltered(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setSelected(null); setNombre(''); setImageFile(null)
    setImagePreview(null); setErrors({}); setModalOpen(true)
  }

  function openEdit(c) {
    setSelected(c); setNombre(c.nombre); setImageFile(null)
    setImagePreview(c.imagen_url ?? null); setErrors({}); setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false); setSelected(null); setNombre('')
    setImageFile(null); setImagePreview(null); setErrors({})
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  async function handleSave() {
    if (!nombre.trim()) { setErrors({ nombre: 'El nombre es obligatorio' }); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('nombre', nombre.trim())
      if (imageFile) fd.append('imagen', imageFile)

      if (selected) {
        await updateCategory(selected.id, fd)
      } else {
        await createCategory(fd)
      }
      const wasEditing = !!selected
      closeModal()
      await fetchCategories()
      setToast({
        message: wasEditing ? 'Categoría actualizada exitosamente' : 'Categoría creada exitosamente',
        type: 'success',
      })
    } catch (e) {
      console.error(e)
      const data = e.response?.data
      if (data?.nombre) {
        setErrors({ nombre: data.nombre[0] })
      } else {
        setErrors({ general: 'Error al guardar la categoría' })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCategory(deleteTarget.id)
      setDeleteTarget(null)
      await fetchCategories()
      setToast({ message: 'Categoría eliminada exitosamente', type: 'success' })
    } catch (e) {
      console.error(e)
      setToast({ message: 'Error al eliminar la categoría', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4" style={{ fontFamily: 'Raleway, sans-serif' }}>

      {/* Header */}
      <div className="rounded-xl p-5 flex items-center justify-between text-white"
        style={{ backgroundColor: '#b8860b' }}>
        <div>
          <h1 className="text-xl font-bold">Gestión de Categorías</h1>
          <p className="text-sm text-white/80">Administra las categorías de productos</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border bg-white transition-colors"
          style={{ borderColor: '#92590a', color: '#92590a' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#92590a'; e.currentTarget.style.color = 'white' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#92590a' }}>
          <Plus size={16} /> Agregar Categoría
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">

        {/* Filtros */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border flex-1"
              style={{ borderColor: '#d1d5db', backgroundColor: 'white' }}>
              <Search size={15} className="text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Buscar categorías..."
                className="bg-transparent outline-none text-sm w-full"
                style={{ color: '#374151' }}
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold flex-shrink-0"
              style={{ backgroundColor: '#009929', color: 'white' }}>
              <Tag size={14} />
              {filtered.length} categorías
            </div>
              </div>
              
        {/* Tabla */}
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#f5e6cc' }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#b8860b' }}>
              <tr className="text-white">
                <th className="px-4 py-3 text-left">Imagen</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Slug</th>
                <th className="px-4 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-400">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-gray-400">No se encontraron categorías</td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id}
                  className="border-t transition-colors"
                  style={{ borderColor: '#f5e6cc', backgroundColor: i % 2 === 0 ? 'white' : '#fffdf7' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fdf3e0' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'white' : '#fffdf7' }}>
                  <td className="px-4 py-3">
                    {c.imagen_url
                      ? <img src={c.imagen_url} alt={c.nombre} className="w-12 h-12 object-cover rounded-lg" />
                      : <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f5e6cc' }}>
                          <Tag size={18} style={{ color: '#b8860b' }} />
                        </div>
                    }
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">{c.nombre}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500">{c.slug}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(c)}
                        className="p-1.5 rounded-lg transition-colors" style={{ color: '#009929' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f0fdf4' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(c)}
                        className="p-1.5 rounded-lg transition-colors text-red-500"
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef2f2' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal crear/editar ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
          onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="w-full max-w-md rounded-2xl shadow-2xl bg-white overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: '#b8860b' }}>
              <div className="flex items-center gap-3">
                <Tag size={18} className="text-white opacity-80" />
                <h2 className="text-base font-bold text-white">
                  {selected ? 'Editar Categoría' : 'Nueva Categoría'}
                </h2>
              </div>
              <button onClick={closeModal} className="text-white/70 hover:text-white p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {errors.general && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{errors.general}</p>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre *</label>
                <input type="text" value={nombre}
                  onChange={e => { setNombre(e.target.value); setErrors({}) }}
                  placeholder="Ej: Tapetes, Carteras..."
                  className="w-full px-3 py-2 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-300"
                  style={{ borderColor: errors.nombre ? '#f87171' : '#e5e7eb' }}
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                  autoFocus />
                {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Imagen</label>
                {imagePreview && (
                  <img src={imagePreview} alt="preview"
                    className="w-full h-36 object-cover rounded-xl border"
                    style={{ borderColor: '#f5e6cc' }} />
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed text-sm font-semibold transition-colors w-full justify-center"
                  style={{ borderColor: '#b8860b', color: '#b8860b' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5e6cc' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                  <ImagePlus size={16} />
                  {imagePreview ? 'Cambiar imagen' : 'Subir imagen'}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: '#f5e6cc' }}>
              <button onClick={closeModal} disabled={saving}
                className="px-5 py-2 rounded-xl text-sm font-semibold border transition-colors"
                style={{ borderColor: '#7e4400', color: '#7e4400' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5e6cc' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: saving ? '#ccc' : '#b8860b' }}>
                {saving
                  ? <><Loader2 size={14} className="animate-spin" /> Guardando...</>
                  : <><Save size={14} /> {selected ? 'Guardar cambios' : 'Crear categoría'}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal eliminar ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}>
          <div className="w-full max-w-sm rounded-2xl shadow-2xl bg-white overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">¿Eliminar categoría?</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Se eliminará permanentemente <strong>"{deleteTarget.nombre}"</strong>. Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setDeleteTarget(null)} disabled={deleting}
                  className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors"
                  style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9fafb' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                  <X size={14} className="inline mr-1" /> Cancelar
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                  style={{ backgroundColor: deleting ? '#ccc' : '#ef4444' }}>
                  {deleting
                    ? <><Loader2 size={14} className="animate-spin" /> Eliminando...</>
                    : <><Trash2 size={14} /> Eliminar</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}

export default Categories
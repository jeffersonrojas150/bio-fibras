// src/pages/Materials/Materials.jsx
import { useEffect, useState, useRef } from 'react'
import { Plus, Search, RefreshCw, Pencil, Trash2, X, Save, Loader2, Layers, ImagePlus } from 'lucide-react'
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../../api/materials'
import Toast from '../../components/UI/Toast'

function Materials() {
  const [materials, setMaterials] = useState([])
  const [filtered, setFiltered]   = useState([])
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [toast, setToast]         = useState(null)

  // Modal crear/editar
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected]   = useState(null)
  const [form, setForm]           = useState({ nombre: '', descripcion: '', es_sostenible: false })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving]       = useState(false)
  const [errors, setErrors]       = useState({})

  // Modal eliminar
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => { fetchMaterials() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(materials.filter(m => m.nombre.toLowerCase().includes(q)))
  }, [search, materials])

  async function fetchMaterials() {
    setLoading(true)
    try {
      const res = await getMaterials()
      const data = res.data.results ?? res.data
      setMaterials(data)
      setFiltered(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setSelected(null)
    setForm({ nombre: '', descripcion: '', es_sostenible: false })
    setImageFile(null); setImagePreview(null); setErrors({})
    setModalOpen(true)
  }

  function openEdit(m) {
    setSelected(m)
    setForm({ nombre: m.nombre, descripcion: m.descripcion ?? '', es_sostenible: m.es_sostenible ?? false })
    setImageFile(null); setImagePreview(m.imagen_url ?? null); setErrors({})
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false); setSelected(null)
    setForm({ nombre: '', descripcion: '', es_sostenible: false })
    setImageFile(null); setImagePreview(null); setErrors({})
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  async function handleSave() {
    if (!form.nombre.trim()) { setErrors({ nombre: 'El nombre es obligatorio' }); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('nombre', form.nombre.trim())
      fd.append('descripcion', form.descripcion)
      fd.append('es_sostenible', form.es_sostenible)
      if (imageFile) fd.append('imagen', imageFile)

      if (selected) {
        await updateMaterial(selected.id, fd)
      } else {
        await createMaterial(fd)
      }
      const wasEditing = !!selected
      closeModal()
      await fetchMaterials()
      setToast({
        message: wasEditing ? 'Material actualizado exitosamente' : 'Material creado exitosamente',
        type: 'success',
      })
    } catch (e) {
      console.error(e)
      const data = e.response?.data
      if (data?.nombre) {
        setErrors({ nombre: data.nombre[0] })
      } else {
        setErrors({ general: 'Error al guardar el material' })
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteMaterial(deleteTarget.id)
      setDeleteTarget(null)
      await fetchMaterials()
      setToast({ message: 'Material eliminado exitosamente', type: 'success' })
    } catch (e) {
      console.error(e)
      setToast({ message: 'Error al eliminar el material', type: 'error' })
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
          <h1 className="text-xl font-bold">Gestión de Materiales</h1>
          <p className="text-sm text-white/80">Administra los materiales de los productos</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border bg-white transition-colors"
          style={{ borderColor: '#92590a', color: '#92590a' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#92590a'; e.currentTarget.style.color = 'white' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#92590a' }}>
          <Plus size={16} /> Agregar Material
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">

        {/* Filtros */}
        <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border flex-1"
            style={{ borderColor: '#d1d5db', backgroundColor: 'white' }}>
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input type="text" placeholder="Buscar materiales..."
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: '#374151' }}
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold flex-shrink-0"
            style={{ backgroundColor: '#009929', color: 'white' }}>
            <Layers size={14} />
            {filtered.length} materiales
        </div>
        </div>


        {/* Tabla */}
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#f5e6cc' }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#b8860b' }}>
              <tr className="text-white">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Imagen</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-center">Sostenible</th>
                <th className="px-4 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No se encontraron materiales</td></tr>
              ) : filtered.map((m, i) => (
                <tr key={m.id}
                  className="border-t transition-colors"
                  style={{ borderColor: '#f5e6cc', backgroundColor: i % 2 === 0 ? 'white' : '#fffdf7' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fdf3e0' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'white' : '#fffdf7' }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#92590a' }}>#{m.id}</td>
                  <td className="px-4 py-3">
                    {m.imagen_url
                      ? <img src={m.imagen_url} alt={m.nombre} className="w-10 h-10 object-cover rounded-lg" />
                      : <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f5e6cc' }}>
                          <Layers size={16} style={{ color: '#b8860b' }} />
                        </div>
                    }
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">{m.nombre}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">
                    {m.descripcion || <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={m.es_sostenible
                        ? { backgroundColor: '#f0fdf4', color: '#009929' }
                        : { backgroundColor: '#f3f4f6', color: '#6b7280' }}>
                      {m.es_sostenible ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(m)}
                        className="p-1.5 rounded-lg transition-colors" style={{ color: '#009929' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f0fdf4' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteTarget(m)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
          onClick={e => e.target === e.currentTarget && closeModal()}>
          
          
          <div className="w-full max-w-3xl rounded-2xl shadow-2xl bg-white overflow-hidden flex flex-col max-h-[95vh]">

            {/* Cabecera */}
            <div className="flex items-center justify-between px-8 py-5 flex-shrink-0" style={{ backgroundColor: '#b8860b' }}>
              <div className="flex items-center gap-3">
                <Layers size={20} className="text-white opacity-80" />
                <h2 className="text-lg font-bold text-white tracking-wide">
                  {selected ? 'Editar Material' : 'Nuevo Material'}
                </h2>
              </div>
              <button onClick={closeModal} className="text-white/70 hover:text-white p-1 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Cuerpo del Modal */}
            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              {errors.general && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{errors.general}</p>
              )}

              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre *</label>
                <input type="text" name="nombre" value={form.nombre}
                  onChange={handleFormChange}
                  placeholder="Ej: Junco, Toquilla..."
                  className="w-full px-4 py-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-300"
                  style={{ borderColor: errors.nombre ? '#f87171' : '#e5e7eb' }}
                  autoFocus />
                {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
              </div>

              {/* Descripción*/}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Descripción</label>
                <textarea name="descripcion" value={form.descripcion}
                  onChange={handleFormChange} rows={4}
                  placeholder="Descripción detallada del material..."
                  className="w-full px-4 py-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                  style={{ borderColor: '#e5e7eb' }} />
              </div>

              {/* Sostenible */}
              <label className="flex items-center gap-3 cursor-pointer select-none py-1">
                <input type="checkbox" name="es_sostenible" checked={form.es_sostenible}
                  onChange={handleFormChange}
                  className="w-5 h-5 rounded cursor-pointer" style={{ accentColor: '#009929' }} />
                <span className="text-sm font-medium text-gray-700">¿Es un material sostenible?</span>
              </label>

              {/* Imagen  */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">Imagen</label>
                {imagePreview && (
                  <img src={imagePreview} alt="preview"
                    className="w-full h-48 object-cover rounded-xl border"
                    style={{ borderColor: '#f5e6cc' }} />
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed text-sm font-semibold transition-colors w-full justify-center"
                  style={{ borderColor: '#b8860b', color: '#b8860b' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f5e6cc' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                  <ImagePlus size={18} />
                  {imagePreview ? 'Cambiar imagen' : 'Subir imagen'}
                </button>
              </div>
            </div>

            {/* Footer  */}
            <div className="flex justify-end gap-3 px-8 py-5 border-t flex-shrink-0" style={{ borderColor: '#f5e6cc', backgroundColor: '#fafafa' }}>
              <button
                onClick={closeModal}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
                style={{ borderColor: '#b80e02', backgroundColor: '#b80e02', color: '#ffffff' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d92b1f' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#b80e02' }}
              >
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-colors"
                style={{ backgroundColor: saving ? '#ccc' : '#278a4d' }}
                onMouseEnter={e => { if(!saving) e.currentTarget.style.backgroundColor = '#1f703e' }}
                onMouseLeave={e => { if(!saving) e.currentTarget.style.backgroundColor = '#278a4d' }}
              >
                {saving
                  ? <><Loader2 size={16} className="animate-spin" /> Guardando...</>
                  : <><Save size={16} /> {selected ? 'Guardar cambios' : 'Crear material'}</>}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Modal eliminar ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}>
          <div className="w-full max-w-sm mx-4 rounded-2xl shadow-2xl bg-white overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">¿Eliminar material?</h3>
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

export default Materials
// src/pages/Materials/Materials.jsx
import { useEffect, useState } from 'react'
import { Plus, Search, RefreshCw, Pencil, Trash2, X, Save, Loader2, Layers } from 'lucide-react'
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../../api/materials'

function Materials() {
  const [materials, setMaterials] = useState([])
  const [filtered, setFiltered]   = useState([])
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)

  // Modal
  const [modalOpen, setModalOpen]       = useState(false)
  const [selected, setSelected]         = useState(null) // null = crear
  const [nombre, setNombre]             = useState('')
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState('')

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
    setNombre('')
    setError('')
    setModalOpen(true)
  }

  function openEdit(m) {
    setSelected(m)
    setNombre(m.nombre)
    setError('')
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setSelected(null)
    setNombre('')
    setError('')
  }

  async function handleSave() {
    if (!nombre.trim()) { setError('El nombre es obligatorio'); return }
    setSaving(true)
    try {
      if (selected) {
        await updateMaterial(selected.id, { nombre: nombre.trim() })
      } else {
        await createMaterial({ nombre: nombre.trim() })
      }
      await fetchMaterials()
      closeModal()
    } catch (e) {
      setError('Error al guardar el material')
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este material?')) return
    try {
      await deleteMaterial(id)
      fetchMaterials()
    } catch (e) {
      console.error(e)
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
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border bg-white transition-colors"
          style={{ borderColor: '#92590a', color: '#92590a' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#92590a'; e.currentTarget.style.color = 'white' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#92590a' }}
        >
          <Plus size={16} /> Agregar Material
        </button>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">

        {/* Filtros */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2 w-72 bg-white">
            <Search size={15} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar materiales..."
              className="text-sm outline-none w-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={fetchMaterials}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium bg-white transition-colors"
            style={{ borderColor: '#009929', color: '#009929' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#009929'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = '#009929' }}
          >
            <RefreshCw size={15} /> Actualizar
          </button>
        </div>

        {/* Contador */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
          style={{ backgroundColor: '#f0fdf4', borderColor: '#f0fdf4' }}>
          <span className="rounded-lg w-8 h-8 flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: '#5ccb5f' }}>
            {filtered.length}
          </span>
          <span className="text-sm" style={{ color: '#009929' }}>materiales encontrados</span>
        </div>

        {/* Tabla */}
        <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#f5e6cc' }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: '#b8860b' }}>
              <tr className="text-white">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="text-center py-10 text-gray-400">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-10 text-gray-400">No se encontraron materiales</td></tr>
              ) : filtered.map((m, i) => (
                <tr key={m.id}
                  className="border-t transition-colors"
                  style={{ borderColor: '#f5e6cc', backgroundColor: i % 2 === 0 ? 'white' : '#fffdf7' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fdf3e0' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = i % 2 === 0 ? 'white' : '#fffdf7' }}
                >
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#92590a' }}>#{m.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#f5e6cc' }}>
                        <Layers size={13} style={{ color: '#b8860b' }} />
                      </div>
                      <span className="font-medium text-gray-700">{m.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(m)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: '#009929' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f0fdf4' }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(m.id)}
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

      {/* ── Modal crear / editar ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div className="w-full max-w-md rounded-2xl shadow-2xl bg-white overflow-hidden"
            style={{ fontFamily: 'Raleway, sans-serif' }}>

            {/* Cabecera */}
            <div className="flex items-center justify-between px-6 py-4"
              style={{ backgroundColor: '#b8860b' }}>
              <div className="flex items-center gap-3">
                <Layers size={18} className="text-white opacity-80" />
                <h2 className="text-base font-bold text-white">
                  {selected ? 'Editar Material' : 'Nuevo Material'}
                </h2>
              </div>
              <button onClick={closeModal} className="text-white/70 hover:text-white p-1 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => { setNombre(e.target.value); setError('') }}
                  placeholder="Ej: Junco, Toquilla, Mimbre..."
                  className="w-full px-3 py-2 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-amber-300"
                  style={{ borderColor: error ? '#f87171' : '#e5e7eb' }}
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                  autoFocus
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t"
              style={{ borderColor: '#f5e6cc' }}>
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
                  : <><Save size={14} /> {selected ? 'Guardar cambios' : 'Crear material'}</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Materials
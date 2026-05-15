// src/pages/Categories/Categories.jsx
import { Plus, Pencil, Trash2, X, Save, Loader2, Tag, ImagePlus, Search, Package } from 'lucide-react'
import { useCategories } from './hooks/useCategories'
import Toast from '../../components/UI/Toast'

// ── Paginación ────────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const activeStyle   = { backgroundColor: '#166534', color: 'white', border: 'none' }
  const inactiveStyle = { backgroundColor: 'white', color: '#555', border: '1px solid #e0e0e0' }
  const navEnabled    = { color: '#166534', borderColor: '#166534', backgroundColor: 'white' }
  const navDisabled   = { color: '#ccc', borderColor: '#e0e0e0', backgroundColor: 'white' }
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div
      className="flex items-center justify-center gap-2 py-4 border-t"
      style={{ borderColor: '#cfcfcf', backgroundColor: '#ffffff' }}
    >
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
        style={currentPage === 1 ? navDisabled : navEnabled}
      >
        Anterior
      </button>
      {pages.map(n => (
        <button key={n} onClick={() => setCurrentPage(n)}
          className="w-8 h-8 rounded-lg text-sm font-semibold transition-colors"
          style={n === currentPage ? activeStyle : inactiveStyle}
        >
          {n}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 rounded-lg text-sm border transition-colors"
        style={currentPage === totalPages ? navDisabled : navEnabled}
      >
        Siguiente
      </button>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
function Categories() {
  const {
    paginated, filtered, loading,
    search, setSearch,
    currentPage, setCurrentPage, totalPages,
    toast, setToast,
    modalOpen, selected, nombre, setNombre,
    imagePreview, saving, errors, setErrors,
    fileInputRef,
    openCreate, openEdit, closeModal,
    handleFileChange, handleSave,
    deleteTarget, deleting,
    confirmDelete, cancelDelete, executeDelete,
  } = useCategories()

  return (
    <div className="space-y-4" style={{ fontFamily: 'Raleway, sans-serif' }}>

      {/* ── Contenedor unificado ── */}
      <div className="rounded-2xl shadow-md overflow-hidden">

        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between text-white"
          style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 10%)' }}
        >
          <div className="flex items-center gap-3">
            <Tag size={28} strokeWidth={2} className="text-white/90" />
            <div>
              <h1 className="text-xl font-bold tracking-wide">Gestión de Categorías</h1>
              <p className="text-sm text-white/75">Administra las categorías de productos de tu empresa</p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border bg-white transition-colors"
            style={{ borderColor: '#92590a', color: '#92590a' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#4f3c04' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#92590a' }}
          >
            <Plus size={16} /> Agregar Categoría
          </button>
        </div>

        {/* Filtros + Tabla */}
        <div className="bg-white px-6 py-5 space-y-4">

          {/* Buscador */}
          <div className="flex items-center gap-3">
            <div className="flex items-center flex-1 rounded-xl overflow-hidden" style={{ border: '1.5px solid #e8d5a3' }}>
              <div className="flex items-center gap-2 flex-1 px-3 py-2">
                <Search size={16} style={{ color: '#b8860b' }} className="shrink-0" />
                <input
                  type="text" value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar categoría por nombre..."
                  className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                />
              </div>
              <button
                className="px-4 py-2 text-sm font-semibold text-white shrink-0 transition-colors"
                style={{ backgroundColor: '#b8860b' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#92590a' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#b8860b' }}
              >
                Buscar
              </button>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shrink-0"
              style={{ backgroundColor: '#166534', color: 'white' }}
            >
              <Package size={15} />
              {filtered.length} categoría{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Tabla */}
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: '#cfcfcf' }}>
            <table className="w-full text-sm">
              <thead>
                <tr
                  className="text-white text-xs uppercase tracking-wider"
                  style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 10%)' }}
                >
                  <th className="px-4 py-3 text-center font-semibold">Imagen</th>
                  <th className="px-4 py-3 text-left font-semibold">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold">Slug</th>
                  <th className="px-4 py-3 text-center font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">Cargando...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">No se encontraron categorías</td></tr>
                ) : paginated.map((c, i) => (
                  <tr
                    key={c.id}
                    className="border-t transition-colors duration-150"
                    style={{ borderColor: '#cfcfcf', backgroundColor: i % 2 === 0 ? '#ffffff' : '#f5f5f5' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e6e6e6')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? '#ffffff' : '#f5f5f5')}
                  >
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        {c.imagen_url
                          ? <img src={c.imagen_url} alt={c.nombre}
                              className="w-11 h-11 object-cover rounded-lg shadow-sm"
                              style={{ border: '1.5px solid #e8d5a3' }} />
                          : <div className="w-11 h-11 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: '#f5e6cc', border: '1.5px dashed #d4a84b' }}>
                              <Tag size={16} style={{ color: '#b8860b' }} />
                            </div>
                        }
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{c.nombre}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: '#e0d182', color: '#473703', border: '1px solid #473703' }}>
                        {c.slug}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEdit(c)}
                          className="p-1.5 rounded-lg transition-colors" style={{ color: '#0eb505' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#abebae' }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                          title="Editar">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => confirmDelete(c)}
                          className="p-1.5 rounded-lg transition-colors" style={{ color: '#ef4444' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fef2f2' }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
                          title="Eliminar">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            )}
          </div>
        </div>
      </div>

      {/* ── Modal crear/editar ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div className="w-full max-w-xl mx-4 rounded-2xl shadow-2xl bg-white overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4"
              style={{ background: 'linear-gradient(135deg, #d7ad44 0%, #b8941a 10%)' }}>
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Tag size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white leading-tight">
                    {selected ? 'Editar Categoría' : 'Nueva Categoría'}
                  </h2>
                  <p className="text-white/65 text-xs">
                    {selected ? 'Modifica los datos de la categoría' : 'Completa los campos para crear una categoría'}
                  </p>
                </div>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-lg transition-colors"
                style={{ color: 'rgba(255,255,255,0.7)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}>
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {errors.general && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{errors.general}</p>
              )}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: '#7e4400' }}>
                  Nombre *
                </label>
                <p className="text-xs text-gray-400">Este nombre aparecerá como categoría en la tienda</p>
                <input
                  type="text" value={nombre}
                  onChange={e => { setNombre(e.target.value); setErrors({}) }}
                  placeholder="Ej: Tapetes, Carteras, Lámparas..."
                  className="w-full px-3 py-2 text-sm border rounded-xl outline-none transition-colors focus:ring-2 focus:ring-amber-300 hover:border-amber-300"
                  style={{ borderColor: errors.nombre ? '#f87171' : '#e5e7eb' }}
                  onKeyDown={e => e.key === 'Enter' && handleSave()}
                  autoFocus
                />
                {errors.nombre && <p className="text-xs text-red-500 mt-0.5">{errors.nombre}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: '#7e4400' }}>
                  Imagen *
                </label>
                <p className="text-xs text-gray-400">Imagen representativa de la categoría</p>
                {imagePreview && (
                  <img src={imagePreview} alt="preview"
                    className="w-full h-36 object-cover rounded-xl border"
                    style={{ borderColor: '#e8d5a3' }} />
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors w-full justify-center"
                  style={{ backgroundColor: '#f5f5f5', color: '#211b05', border: '1px solid #1a1a1a' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d4d4d4' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}>
                  <ImagePlus size={16} />
                  {imagePreview ? 'Cambiar imagen' : 'Subir imagen'}
                </button>
                {errors.imagen && <p className="text-xs text-red-500 mt-0.5">{errors.imagen}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t"
              style={{ borderColor: '#e8d5a3', backgroundColor: '#ffffff' }}>
              <p className="text-xs text-gray-400 whitespace-nowrap">
                Los campos con <span className="text-red-400 font-bold">*</span> son obligatorios
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={closeModal} disabled={saving}
                  className="px-5 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
                  style={{ backgroundColor: '#b80e02', color: 'white' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#d92b1f' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#b80e02' }}>
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-colors whitespace-nowrap"
                  style={{ backgroundColor: saving ? '#aaa' : '#166534' }}
                  onMouseEnter={e => { if (!saving) e.currentTarget.style.backgroundColor = '#14532d' }}
                  onMouseLeave={e => { if (!saving) e.currentTarget.style.backgroundColor = '#166534' }}>
                  {saving
                    ? <><Loader2 size={14} className="animate-spin" /> Guardando...</>
                    : <><Save size={14} /> {selected ? 'Guardar cambios' : 'Crear categoría'}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal eliminar ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}>
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
                <button onClick={cancelDelete} disabled={deleting}
                  className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors"
                  style={{ borderColor: '#e5e7eb', color: '#6b7280' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9fafb' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                  <X size={14} className="inline mr-1" /> Cancelar
                </button>
                <button onClick={executeDelete} disabled={deleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-colors"
                  style={{ backgroundColor: deleting ? '#ccc' : '#ef4444' }}
                  onMouseEnter={e => { if (!deleting) e.currentTarget.style.backgroundColor = '#dc2626' }}
                  onMouseLeave={e => { if (!deleting) e.currentTarget.style.backgroundColor = '#ef4444' }}>
                  {deleting
                    ? <><Loader2 size={14} className="animate-spin" /> Eliminando...</>
                    : <><Trash2 size={14} /> Eliminar</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

export default Categories
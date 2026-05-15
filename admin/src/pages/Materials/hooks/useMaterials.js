// src/pages/Materials/hooks/useMaterials.js
import { useEffect, useState, useRef } from 'react'
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../../../api/materials'

const ITEMS_PER_PAGE = 6

export function useMaterials() {
  const [materials, setMaterials] = useState([])
  const [filtered, setFiltered]   = useState([])
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [toast, setToast]         = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Modal crear/editar
  const [modalOpen, setModalOpen]       = useState(false)
  const [selected, setSelected]         = useState(null)
  const [form, setForm]                 = useState({ nombre: '', descripcion: '', es_sostenible: false })
  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving]             = useState(false)
  const [errors, setErrors]             = useState({})

  // Modal eliminar
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => { fetchMaterials() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(materials.filter(m => m.nombre.toLowerCase().includes(q)))
    setCurrentPage(1)
  }, [search, materials])

  async function fetchMaterials() {
    setLoading(true)
    try {
      const res  = await getMaterials()
      const data = res.data.results ?? res.data
      setMaterials(data)
      setFiltered(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Modal crear/editar
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
    if (!imagePreview) { setErrors({ imagen: 'La imagen es obligatoria' }); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('nombre', form.nombre.trim())
      fd.append('descripcion', form.descripcion)
      fd.append('es_sostenible', form.es_sostenible)
      if (imageFile) fd.append('imagen', imageFile)
      const wasEditing = !!selected
      if (selected) {
        await updateMaterial(selected.id, fd)
      } else {
        await createMaterial(fd)
      }
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

  // Modal eliminar
  function confirmDelete(m) { setDeleteTarget(m) }
  function cancelDelete()   { setDeleteTarget(null) }

  async function executeDelete() {
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

  return {
    paginated, filtered, loading,
    search, setSearch,
    currentPage, setCurrentPage, totalPages,
    toast, setToast,
    modalOpen, selected, form, imagePreview,
    saving, errors, setErrors,
    fileInputRef,
    openCreate, openEdit, closeModal,
    handleFormChange, handleFileChange, handleSave,
    deleteTarget, deleting,
    confirmDelete, cancelDelete, executeDelete,
  }
}
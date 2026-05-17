// src/pages/Materials/hooks/useMaterials.js
import { useState, useMemo, useRef } from 'react'
import { createMaterial, updateMaterial, deleteMaterial } from '../../../api/materials'
import { useAdminStore } from '../../../store/useAdminStore'

const ITEMS_PER_PAGE = 10

export function useMaterials() {
  const {
    materials,
    refetchMaterials,
    removeMaterial,
  } = useAdminStore()

  const [search, setSearch]           = useState('')
  const [loading] = useState(false)
  const [toast, setToast]             = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const [modalOpen, setModalOpen]       = useState(false)
  const [selected, setSelected]         = useState(null)
  const [form, setForm]                 = useState({ nombre: '', descripcion: '', es_sostenible: false })
  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving]             = useState(false)
  const [errors, setErrors]             = useState({})

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)

  const fileInputRef = useRef(null)

  // filtered derivado con useMemo — sin setState en useEffect
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return materials.filter(m => m.nombre?.toLowerCase().includes(q))
  }, [search, materials])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const getPageNumbers = () => {
    const maxVisible = 5
    let start = Math.max(1, currentPage - 2)
    let end   = Math.min(totalPages, start + maxVisible - 1)
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1)
    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const getPageNumbersMobile = () => {
    const maxVisible = 3
    let start = Math.max(1, currentPage - 1)
    let end   = Math.min(totalPages, start + maxVisible - 1)
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1)
    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
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
      await refetchMaterials()
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

  function confirmDelete(m) { setDeleteTarget(m) }
  function cancelDelete()   { setDeleteTarget(null) }

  async function executeDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteMaterial(deleteTarget.id)
      removeMaterial(deleteTarget.id)   // actualización local instantánea
      setDeleteTarget(null)
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
    search,
    setSearch: (val) => { setSearch(val); setCurrentPage(1) },
    currentPage, setCurrentPage, totalPages,
    getPageNumbers, getPageNumbersMobile,
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
// src/pages/Categories/hooks/useCategories.js
import { useEffect, useState, useRef } from 'react'
import { createCategory, updateCategory, deleteCategory } from '../../../api/categories'
import { useAdminStore } from '../../../store/useAdminStore'

const ITEMS_PER_PAGE = 10

export function useCategories() {
  const {
    categories,
    refetchCategories,
    removeCategory,
  } = useAdminStore()

  const [filtered, setFiltered]       = useState([])
  const [search, setSearch]           = useState('')
  const [loading] = useState(false)
  const [toast, setToast]             = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Modal crear/editar
  const [modalOpen, setModalOpen]       = useState(false)
  const [selected, setSelected]         = useState(null)
  const [nombre, setNombre]             = useState('')
  const [estaActiva, setEstaActiva]     = useState(true)
  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving]             = useState(false)
  const [errors, setErrors]             = useState({})

  // Modal eliminar
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)

  const fileInputRef = useRef(null)

  // Sincroniza filtered cuando cambia el store o el search
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(categories.filter(c => c.nombre?.toLowerCase().includes(q)))
    setCurrentPage(1)
  }, [search, categories])

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  // Acciones modal crear/editar
  function openCreate() {
    setSelected(null); setNombre(''); setEstaActiva(true)
    setImageFile(null); setImagePreview(null); setErrors({}); setModalOpen(true)
  }

  function openEdit(c) {
    setSelected(c); setNombre(c.nombre)
    setEstaActiva(c.activo ?? true)
    setImageFile(null)
    setImagePreview(c.imagen_url ?? null); setErrors({}); setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false); setSelected(null); setNombre('')
    setEstaActiva(true); setImageFile(null)
    setImagePreview(null); setErrors({})
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
    if (!imagePreview)  { setErrors({ imagen: 'La imagen es obligatoria' }); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('nombre', nombre.trim())
      fd.append('activo', estaActiva)
      if (imageFile) fd.append('imagen', imageFile)
      const wasEditing = !!selected
      if (selected) {
        await updateCategory(selected.id, fd)
      } else {
        await createCategory(fd)
      }
      closeModal()
      // Refresca categorías en el store
      await refetchCategories()
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

  // Acciones modal eliminar
  function confirmDelete(c) { setDeleteTarget(c) }
  function cancelDelete()   { setDeleteTarget(null) }

  async function executeDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCategory(deleteTarget.id)
      removeCategory(deleteTarget.id)   // actualización local instantánea
      setDeleteTarget(null)
      setToast({ message: 'Categoría eliminada exitosamente', type: 'success' })
    } catch (e) {
      console.error(e)
      setToast({ message: 'Error al eliminar la categoría', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  return {
    paginated, filtered, loading,
    search, setSearch,
    currentPage, setCurrentPage, totalPages,
    toast, setToast,
    modalOpen, selected, nombre, setNombre,
    estaActiva, setEstaActiva,
    imageFile, imagePreview,
    saving, errors, setErrors,
    fileInputRef,
    openCreate, openEdit, closeModal,
    handleFileChange, handleSave,
    deleteTarget, deleting,
    confirmDelete, cancelDelete, executeDelete,
  }
}
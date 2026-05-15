// src/pages/Categories/hooks/useCategories.js
import { useEffect, useState, useRef } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../../api/categories'

const ITEMS_PER_PAGE = 6

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [filtered, setFiltered]     = useState([])
  const [search, setSearch]         = useState('')
  const [loading, setLoading]       = useState(true)
  const [toast, setToast]           = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Modal crear/editar
  const [modalOpen, setModalOpen]       = useState(false)
  const [selected, setSelected]         = useState(null)
  const [nombre, setNombre]             = useState('')
  const [imageFile, setImageFile]       = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving]             = useState(false)
  const [errors, setErrors]             = useState({})

  // Modal eliminar
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]         = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => { fetchCategories() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(categories.filter(c => c.nombre.toLowerCase().includes(q)))
    setCurrentPage(1)
  }, [search, categories])

  async function fetchCategories() {
    setLoading(true)
    try {
      const res  = await getCategories()
      const data = res.data.results ?? res.data
      setCategories(data)
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

  // Acciones modal crear/editar
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
    if (!imagePreview) { setErrors({ imagen: 'La imagen es obligatoria' }); return }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('nombre', nombre.trim())
      if (imageFile) fd.append('imagen', imageFile)
      const wasEditing = !!selected
      if (selected) {
        await updateCategory(selected.id, fd)
      } else {
        await createCategory(fd)
      }
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

  // Acciones modal eliminar
  function confirmDelete(c) { setDeleteTarget(c) }
  function cancelDelete()   { setDeleteTarget(null) }

  async function executeDelete() {
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

  return {
    // datos
    paginated, filtered, loading,
    search, setSearch,
    currentPage, setCurrentPage, totalPages,
    toast, setToast,
    // modal crear/editar
    modalOpen, selected, nombre, setNombre,
    imageFile, imagePreview,
    saving, errors, setErrors,
    fileInputRef,
    openCreate, openEdit, closeModal,
    handleFileChange, handleSave,
    // modal eliminar
    deleteTarget, deleting,
    confirmDelete, cancelDelete, executeDelete,
  }
}
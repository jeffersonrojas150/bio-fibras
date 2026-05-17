// src/pages/Products/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react'
import { deleteProduct } from '../../../api/products'
import { useAdminStore } from '../../../store/useAdminStore'

const ITEMS_PER_PAGE = 10

export function useProducts() {
  const {
    products,
    refetchProducts,
    removeProduct,
  } = useAdminStore()

  const [filtered, setFiltered]       = useState([])
  const [search, setSearch]           = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // loading solo se usa para el estado de eliminación u operaciones locales
  // La carga inicial ya la manejó InitLoader
  const [loading] = useState(false)

  const [modalOpen, setModalOpen]           = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteTarget, setDeleteTarget]     = useState(null)
  const [deleting, setDeleting]             = useState(false)

  // Sincroniza filtered cuando cambia el store o el search
  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(products.filter(p => p.nombre?.toLowerCase().includes(q)))
    setCurrentPage(1)
  }, [search, products])

  // fetchProducts ahora hace un refetch en el store (solo se llama manualmente)
  const fetchProducts = useCallback(async () => {
    await refetchProducts()
  }, [refetchProducts])

  // ── Paginación ──
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

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

  // ── Modal crear/editar ──
  const openCreate  = () => { setSelectedProduct(null); setModalOpen(true) }
  const openEdit    = (product) => { setSelectedProduct(product); setModalOpen(true) }
  const closeModal  = () => { setModalOpen(false); setSelectedProduct(null) }

  // Al guardar exitosamente, refresca del servidor para tener data fresca
  const onSaveSuccess = async () => {
    closeModal()
    setSearch('')
    await refetchProducts()
  }

  // ── Eliminar ──
  const confirmDelete = (product) => setDeleteTarget(product)
  const cancelDelete  = () => setDeleteTarget(null)

  const executeDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteProduct(deleteTarget.id)
      removeProduct(deleteTarget.id)   // actualización local instantánea
      setDeleteTarget(null)
    } catch (e) {
      console.error('Error al eliminar producto:', e)
    } finally {
      setDeleting(false)
    }
  }

  return {
    filtered, paginated, loading,
    search, setSearch,
    currentPage, setCurrentPage, totalPages,
    getPageNumbers, getPageNumbersMobile,
    fetchProducts,
    modalOpen, selectedProduct, openCreate, openEdit, closeModal, onSaveSuccess,
    deleteTarget, confirmDelete, cancelDelete, executeDelete,
    deleting,
  }
}
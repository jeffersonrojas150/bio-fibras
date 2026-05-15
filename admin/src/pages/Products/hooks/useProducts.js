// src/pages/Products/hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react'
import { getProducts, deleteProduct } from '../../../api/products'

const ITEMS_PER_PAGE = 5

export function useProducts() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getProducts()
      const data = res.data.results || res.data
      setProducts(data)
    } catch (e) {
      console.error('Error al cargar productos:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(products.filter(p => p.nombre.toLowerCase().includes(q)))
    setCurrentPage(1)
  }, [search, products])

  // ── Paginación ──
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  // ── Modal crear/editar ──
  const openCreate = () => { setSelectedProduct(null); setModalOpen(true) }
  const openEdit = (product) => { setSelectedProduct(product); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setSelectedProduct(null) }
  const onSaveSuccess = async () => {
    closeModal()
    setSearch('')
    await fetchProducts()
  }

  // ── Eliminar ──
  const confirmDelete = (product) => setDeleteTarget(product)
  const cancelDelete = () => setDeleteTarget(null)
  const executeDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteProduct(deleteTarget.id)
      setDeleteTarget(null)
      await fetchProducts()
    } catch (e) {
      console.error('Error al eliminar:', e)
    }
  }

  return {
    filtered, paginated, loading,
    search, setSearch,
    currentPage, setCurrentPage, totalPages, getPageNumbers,
    fetchProducts,
    modalOpen, selectedProduct, openCreate, openEdit, closeModal, onSaveSuccess,
    deleteTarget, confirmDelete, cancelDelete, executeDelete,
  }
}
// src/pages/Orders/hooks/useOrders.js
import { useEffect, useState, useCallback } from 'react'
import { getOrders } from '../../../api/orders'

const ITEMS_PER_PAGE = 10

export function useOrders() {
  const [orders, setOrders]       = useState([])
  const [filtered, setFiltered]   = useState([])
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await getOrders()
      const data = res.data.results || res.data
      setOrders(data)
      setFiltered(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  useEffect(() => {
    const q = search.toLowerCase().replace('#', '').trim()
    setFiltered(orders.filter(o =>
      o.numero_orden?.toString().includes(q) ||
      o.usuario_nombre?.toLowerCase().includes(q) ||
      o.usuario_email?.toLowerCase().includes(q)
    ))
    setCurrentPage(1)
  }, [search, orders])

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

  return {
    filtered, paginated, loading,
    search, setSearch,
    currentPage, setCurrentPage, totalPages, getPageNumbers,
    fetchOrders,
  }
}
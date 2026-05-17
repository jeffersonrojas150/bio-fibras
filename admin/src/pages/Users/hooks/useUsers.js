// src/pages/Users/hooks/useUsers.js
import { useState, useMemo } from 'react'
import { useAdminStore } from '../../../store/useAdminStore'

const ITEMS_PER_PAGE = 10

export function useUsers() {
  const { users } = useAdminStore()

  const [search, setSearch]           = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const loading = false

  // filtered derivado con useMemo — sin setState en useEffect
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return users.filter(u =>
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.first_name?.toLowerCase().includes(q) ||
      u.last_name?.toLowerCase().includes(q)
    )
  }, [search, users])

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

  // fetchUsers queda como no-op: el polling del store ya se encarga
  const fetchUsers = () => {}

  return {
    filtered, paginated, loading,
    search,
    setSearch: (val) => { setSearch(val); setCurrentPage(1) },
    currentPage, setCurrentPage,
    totalPages, getPageNumbers, getPageNumbersMobile,
    fetchUsers,
  }
}
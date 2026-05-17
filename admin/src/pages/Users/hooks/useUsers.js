// src/pages/Users/hooks/useUsers.js
import { useState, useEffect, useCallback } from 'react'
import { getUsers } from '../../../api/users'

const ITEMS_PER_PAGE = 10

export function useUsers() {
  const [users,    setUsers]    = useState([])
  const [filtered, setFiltered] = useState([])
  const [search,   setSearch]   = useState('')
  const [loading,  setLoading]  = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await getUsers()
      const data = res.data.results ?? res.data
      setUsers(data)
    } catch (e) {
      console.error('Error al cargar usuarios:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(users.filter(u =>
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.first_name?.toLowerCase().includes(q) ||
      u.last_name?.toLowerCase().includes(q)
    ))
    setCurrentPage(1)
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

  return {
    filtered, paginated, loading,
    search, setSearch,
    currentPage, setCurrentPage,
    totalPages, getPageNumbers, getPageNumbersMobile,
    fetchUsers,
  }
}
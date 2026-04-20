import api from './axiosConfig'

export const getCategories = () => api.get('/admin-api/categorias/')
export const getCategory = (id) => api.get(`/admin-api/categorias/${id}/`)
export const createCategory = (data) => api.post('/admin-api/categorias/', data)
export const updateCategory = (id, data) => api.patch(`/admin-api/categorias/${id}/`, data)
export const deleteCategory = (id) => api.delete(`/admin-api/categorias/${id}/`)
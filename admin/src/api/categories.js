import api from './axiosConfig'

export const getCategories = () => api.get('/categorias/')
export const getCategory = (id) => api.get(`/categorias/${id}/`)
export const createCategory = (data) => api.post('/categorias/', data)
export const updateCategory = (id, data) => api.patch(`/categorias/${id}/`, data)
export const deleteCategory = (id) => api.delete(`/categorias/${id}/`)
import api from './axiosConfig'

export const getProducts = () => api.get('/admin-api/productos/')
export const getProduct = (id) => api.get(`/admin-api/productos/${id}/`)
export const createProduct = (data) => api.post('/admin-api/productos/', data)
export const updateProduct = (id, data) => api.patch(`/admin-api/productos/${id}/`, data)
export const deleteProduct = (id) => api.delete(`/admin-api/productos/${id}/`)
import api from './axiosConfig'

export const getProducts = () => api.get('/productos/')
export const getProduct = (id) => api.get(`/productos/${id}/`)
export const createProduct = (data) => api.post('/productos/', data)
export const updateProduct = (id, data) => api.patch(`/productos/${id}/`, data)
export const deleteProduct = (id) => api.delete(`/productos/${id}/`)
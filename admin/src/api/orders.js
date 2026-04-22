import api from './axiosConfig'

export const getOrders = (params = {}) => api.get('/admin-api/ordenes/', { params })
export const getOrder = (id) => api.get(`/admin-api/ordenes/${id}/`)
export const updateOrder = (id, data) => api.patch(`/admin-api/ordenes/${id}/`, data)
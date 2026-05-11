// src/api/materials.js
import api from './axiosConfig'

export const getMaterials   = ()         => api.get('/admin-api/materiales/')
export const getMaterial    = (id)       => api.get(`/admin-api/materiales/${id}/`)
export const createMaterial = (data)     => api.post('/admin-api/materiales/', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const updateMaterial = (id, data) => api.patch(`/admin-api/materiales/${id}/`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
export const deleteMaterial = (id)       => api.delete(`/admin-api/materiales/${id}/`)
// src/api/materials.js
import api from './axiosConfig'

export const getMaterials   = ()           => api.get('/admin-api/materiales/')
export const createMaterial = (data)       => api.post('/admin-api/materiales/', data)
export const updateMaterial = (id, data)   => api.patch(`/admin-api/materiales/${id}/`, data)
export const deleteMaterial = (id)         => api.delete(`/admin-api/materiales/${id}/`)
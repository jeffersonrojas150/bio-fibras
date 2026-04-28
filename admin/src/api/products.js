import api from './axiosConfig'

// --- Listado + Crear ---
export const getProducts = () => api.get('/admin-api/productos/')
export const createProduct = (data) => api.post('/admin-api/productos/', data)

// --- Detalle + Editar + Eliminar ---
export const getProductById = (id) => api.get(`/admin-api/productos/${id}/`)
export const updateProduct = (id, data) => api.patch(`/admin-api/productos/${id}/`, data)
export const deleteProduct = (id) => api.delete(`/admin-api/productos/${id}/`)

// --- Imágenes ---
export const uploadProductImage = (productId, formData) =>
  api.post(`/admin-api/productos/${productId}/imagenes/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const deleteProductImage = (productId, imageId) =>
  api.delete(`/admin-api/productos/${productId}/imagenes/${imageId}/`)

// --- Categorías  ---
export const getCategorias = () => api.get('/admin-api/categorias/')

// --- Materiales  ---
export const getMateriales = () => api.get('/admin-api/materiales/')
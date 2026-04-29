import api from './axiosConfig'

export const login = (credentials) => api.post('/auth/token/', credentials)
export const refreshToken = (refresh) => api.post('/auth/token/refresh/', { refresh })
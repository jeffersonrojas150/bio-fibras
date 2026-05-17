// src/api/axiosConfig.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// ── Request ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
}, (error) => Promise.reject(error))

// ── Response ──
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config


    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/token/')
    ) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        if (!refresh) throw new Error('No refresh token')

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
          { refresh }
        )
        const newAccess = res.data.access
        localStorage.setItem('access_token', newAccess)
        original.headers['Authorization'] = `Bearer ${newAccess}`
        return api(original)
      } catch (e) {
     
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_data')
        window.location.href = '/login'
        return Promise.reject(e)
      }
    }

    return Promise.reject(error)
  }
)

export default api
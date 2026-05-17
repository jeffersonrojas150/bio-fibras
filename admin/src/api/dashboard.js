// src/api/dashboard.js
import api from './axiosConfig'

export const getDashboard = () => api.get('/admin-api/dashboard/')
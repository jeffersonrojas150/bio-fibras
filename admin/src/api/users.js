// src/api/users.js
import api from './axiosConfig'

export const getUsers = () => api.get('/admin-api/usuarios/')
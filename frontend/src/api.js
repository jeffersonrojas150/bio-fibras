// src/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    // Busca el token de acceso en el localStorage
    const token = localStorage.getItem('access_token');

    // Si el token existe, lo añade a la cabecera de autorización
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await apiClient.post('/auth/token/refresh/', {
            refresh: refreshToken,
          });

          const newAccessToken = response.data.access;

          localStorage.setItem('access_token', newAccessToken);

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          console.log("Token refrescado, reintentando petición original...");
          return apiClient(originalRequest);

        } catch (refreshError) {
          console.error("Refresh token inválido. Cerrando sesión.", refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
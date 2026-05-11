// src/api.js
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variables para controlar el circuit breaker
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

const clearAuthAndRedirect = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  refreshAttempts = 0;
  isRefreshing = false;
  window.location.href = '/login';
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
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
    // Si una petición es exitosa, reseteamos el contador
    refreshAttempts = 0;
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error no es 401 o ya reintentamos, rechazamos
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url.includes('/auth/token/') ||
      originalRequest.url.includes('/auth/registro/')
    ) {
      return Promise.reject(error);
    }

    // Verificamos si ya alcanzamos el límite de intentos
    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      console.error('Límite de intentos de refresh alcanzado. Cerrando sesión.');
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    // Si ya hay un refresh en proceso, encolamos esta petición
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      console.error('No hay refresh token disponible.');
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    refreshAttempts++;
    console.log(`Intento de refresh ${refreshAttempts}/${MAX_REFRESH_ATTEMPTS}`);

    try {
      const response = await axios.post(`${apiUrl}/auth/token/refresh/`, {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.access;
      localStorage.setItem('access_token', newAccessToken);

      // Reseteamos el contador tras un refresh exitoso
      refreshAttempts = 0;
      isRefreshing = false;

      // Procesamos la cola de peticiones pendientes
      processQueue(null, newAccessToken);

      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      console.log("Token refrescado exitosamente");
      
      return apiClient(originalRequest);

    } catch (refreshError) {
      console.error("Error al refrescar token:", refreshError);
      isRefreshing = false;
      processQueue(refreshError, null);
      
      // Si falló el refresh, limpiamos y redirigimos
      clearAuthAndRedirect();
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
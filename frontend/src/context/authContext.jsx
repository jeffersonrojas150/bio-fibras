// src/context/authContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api'; 

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un token válido al cargar la app
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Si hay token, intentamos obtener el perfil del usuario
          const response = await apiClient.get('/auth/perfil/');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          // Si el token es inválido/expirado, limpiamos
          console.error('Sesión inválida, limpiando...', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  //  Función de login conectada a la API
  const login = async (email, password) => {
    try {
      // Django JWT espera 'username' y 'password'. Usamos el email como username.
      const response = await apiClient.post('/auth/token/', {
        username: email, 
        password: password,
      });

      // Guardamos los tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Obtenemos el perfil del usuario
      const userProfileResponse = await apiClient.get('/auth/perfil/');
      const userData = userProfileResponse.data;

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData)); // Guardamos datos del usuario

    } catch (error) {
      console.error('Error en login:', error.response?.data || error);
      // Lanzamos el error para que el componente del formulario lo pueda manejar
      throw error; 
    }
  };

    // Nueva función para el login con Google
  const loginWithGoogle = async (code) => {
    try {
      // 1. Hacemos la petición POST a nuestro endpoint de Django
      const response = await apiClient.post('/auth/google/', {
        code: code,
      });

      // 2. Django nos devuelve nuestros propios tokens JWT
      const { access, refresh } = response.data;

      // 3. Guardamos los tokens en localStorage
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // 4. Actualizamos el interceptor de apiClient para usar el nuevo token
      //    (Aunque el interceptor lo hace en la siguiente petición,
      //    es buena práctica actualizarlo explícitamente si es necesario)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;


      // 5. Obtenemos el perfil del usuario para actualizar el estado
      const userProfileResponse = await apiClient.get('/auth/perfil/');
      const userData = userProfileResponse.data;

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));

    } catch (error) {
      console.error('Error en el login con Google:', error.response?.data || error);
      // Limpiamos cualquier token residual si falla la autenticación
      logout(); 
      throw error; // Lanzamos el error para que el componente lo maneje si es necesario
    }
  };

  //  Función de registro conectada a la API
  const register = async (userData) => {
    try {
      // Mapeamos los nombres de los campos del formulario a los que espera la API de Django
      const apiData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password2: userData.confirmPassword, // El serializer espera password2
        first_name: userData.firstName,
        last_name: userData.lastName
      };
      
      await apiClient.post('/auth/registro/', apiData);

    } catch (error) {
      console.error('Error en registro:', error.response?.data || error);
      throw error; // Lanzamos el error para que el formulario lo maneje
    }
  };

  // Función de logout mejorada para limpiar tokens
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

    // Función para actualizar los datos del usuario
  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
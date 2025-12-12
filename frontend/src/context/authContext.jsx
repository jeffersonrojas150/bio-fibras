// src/context/authContext.jsx
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
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
  const checkAttempts = useRef(0);
  const MAX_CHECK_ATTEMPTS = 2;

  // Verificar si hay un token válido al cargar la app
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!token || !refreshToken) {
        setLoading(false);
        return;
      }

      // Verificamos que no hayamos intentado demasiadas veces
      if (checkAttempts.current >= MAX_CHECK_ATTEMPTS) {
        console.warn('Demasiados intentos de verificación. Limpiando sesión.');
        logout();
        setLoading(false);
        return;
      }

      checkAttempts.current++;
      
      try {
        // Si hay token, intentamos obtener el perfil del usuario
        const response = await apiClient.get('/auth/perfil/');
        setUser(response.data);
        setIsAuthenticated(true);
        checkAttempts.current = 0; // Reset si fue exitoso
      } catch (error) {
        // Si el token es inválido/expirado, limpiamos
        console.error('Sesión inválida, limpiando...', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  //  Función de login conectada a la API
  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/token/', {
        username: email, 
        password: password,
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      const userProfileResponse = await apiClient.get('/auth/perfil/');
      const userData = userProfileResponse.data;

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      checkAttempts.current = 0; // Reset contador

    } catch (error) {
      console.error('Error en login:', error.response?.data || error);
      throw error; 
    }
  };

  // Nueva función para el login con Google
  const loginWithGoogle = async (code) => {
    try {
      const response = await apiClient.post('/auth/google/', {
        code: code,
      });

      const { access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      const userProfileResponse = await apiClient.get('/auth/perfil/');
      const userData = userProfileResponse.data;

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      checkAttempts.current = 0; // Reset contador

    } catch (error) {
      console.error('Error en el login con Google:', error.response?.data || error);
      logout(); 
      throw error;
    }
  };

  //  Función de registro conectada a la API
  const register = async (userData) => {
    try {
      const apiData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password2: userData.confirmPassword,
        first_name: userData.firstName,
        last_name: userData.lastName
      };
      
      await apiClient.post('/auth/registro/', apiData);

    } catch (error) {
      console.error('Error en registro:', error.response?.data || error);
      throw error;
    }
  };

  // Función de logout mejorada para limpiar tokens
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    checkAttempts.current = 0; // Reset contador
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
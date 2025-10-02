// src/context/authContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

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

  // Verificar si hay un usuario guardado al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Función de login (aquí conectarás tu API)
  const login = async (email, password) => {
    try {
      // TODO: Aquí irá tu llamada a la API
      // const response = await fetch('tu-api/login', { ... });
      
      // Por ahora, simulamos un login exitoso
      const mockUser = {
        id: 1,
        name: 'Juan Pérez',
        email: email,
        avatar: null
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    }
  };

  // Función de registro (aquí conectarás tu API)
  const register = async (userData) => {
    try {
      // TODO: Aquí irá tu llamada a la API
      // const response = await fetch('tu-api/register', { ... });
      
      // Por ahora, simulamos un registro exitoso
      const mockUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        avatar: null
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { success: true };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error al registrarse' };
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Actualizar datos del usuario
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
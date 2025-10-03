// src/context/favoritesContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api';
import { useAuth } from './authContext';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Cargar favoritos desde localStorage al iniciar
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  // Guardar favoritos en localStorage cada vez que cambian
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } else {
      localStorage.removeItem('favorites');
    }
  }, [favorites]);

  // Función para obtener los favoritos del usuario desde la API
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await apiClient.get('/favoritos/');
      const data = response.data.results || response.data;
      setFavorites(data);
      localStorage.setItem('favorites', JSON.stringify(data)); // Guardar también en localStorage
    } catch (error) {
      console.error('Error al obtener los favoritos:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Obtener favoritos cuando el usuario se autentica o cierra sesión
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setFavorites([]); 
      localStorage.removeItem('favorites'); // Limpiar favoritos si cierra sesión
    }
  }, [isAuthenticated, fetchFavorites]);

  // Función para AÑADIR un favorito
  const addFavorite = async (productId) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para añadir a favoritos');
      return;
    }
    try {
      await apiClient.post('/favoritos/', { producto_id: productId });
      fetchFavorites();
    } catch (error) {
      console.error('Error al añadir favorito:', error);
    }
  };

  // Función para QUITAR un favorito
  const removeFavorite = async (productId) => {
    const favoriteToRemove = favorites.find(fav => fav.producto.id === productId);
    if (!favoriteToRemove) return;

    try {
      await apiClient.delete(`/favoritos/${favoriteToRemove.id}/`);
      const updatedFavorites = favorites.filter(fav => fav.id !== favoriteToRemove.id);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error al quitar favorito:', error);
    }
  };

  // Saber si un producto ya es favorito
  const isFavorite = (productId) => {
    return favorites.some(fav => fav.producto.id === productId);
  };

  const value = {
    favorites,
    loading,
    fetchFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    favoritesCount: favorites.length,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

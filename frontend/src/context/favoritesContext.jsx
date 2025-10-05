// src/context/favoritesContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api';
import { useAuth } from './authContext'; 

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await apiClient.get('/favoritos/');
      const data = response.data.results || response.data;
      setFavorites(data);
    } catch (error) {
      console.error('Error al obtener los favoritos:', error.response?.data || error.message);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated, fetchFavorites]);

  const addFavorite = async (product) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para añadir a favoritos.');
      return;
    }
    const previousFavorites = [...favorites];
    const optimisticFavorite = {
      id: `temp-${product.id}`, 
      producto: product,
      fecha_agregado: new Date().toISOString(),
    };
    setFavorites(prev => [...prev, optimisticFavorite]);
    try {
      const response = await apiClient.post('/favoritos/', { producto_id: product.id });
      const newFavoriteFromServer = response.data;
      setFavorites(prev =>
        prev.map(fav =>
          fav.id === optimisticFavorite.id ? newFavoriteFromServer : fav
        )
      );
    } catch (error) {
      console.error('Error al añadir favorito:', error.response?.data || error.message);
      setFavorites(previousFavorites);
      alert('No se pudo añadir el producto a favoritos. Inténtalo de nuevo.');
    }
  };

  const removeFavorite = async (productId) => {
    const favoriteToRemove = favorites.find(fav => fav.producto.id === productId);
    if (!favoriteToRemove) return;
    const isTemporary = typeof favoriteToRemove.id === 'string' && favoriteToRemove.id.startsWith('temp-');
    const previousFavorites = [...favorites];
    const updatedFavorites = favorites.filter(fav => fav.producto.id !== productId);
    setFavorites(updatedFavorites);
    if (!isTemporary) {
      try {
        await apiClient.delete(`/favoritos/${favoriteToRemove.id}/`);
      } catch (error) {
        console.error('Error al quitar favorito:', error.response?.data || error.message);
        setFavorites(previousFavorites);
        alert('No se pudo quitar el producto de favoritos. Inténtalo de nuevo.');
      }
    }
  };

  const isFavorite = (productId) => {
    return favorites.some(fav => fav.producto.id === productId);
  };

  const value = {
    favorites,
    loading,
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
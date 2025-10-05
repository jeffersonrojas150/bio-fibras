import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './authContext';
import apiClient from '../api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const { data } = await apiClient.get('/carrito/');
      
      const formattedCart = data.results.map(apiItem => {
        const productData = apiItem.producto;

        return {
          id: productData.id,
          nombre: productData.nombre,
          slug: productData.slug,
          precio_unitario: productData.precio_unitario,
          precio_oferta: productData.precio_oferta,
          precio_mayor: productData.precio_mayor,
          cantidad_minima_mayor: productData.cantidad_minima_mayor,
          categoria: productData.categoria,
          imagen_principal: productData.imagen_principal,
          stock: productData.stock,
          cartItemId: apiItem.id,
          quantity: parseInt(apiItem.cantidad, 10) || 1,
        };
      });

      setCartItems(formattedCart);
    } catch (error) {
      console.error("Error al obtener el carrito del backend:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      return updateQuantity(product.id, existingItem.quantity + quantity);
    }

    const previousCart = [...cartItems];
    const tempId = `temp-${Date.now()}`;

    const optimisticItem = {
      ...product,
      quantity,
      cartItemId: tempId
    };
    setCartItems(currentCart => [...currentCart, optimisticItem]);

    try {
      const response = await apiClient.post('/carrito/', {
        producto_id: product.id,
        cantidad: quantity
      });
      const createdItemFromAPI = response.data;

      setCartItems(currentCart => currentCart.map(item =>
        item.cartItemId === tempId
          ? {
            ...item,
            ...createdItemFromAPI.producto,
            cartItemId: createdItemFromAPI.id,
            quantity: createdItemFromAPI.cantidad,
          }
          : item
      ));
    } catch (error) {
      console.error("Error al añadir al carrito:", error);
      alert("Hubo un error al añadir el producto. Por favor, inténtalo de nuevo.");
      setCartItems(previousCart);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    const previousCart = [...cartItems];
    const itemToRemove = previousCart.find(item => item.id === productId);
    if (!itemToRemove) return;

    setCartItems(previousCart.filter(item => item.id !== productId));

    try {
      await apiClient.delete(`/carrito/${itemToRemove.cartItemId}/`);
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
      alert("Hubo un error al eliminar el producto.");
      setCartItems(previousCart);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity, 10);

    if (isNaN(parsedQuantity)) {
      console.error("Cantidad inválida:", newQuantity);
      return;
    }

    if (parsedQuantity <= 0) {
      return removeFromCart(productId);
    }

    const previousCart = [...cartItems];
    const itemToUpdate = previousCart.find(item => item.id === productId);

    if (!itemToUpdate || String(itemToUpdate.cartItemId).startsWith('temp-')) {
      console.warn("Intento de actualizar un item que aún no está sincronizado.");
      return;
    }

    // Actualización optimista
    setCartItems(currentCart => currentCart.map(item =>
      item.id === productId ? { ...item, quantity: parsedQuantity } : item
    ));

    try {
      await apiClient.patch(`/carrito/${itemToUpdate.cartItemId}/`, {
        cantidad: parsedQuantity
      });
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      alert("No se pudo actualizar la cantidad del producto.");
      setCartItems(previousCart);
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        await Promise.all(cartItems.map(item =>
          apiClient.delete(`/carrito/${item.cartItemId}/`)
        ));
        fetchCart();
      } catch (error) {
        console.error("Error al vaciar el carrito:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleCart = () => {
    setIsCartOpen(prev => !prev);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.precio_oferta || item.precio_unitario || 0);
      const quantity = parseInt(item.quantity || 0, 10);

      if (!isNaN(price) && !isNaN(quantity)) {
        return total + (price * quantity);
      }
      return total;
    }, 0);
  };

  const value = {
    cartItems,
    isCartOpen,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    getTotalItems,
    getTotalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
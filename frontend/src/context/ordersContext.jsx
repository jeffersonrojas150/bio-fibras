// src/context/ordersContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import apiClient from '../api';

const OrdersContext = createContext(null);

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState(null);   // null = no cargado aún
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carga órdenes solo si no hay caché; si forceRefresh=true siempre recarga
  const fetchOrders = useCallback(async (forceRefresh = false) => {
    if (orders !== null && !forceRefresh) return; // usar caché

    setLoading(true);
    setError(null);
    try {
        const response = await apiClient.get('/ordenes/');
        setOrders(response.data.results || response.data);
        } catch (err) {
        console.error('Error al cargar órdenes:', err);
        setError('No pudimos cargar tu historial de órdenes. Inténtalo de nuevo más tarde.');
        } finally {
        setLoading(false);
        }
    }, [orders]);

    // Llamar esto después de crear una orden nueva para forzar recarga
    const invalidateOrders = useCallback(() => {
        setOrders(null);
    }, []);

    return (
        <OrdersContext.Provider value={{ orders, loading, error, fetchOrders, invalidateOrders }}>
        {children}
        </OrdersContext.Provider>
    );
};

export const useOrders = () => {
    const ctx = useContext(OrdersContext);
    if (!ctx) throw new Error('useOrders debe usarse dentro de <OrdersProvider>');
    return ctx;
};
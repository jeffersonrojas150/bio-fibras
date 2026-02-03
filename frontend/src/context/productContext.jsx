import React, { createContext, useState, useContext, useCallback } from 'react';
import apiClient from '../api';

const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts debe ser usado dentro de un ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Función para cargar productos (con opción de forzar recarga)
    const fetchProducts = useCallback(async (forceRefresh = false) => {
        // Si ya está cargando, no hacer nada
        if (loading) {
            return;
        }

        // Si ya hay productos y NO se fuerza el refresh, no recargar
        if (products.length > 0 && !forceRefresh) {
            console.log("ProductContext: Productos ya cargados en caché.");
            return;
        }

        console.log("ProductContext: Cargando productos desde la API...");
        setLoading(true);
        setError(null);

        try {
            // ✅ SOLUCIÓN: Traer hasta 1000 productos en una sola página
            const response = await apiClient.get('/productos/?page_size=1000');
            
            // Django devuelve los productos en 'results' cuando hay paginación
            const productsData = response.data.results || response.data;
            
            setProducts(productsData);
            console.log(`ProductContext: ${productsData.length} productos cargados exitosamente.`);
        } catch (err) {
            console.error("Error al cargar productos en ProductContext:", err);
            setError('No se pudieron cargar los productos. Intenta refrescar la página.');
        } finally {
            setLoading(false);
        }
    }, [loading, products.length]);

    // ✅ Función para refrescar productos manualmente (útil después de crear productos)
    const refreshProducts = useCallback(() => {
        console.log("ProductContext: Forzando recarga de productos...");
        return fetchProducts(true);
    }, [fetchProducts]);

    // ✅ Función para limpiar caché (útil para logout)
    const clearProducts = useCallback(() => {
        console.log("ProductContext: Limpiando caché de productos...");
        setProducts([]);
        setError(null);
    }, []);

    const value = {
        products,
        loading,
        error,
        fetchProducts,
        refreshProducts,  // ✅ Nueva función expuesta
        clearProducts,    // ✅ Nueva función expuesta
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
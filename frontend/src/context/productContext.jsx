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

    const fetchProducts = useCallback(async () => {
        if (loading || products.length > 0) {
            return;
        }

        console.log("ProductContext: No hay productos en el estado global. Realizando llamada a la API...");
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.get('/productos/');
            setProducts(response.data.results || response.data);
        } catch (err) {
            console.error("Error al cargar productos en ProductContext:", err);
            setError('No se pudieron cargar los productos. Intenta refrescar la página.');
        } finally {
            setLoading(false);
        }
    }, [loading, products.length]);

    const value = {
        products,
        loading,
        error,
        fetchProducts,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
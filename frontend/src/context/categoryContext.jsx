import React, { createContext, useState, useContext, useCallback } from 'react';
import apiClient from '../api';

const CategoryContext = createContext();

export const useCategories = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategories debe ser usado dentro de un CategoryProvider');
    }
    return context;
};

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        if (loading || categories.length > 0) {
            return;
        }

        console.log("CategoryContext: No hay categorías en el estado global. Realizando llamada a la API...");
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.get('/categorias/');
            const apiCategories = response.data.results || response.data;

            const transformedCategories = apiCategories.map(cat => ({
                id: cat.slug,
                name: cat.nombre,
                image: cat.imagen_url,
                slug: cat.slug,
            }));

            setCategories(transformedCategories);
        } catch (err) {
            console.error("Error al cargar categorías en CategoryContext:", err);
            setError('No se pudieron cargar las categorías. Intenta refrescar la página.');
        } finally {
            setLoading(false);
        }
    }, [loading, categories.length]);

    const value = {
        categories,
        loading,
        error,
        fetchCategories,
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};
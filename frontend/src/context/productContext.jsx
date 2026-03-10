import React, { createContext, useState, useContext, useCallback, useRef } from 'react';
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
    
    // ✅ Circuit breaker
    const fetchAttempts = useRef(0);
    const MAX_ATTEMPTS = 2;
    const isBlocked = useRef(false);
    const blockUntil = useRef(0);

    const fetchProducts = useCallback(async (forceRefresh = false) => {
        // ✅ Si estamos bloqueados por 429, verificar si ya pasó el tiempo
        const now = Date.now();
        if (isBlocked.current && now < blockUntil.current) {
            const secondsLeft = Math.ceil((blockUntil.current - now) / 1000);
            console.error(`🚫 Bloqueado por rate limit. Intenta en ${secondsLeft} segundos.`);
            setError(`Servicio temporalmente no disponible. Intenta en ${secondsLeft} segundos.`);
            return;
        } else if (isBlocked.current && now >= blockUntil.current) {
            // Ya pasó el tiempo de bloqueo, resetear
            console.log("✅ Bloqueo de rate limit expirado. Reiniciando...");
            isBlocked.current = false;
            fetchAttempts.current = 0;
        }

        if (loading) {
            console.log("⚠️ Ya hay una carga en progreso");
            return;
        }

        if (products.length > 0 && !forceRefresh) {
            console.log("✅ Productos ya cargados en caché");
            return;
        }

        // ✅ Limitar intentos fallidos
        if (fetchAttempts.current >= MAX_ATTEMPTS) {
            console.error("❌ Máximo de intentos alcanzado");
            setError('No se pudieron cargar los productos. Por favor recarga la página manualmente.');
            return;
        }

        console.log(`🔄 Cargando productos (intento ${fetchAttempts.current + 1}/${MAX_ATTEMPTS})...`);
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient.get('/productos/?page_size=1000');
            const productsData = response.data.results || response.data;
            
            setProducts(productsData);
            fetchAttempts.current = 0; // Reset en éxito
            isBlocked.current = false;
            console.log(`✅ ${productsData.length} productos cargados exitosamente`);
        } catch (err) {
            console.error("❌ Error al cargar productos:", err);
            
            // ✅ Detectar error 429 específicamente
            if (err.response?.status === 429) {
                console.error("🚫 RATE LIMIT (429) - Bloqueando intentos por 2 minutos");
                isBlocked.current = true;
                blockUntil.current = Date.now() + (2 * 60 * 1000); // 2 minutos
                fetchAttempts.current = 0; // Reset para que cuando expire pueda intentar
                setError('El servidor está experimentando alto tráfico. Por favor espera 2 minutos e intenta de nuevo.');
                return; // ⚠️ IMPORTANTE: No incrementar fetchAttempts en 429
            }
            
            // Para otros errores, incrementar intentos
            fetchAttempts.current++;
            
            if (fetchAttempts.current >= MAX_ATTEMPTS) {
                setError('No se pudieron cargar los productos después de varios intentos.');
            } else {
                setError('Error al cargar productos. Reintentando...');
                // ⚠️ NO reintentar automáticamente, dejar que el usuario recargue
            }
        } finally {
            setLoading(false);
        }
    }, [loading, products.length]);

    const refreshProducts = useCallback(() => {
        console.log("🔄 Forzando recarga de productos...");
        // Solo permitir refresh manual si no estamos bloqueados
        if (!isBlocked.current || Date.now() >= blockUntil.current) {
            fetchAttempts.current = 0;
            isBlocked.current = false;
            return fetchProducts(true);
        } else {
            const secondsLeft = Math.ceil((blockUntil.current - Date.now()) / 1000);
            console.warn(`⚠️ No se puede refrescar aún. Espera ${secondsLeft} segundos.`);
        }
    }, [fetchProducts]);

    const clearProducts = useCallback(() => {
        console.log("🗑️ Limpiando caché de productos...");
        setProducts([]);
        setError(null);
        fetchAttempts.current = 0;
        isBlocked.current = false;
        blockUntil.current = 0;
    }, []);

    const value = {
        products,
        loading,
        error,
        fetchProducts,
        refreshProducts,
        clearProducts,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};
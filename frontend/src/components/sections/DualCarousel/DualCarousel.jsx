// DualCarousel.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query'; 
import apiClient from '../../../api'; 
import './DualCarousel.css';

// Función auxiliar para mostrar precios y descuentos
const getProductDisplayData = (product) => {
    const precioUnitario = parseFloat(product.precio_unitario);
    const precioOferta = product.precio_oferta ? parseFloat(product.precio_oferta) : null;

    let currentPrice = precioUnitario;
    let oldPrice = null;
    let discount = null;

    if (precioOferta && precioOferta < precioUnitario) {
        currentPrice = precioOferta;
        oldPrice = precioUnitario;
        const desc = ((precioUnitario - precioOferta) / precioUnitario) * 100;
        discount = `${Math.round(desc)}%`;
    }

    return {
        title: product.nombre,
        image: product.imagen_principal,
        category: product.categoria,
        slug: product.slug,
        price: `S/ ${currentPrice.toFixed(2)}`,
        oldPrice: oldPrice ? `S/ ${oldPrice.toFixed(2)}` : null,
        discount: discount,
    };
};

// --- Funciones Fetch para React Query ---
const fetchFeatured = async () => {
    const res = await apiClient.get('/productos/destacados/');
    return res.data.results || [];
};

const fetchSale = async () => {
    const res = await apiClient.get('/productos/ofertas/');
    return res.data.results || [];
};

const DualCarousel = () => {
    const navigate = useNavigate();

    // Obtener productos destacados
    const { data: featuredProducts = [], isLoading: isLoadingFeatured, error: errorFeatured } = useQuery({
        queryKey: ['featuredProducts'],
        queryFn: fetchFeatured,
    });

    // Obtener productos en oferta
    const { data: saleProducts = [], isLoading: isLoadingSale, error: errorSale } = useQuery({
        queryKey: ['saleProducts'],
        queryFn: fetchSale,
    });

    const loading = isLoadingFeatured || isLoadingSale;
    const error = errorFeatured || errorSale
        ? "Error al cargar los productos. Por favor, revisa tu conexión."
        : null;

    // Duplicar productos para scroll infinito
    const duplicatedFeatured = [...featuredProducts, ...featuredProducts, ...featuredProducts];
    const duplicatedSale = [...saleProducts, ...saleProducts, ...saleProducts];

    // Refs para los contenedores
    const containerRef1 = useRef(null);
    const containerRef2 = useRef(null);
    const interactionTimerRef1 = useRef(null);
    const interactionTimerRef2 = useRef(null);

    const SCROLL_SPEED = 1;
    const SCROLL_INTERVAL = 20;
    const RESTART_DELAY = 800;

    // --- Lógica de scroll automático ---
    const startScroll = (ref, speed) => {
        if (ref.current && ref.current.intervalId) return;

        const scrollFunc = () => {
            const container = ref.current;
            if (!container || container.children.length === 0) return;

            const totalWidthOfOneCopy = container.scrollWidth / 3;
            container.scrollLeft += speed;

            if (speed > 0 && container.scrollLeft >= totalWidthOfOneCopy) {
                container.scrollLeft -= totalWidthOfOneCopy;
            } else if (speed < 0 && container.scrollLeft <= 0) {
                container.scrollLeft = totalWidthOfOneCopy;
            }
        };

        ref.current.intervalId = setInterval(scrollFunc, SCROLL_INTERVAL);
    };

    const stopScroll = (ref) => {
        if (ref.current && ref.current.intervalId) {
            clearInterval(ref.current.intervalId);
            ref.current.intervalId = null;
        }
    };

    const scheduleScrollRestart = (ref, speed, timerRef) => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            startScroll(ref, speed);
        }, RESTART_DELAY);
    };

    // Inicializar scroll cuando los datos carguen
    useEffect(() => {
        const initScrollPosition = () => {
            if (featuredProducts.length > 0 && containerRef1.current) {
                containerRef1.current.scrollLeft = containerRef1.current.scrollWidth / 3;
                startScroll(containerRef1, SCROLL_SPEED);
            }
            if (saleProducts.length > 0 && containerRef2.current) {
                containerRef2.current.scrollLeft = containerRef2.current.scrollWidth / 3;
                startScroll(containerRef2, -SCROLL_SPEED);
            }
        };

        const timeoutId = setTimeout(initScrollPosition, 50);

        return () => {
            clearTimeout(timeoutId);
            stopScroll(containerRef1);
            stopScroll(containerRef2);
            if (interactionTimerRef1.current) clearTimeout(interactionTimerRef1.current);
            if (interactionTimerRef2.current) clearTimeout(interactionTimerRef2.current);
        };
    }, [featuredProducts, saleProducts]);

    // --- Eventos de usuario ---
    const handleProductClick = (slug, e) => {
        if (e.target.closest('.quick-view-btn')) {
            e.stopPropagation();
            return;
        }
        if (e.button !== 0) return;
        navigate(`/producto/${slug}`);
    };

    const handleQuickView = (title, e) => {
        e.stopPropagation();
        console.log('Vista rápida de', title);
    };

    // --- Componente de tarjeta ---
    const ProductCardComponent = ({ product, type }) => {
        const data = getProductDisplayData(product);
        const ref = type === 'featured' ? containerRef1 : containerRef2;
        const speed = type === 'featured' ? SCROLL_SPEED : -SCROLL_SPEED;
        const timerRef = type === 'featured' ? interactionTimerRef1 : interactionTimerRef2;

        return (
            <div
                className="product-card"
                onClick={(e) => handleProductClick(data.slug, e)}
                onMouseEnter={() => stopScroll(ref)}
                onMouseLeave={() => scheduleScrollRestart(ref, speed, timerRef)}
            >
                <div className="product-image-container">
                    {data.discount && <span className="discount-badge">-{data.discount}</span>}
                    <img
                        src={data.image || 'https://via.placeholder.com/300x350?text=No+Image'}
                        alt={data.title}
                        className="product-image"
                    />
                  
                    
                </div>
                <div className="product-info">
                    <span className="product-category">{data.category}</span>
                    <h3 className="product-title">{data.title}</h3>
                    <div className="price-container">
                        <p className="product-price">{data.price}</p>
                        {data.oldPrice && <p className="old-price">{data.oldPrice}</p>}
                    </div>
                </div>
            </div>
        );
    };

    // --- Render ---
    if (loading) {
        return (
            <div className="dual-carousel-container">
                <p style={{ textAlign: 'center' }}>Cargando productos destacados y ofertas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dual-carousel-container">
                <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
            </div>
        );
    }

    const shouldRender = featuredProducts.length > 0 || saleProducts.length > 0;
    if (!shouldRender) return null;

    return (
        <div className="dual-carousel-container">
            {/* Sección de Productos Destacados */}
            {featuredProducts.length > 0 && (
                <div className="carousel-section">
                    <div className="carousel-header">
                        <h2 className="carousel-title">PRODUCTOS DESTACADOS</h2>
                    </div>
                    <div
                        ref={containerRef1}
                        className="carousel-wrapper"
                        style={{
                            overflowX: 'scroll',
                            overflowY: 'hidden',
                            cursor: 'grab',
                            userSelect: 'none',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                        onScroll={() =>
                            scheduleScrollRestart(containerRef1, SCROLL_SPEED, interactionTimerRef1)
                        }
                    >
                        <div className="carousel-track">
                            {duplicatedFeatured.map((product, index) => (
                                <ProductCardComponent
                                    key={`featured-${index}`}
                                    product={product}
                                    type="featured"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Sección de Ofertas */}
            {saleProducts.length > 0 && (
                <div className="carousel-section">
                    <div className="carousel-header">
                        <h2 className="carousel-title">OFERTAS ESPECIALES</h2>
                    </div>
                    <div
                        ref={containerRef2}
                        className="carousel-wrapper"
                        style={{
                            overflowX: 'scroll',
                            overflowY: 'hidden',
                            cursor: 'grab',
                            userSelect: 'none',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                        onScroll={() =>
                            scheduleScrollRestart(containerRef2, -SCROLL_SPEED, interactionTimerRef2)
                        }
                    >
                        <div className="carousel-track">
                            {duplicatedSale.map((product, index) => (
                                <ProductCardComponent
                                    key={`sale-${index}`}
                                    product={product}
                                    type="sale"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DualCarousel;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Offcanvas, Spinner, Alert } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaShoppingCart, FaFilter, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import './Products.css';
import apiClient from '../../api';
import CustomSortDropdown from './CustomSortDropdown';


// ==============================================================================
// COMPONENTE AUXILIAR PARA RENDERIZAR LOS PRECIOS DE FORMA LIMPIA
// Este componente se encarga de toda la lógica de qué precio mostrar y cómo.
// ==============================================================================
const ProductPriceDisplay = ({ product }) => {
  return (
    <>
      <div className="product-price">
        {/* Si hay un `originalPrice` (lo que significa que hay una oferta), lo mostramos tachado. */}
        {product.originalPrice && (
          <span className="original-price">S/ {product.originalPrice.toFixed(2)}</span>
        )}
        {/* Siempre mostramos el precio principal (`price`), que será la oferta o el precio unitario. */}
        <span className="current-price">S/ {product.price.toFixed(2)}</span>
      </div>

      {/* Si el producto tiene un precio y cantidad al por mayor, mostramos la información. */}
      {product.wholesalePrice && product.wholesaleMinQuantity && (
        <div className="wholesale-price-info">
          A partir de {product.wholesaleMinQuantity} unid. a <strong>S/ {product.wholesalePrice.toFixed(2)} c/u</strong>
        </div>
      )}
    </>
  );
};


const Products = () => {
  // === ESTADOS ===
  const [products, setProducts] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedPriceRanges, setSelectedPriceRanges] = useState(new Set());
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  
  const navigate = useNavigate();

  // === CONSTANTES DE CONFIGURACIÓN ===
  const priceRanges = [
    { value: '0-50', label: 'Hasta S/ 50' },
    { value: '50-100', label: 'S/ 50 - S/ 100' },
    { value: '100-150', label: 'S/ 100 - S/ 150' },
    { value: '150-200', label: 'S/ 150 - S/ 200' },
    { value: '200-99999', label: 'Más de S/ 200' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
  ];

  // === EFECTO PARA OBTENER DATOS DE LA API AL CARGAR ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [productsResponse, categoriesResponse] = await Promise.all([
          apiClient.get('/productos/'),
          apiClient.get('/categorias/')
        ]);

        // ==============================================================================
        // TRANSFORMACIÓN DE DATOS ACTUALIZADA
        // Aquí procesamos los datos de la API para que coincidan con lo que necesitamos mostrar.
        // ==============================================================================
        const transformedProducts = productsResponse.data.results.map(product => {
          const hasOffer = product.precio_oferta && parseFloat(product.precio_oferta) > 0;
          
          return {
            id: product.id,
            name: product.nombre,
            slug: product.slug,
            // `price` es el precio principal a mostrar. Si hay oferta, es el `precio_oferta`. Si no, el `precio_unitario`.
            price: hasOffer ? parseFloat(product.precio_oferta) : parseFloat(product.precio_unitario),
            // `originalPrice` solo existe si hay una oferta, y es el `precio_unitario` que se mostrará tachado.
            originalPrice: hasOffer ? parseFloat(product.precio_unitario) : null,
            // NUEVOS CAMPOS para el precio por mayor.
            wholesalePrice: product.precio_mayor ? parseFloat(product.precio_mayor) : null,
            wholesaleMinQuantity: product.cantidad_minima_mayor || null,
            image: product.imagen_principal,
            category: product.categoria,
            inStock: true, // Asumimos que hay stock.
          };
        });

        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);

        // La transformación de categorías no cambia.
        const transformedCategories = (categoriesResponse.data.results || categoriesResponse.data).map(cat => ({
            value: cat.slug,
            label: cat.nombre,
        }));
        setCategories(transformedCategories);

      } catch (err) {
        setError('Hubo un problema al cargar los productos. Por favor, intenta de nuevo más tarde.');
        console.error("Error al obtener datos de la API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // === EFECTO PARA FILTRAR Y ORDENAR PRODUCTOS CUANDO CAMBIAN LOS FILTROS ===
  useEffect(() => {
    const filterProducts = () => {
      let filtered = [...products];
      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (selectedCategories.size > 0) {
        const categoryNames = new Set(
            categories
                .filter(c => selectedCategories.has(c.value))
                .map(c => c.label)
        );
        filtered = filtered.filter(product => categoryNames.has(product.category));
      }
      if (selectedPriceRanges.size > 0) {
        filtered = filtered.filter(product => {
          return Array.from(selectedPriceRanges).some(range => {
            const [min, max] = range.split('-').map(Number);
            return product.price >= min && product.price <= max;
          });
        });
      }
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price-low': return a.price - b.price;
          case 'price-high': return b.price - a.price;
          case 'name-desc': return b.name.localeCompare(a.name);
          case 'name':
          default: return a.name.localeCompare(b.name);
        }
      });
      setFilteredProducts(filtered);
    };
    
    if (!loading) {
      filterProducts();
    }
  }, [searchTerm, selectedCategories, selectedPriceRanges, sortBy, products, categories, loading]);
  
  // === MANEJADORES DE EVENTOS ===
  const handleProductClick = (slug) => navigate(`/producto/${slug}`);
  const toggleFavorite = (e, productId) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) newFavorites.delete(productId);
    else newFavorites.add(productId);
    setFavorites(newFavorites);
  };
  const handleCategoryChange = (categoryValue) => {
    const newSelectedCategories = new Set(selectedCategories);
    if (newSelectedCategories.has(categoryValue)) newSelectedCategories.delete(categoryValue);
    else newSelectedCategories.add(categoryValue);
    setSelectedCategories(newSelectedCategories);
  };
  const handlePriceRangeChange = (rangeValue) => {
    const newSelectedPriceRanges = new Set(selectedPriceRanges);
    if (newSelectedPriceRanges.has(rangeValue)) newSelectedPriceRanges.delete(rangeValue);
    else newSelectedPriceRanges.add(rangeValue);
    setSelectedPriceRanges(newSelectedPriceRanges);
  };
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories(new Set());
    setSelectedPriceRanges(new Set());
    setSortBy('name');
  };

  const hasActiveFilters = searchTerm || selectedCategories.size > 0 || selectedPriceRanges.size > 0;

  // === COMPONENTES DE RENDERIZADO ===
  const FilterSidebar = ({ isMobile = false }) => (
    <div className="filters-container">
      <div className="filters-header">
        <h5 >Filtrar Productos</h5>
        {isMobile ? (
          <Button variant="link" className="close-filters-btn" onClick={() => setShowFilters(false)}><FaTimes /></Button>
        ) : (
          hasActiveFilters && <Button variant="link" className="clear-filters-btn" onClick={clearFilters}>Limpiar Filtros</Button>
        )}
      </div>
      <div className="filter-section">
        <h4 className='hola'><span role="img" aria-label="leaf" className="bi bi-grid-fill"></span> Categorías</h4>
        <div className="checkbox-group">
          {categories.map((category) => (
            <Form.Check key={category.value} type="checkbox" id={`category-${category.value}-${isMobile}`} label={category.label} checked={selectedCategories.has(category.value)} onChange={() => handleCategoryChange(category.value)} className="filter-checkbox"/>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <h4 className='hola'><span role="img" aria-label="money"className="bi bi-grid-fill"></span> Precio</h4>
        <div className="checkbox-group">
          {priceRanges.map((range) => (
            <Form.Check key={range.value} type="checkbox" id={`price-${range.value}-${isMobile}`} label={range.label} checked={selectedPriceRanges.has(range.value)} onChange={() => handlePriceRangeChange(range.value)} className="filter-checkbox"/>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando productos...</span>
          </Spinner>
          <p className="mt-2">Cargando productos...</p>
        </div>
      );
    }
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
    if (filteredProducts.length > 0) {
      return (
        <Row className="products-grid grid">
          {filteredProducts.map((product) => (
            <Col key={product.id} xs={6} md={4} className="mb-4">
              <Card className="product-card h-100">
                <div className="product-image-container" onClick={() => handleProductClick(product.slug)} style={{cursor: 'pointer'}}>
                  <Card.Img variant="top" src={product.image} alt={product.name} />
                  <div className="product-badges">
                    {!product.inStock && <Badge bg="secondary">Agotado</Badge>}
                    {product.originalPrice && <Badge bg="warning" text="dark">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</Badge>}
                  </div>
                  <button className={`favorite-btn ${favorites.has(product.id) ? 'favorited' : ''}`} onClick={(e) => toggleFavorite(e, product.id)}>
                    {favorites.has(product.id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="product-title">{product.name}</Card.Title>
                  
                  {/* ============================================================ */}
                  {/* AQUÍ USAMOS NUESTRO COMPONENTE DE PRECIOS                   */}
                  {/* Esto mantiene el código principal de la tarjeta limpio.     */}
                  {/* ============================================================ */}
                  <ProductPriceDisplay product={product} />

                  <Button variant="primary" className="add-to-cart-btn mt-auto" disabled={!product.inStock} onClick={() => handleProductClick(product.slug)}>
                    <FaShoppingCart className="me-2" />
                    {product.inStock ? 'Ver Producto' : 'Agotado'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      );
    } else {
      return (
        <div className="no-products">
          <div className="no-products-content">
            <h4>No se encontraron productos</h4>
            <p>Prueba ajustando los filtros o limpiándolos para ver todos nuestros productos.</p>
            <Button variant="primary" className="btn-mustard" onClick={clearFilters}>Limpiar Filtros</Button>
          </div>
        </div>
      );
    }
  };

  // === JSX PRINCIPAL DEL COMPONENTE ===
  return (
    <div className="products-page">
      <Container fluid className="products-container">
        <Container>
          <div className="products-header">
            <div className="title-section">
              <h1 className="products-main-title">Nuestros Productos</h1>
              {!loading && !error && (
                <p className="products-count">{filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
        </Container>
        <Container>
          <Row>
            <Col lg={3} className="d-none d-lg-block">
              <div className="filters-sidebar"><FilterSidebar /></div>
            </Col>
            <Col lg={9}>
              <div className="toolbar">
                <div className="toolbar-left">
                  <Button variant="outline-secondary" className="d-lg-none mobile-filter-btn" onClick={() => setShowFilters(true)}>
                    <FaFilter className="me-2" />Filtros{hasActiveFilters && <Badge pill bg="danger" className="ms-1 filter-badge-count">{selectedCategories.size + selectedPriceRanges.size}</Badge>}
                  </Button>
                </div>
                <div className="toolbar-right">
                  <div className="sort-controls">
                    <Form.Label className="me-2">Ordenar por:</Form.Label>
                    <CustomSortDropdown
                      options={sortOptions}
                      value={sortBy}
                      onChange={setSortBy}
                    />
                  </div>
                </div>
              </div>
              {renderContent()}
            </Col>
          </Row>
        </Container>
      </Container>
      
      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="start" className="mobile-filters-offcanvas">
        <Offcanvas.Body>
          <FilterSidebar isMobile={true} />
          <div className="mobile-filter-actions">
            <Button className="w-100 mb-2 btn-mustard" onClick={() => setShowFilters(false)}>Aplicar Filtros</Button>
            <Button variant="outline-secondary" className="w-100 btn-mustard-outline" onClick={() => { clearFilters(); }}>Limpiar Filtros</Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Products;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Offcanvas } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaShoppingCart, FaFilter, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import './Products.css';
import { productsData } from '../../mocks/productsData';
import CustomSortDropdown from './CustomSortDropdown';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedPriceRanges, setSelectedPriceRanges] = useState(new Set());
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  const categories = [
    { value: 'lámparas', label: 'Lámparas' },
    { value: 'espejos Rústicos', label: 'Espejos Rústicos' },
    { value: 'tapetes', label: 'Tapetes' },
    { value: 'decoración', label: 'Decoración' }
  ];

  const priceRanges = [
    { value: '0-50', label: 'Hasta S/ 50' },
    { value: '50-100', label: 'S/ 50 - S/ 100' },
    { value: '100-150', label: 'S/ 100 - S/ 150' },
    { value: '150-200', label: 'S/ 150 - S/ 200' },
    { value: '200-9999', label: 'Más de S/ 200' } // Corregido para que el filtro funcione
  ];

  const sortOptions = [
    { value: 'name', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
    
  ];

  useEffect(() => {
    setProducts(productsData);
    setFilteredProducts(productsData);
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategories, selectedPriceRanges, sortBy, products]);

  const filterProducts = () => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategories.size > 0) {
      filtered = filtered.filter(product => selectedCategories.has(product.category));
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
        case 'newest': return new Date(b.addedDate) - new Date(a.addedDate); // Suponiendo que tengas una fecha
        case 'name':
        default: return a.name.localeCompare(b.name);
      }
    });
    setFilteredProducts(filtered);
  };
  
  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`); 
  };
  
  // CORRECCIÓN 1: Se añade e.stopPropagation() para evitar que el clic navegue a otra página.
  const toggleFavorite = (e, productId) => {
    e.stopPropagation(); // ¡Esta es la clave! Detiene el evento de clic para que no se propague al contenedor padre.
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

  return (
    <div className="products-page">
      <Container fluid className="products-container">
        <Container>
          <div className="products-header">
            <div className="title-section">
              <h1 className="products-main-title">Nuestros Productos</h1>
              <p className="products-count">{filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}</p>
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
              {filteredProducts.length > 0 ? (
                <Row className="products-grid grid">
                  {filteredProducts.map((product) => (
                    <Col key={product.id} xs={6} md={4} className="mb-4"> {/* Ajustado para mejor responsividad */}
                      <Card className="product-card h-100">
                        <div className="product-image-container" onClick={() => handleProductClick(product.id)} style={{cursor: 'pointer'}}>
                          <Card.Img variant="top" src={product.image} alt={product.name} />
                          <div className="product-badges">
                            {!product.inStock && <Badge bg="secondary">Agotado</Badge>}
                            {product.originalPrice && <Badge bg="warning" text="dark">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</Badge>}
                          </div>
                          {/* CORRECCIÓN 2: Se pasa el evento (e) a la función y se añade clase dinámica */}
                          <button className={`favorite-btn ${favorites.has(product.id) ? 'favorited' : ''}`} onClick={(e) => toggleFavorite(e, product.id)}>
                            {favorites.has(product.id) ? <FaHeart /> : <FaRegHeart />}
                          </button>
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="product-title">{product.name}</Card.Title>
                          <div className="product-price">
                            {product.originalPrice && <span className="original-price">S/ {product.originalPrice.toFixed(2)}</span>}
                            <span className="current-price">S/ {product.price.toFixed(2)}</span>
                          </div>
                          <Button variant="primary" className="add-to-cart-btn mt-auto" disabled={!product.inStock} onClick={() => handleProductClick(product.id)}>
                            <FaShoppingCart className="me-2" />
                            {product.inStock ? 'Ver Producto' : 'Agotado'}
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="no-products">
                  <div className="no-products-content">
                    <h4>No se encontraron productos</h4>
                    <p>Prueba ajustando los filtros o limpiándolos para ver todos nuestros productos.</p>
                    <Button variant="primary" className="btn-mustard" onClick={clearFilters}>Limpiar Filtros</Button>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </Container>
      {/* CORRECCIÓN 3: Offcanvas modificado (sin header y con nueva clase CSS) */}
      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="start" className="mobile-filters-offcanvas">
        <Offcanvas.Body>
          <FilterSidebar isMobile={true} />
          <div className="mobile-filter-actions">
            {/* CORRECCIÓN 4: Se aplican nuevas clases para los botones color mostaza */}
            <Button className="w-100 mb-2 btn-mustard" onClick={() => setShowFilters(false)}>Aplicar Filtros</Button>
            <Button variant="outline-secondary" className="w-100 btn-mustard-outline" onClick={() => { clearFilters(); }}>Limpiar Filtros</Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Products;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Offcanvas } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaShoppingCart, FaFilter, FaTimes } from 'react-icons/fa';

import './Products.css';
import { productsData } from '../../mocks/productsData'
import { useNavigate } from 'react-router-dom';

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
    { value: '200-250', label: 'Más de S/ 200' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nombre A-Z' },
    { value: 'name-desc', label: 'Nombre Z-A' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
    { value: 'newest', label: 'Más Nuevos' }
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
          return max ? product.price >= min && product.price <= max : product.price >= min;
        });
      });
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'newest': return b.isNew - a.isNew;
        case 'name':
        default: return a.name.localeCompare(b.name);
      }
    });
    setFilteredProducts(filtered);
  };

  // !!! CORRECCIÓN CRÍTICA AQUÍ !!!
  // La ruta debe coincidir exactamente con la definida en App.js
  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`); 
  };

  const toggleFavorite = (productId) => {
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
    <div className={`filters-container ${isMobile ? 'mobile-filters' : 'desktop-filters'}`}>
      <div className="filters-header">
        <h5>Filtrar Productos</h5>
        {hasActiveFilters && <Button variant="link" className="clear-filters-btn" onClick={clearFilters}>Limpiar Filtros</Button>}
        {isMobile && <Button variant="link" className="close-filters-btn" onClick={() => setShowFilters(false)}><FaTimes /></Button>}
      </div>
      <div className="filter-section">
        <h4>🍂Categorías</h4>
        <div className="checkbox-group">
          {categories.map((category) => (
            <Form.Check key={category.value} type="checkbox" id={`category-${category.value}`} label={category.label} checked={selectedCategories.has(category.value)} onChange={() => handleCategoryChange(category.value)} className="filter-checkbox"/>
          ))}
        </div>
      </div>
      <h4></h4>
      <h4></h4>
      <div className="filter-section">
        <h4>🍂Precio</h4>
        <div className="checkbox-group">
          {priceRanges.map((range) => (
            <Form.Check key={range.value} type="checkbox" id={`price-${range.value}`} label={range.label} checked={selectedPriceRanges.has(range.value)} onChange={() => handlePriceRangeChange(range.value)} className="filter-checkbox"/>
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
                    <FaFilter className="me-2" />Filtros{hasActiveFilters && <Badge bg="danger" className="ms-2">!</Badge>}
                  </Button>
                </div>
                <div className="toolbar-right">
                  <div className="sort-controls">
                    <Form.Label className="me-2">Ordenar por:</Form.Label>
                    <Form.Select size="sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                      {sortOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}
                    </Form.Select>
                  </div>
                </div>
              </div>
              {filteredProducts.length > 0 ? (
                <Row className="products-grid grid">
                  {filteredProducts.map((product) => (
                    <Col key={product.id} xs={12} sm={6} lg={4} className="mb-4">
                      <Card className="product-card h-100">
                        <div className="product-image-container" onClick={() => handleProductClick(product.id)} style={{cursor: 'pointer'}}>
                          <Card.Img variant="top" src={product.image} alt={product.name} />
                          <div className="product-badges">
                            {!product.inStock && <Badge bg="danger">Agotado</Badge>}
                            {product.originalPrice && <Badge bg="warning">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</Badge>}
                          </div>
                          <Button variant="link" className="favorite-btn" onClick={() => toggleFavorite(product.id)}>
                            {favorites.has(product.id) ? <FaHeart /> : <FaRegHeart />}
                          </Button>
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="product-title">{product.name}</Card.Title>
                          <div className="product-price">
                            {product.originalPrice && <span className="original-price">S/ {product.originalPrice.toFixed(2)}</span>}
                            <span className="current-price">S/ {product.price.toFixed(2)}</span>
                          </div>
                          {product.wholesalePrice && (
                            <div className="wholesale-info">
                              A partir de {product.wholesalePrice.minUnits} unid. a <strong> S/ {product.wholesalePrice.pricePerUnit.toFixed(2)} c/u</strong>
                            </div>
                          )}
                          {/* Este botón también debería navegar al detalle del producto para añadir al carrito desde allí */}
                          <Button variant="primary" className="add-to-cart-btn mt-auto" disabled={!product.inStock} onClick={() => handleProductClick(product.id)}>
                            <FaShoppingCart className="me-2" />
                            {product.inStock ? 'Añadir al Carrito' : 'Agotado'}
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
                    <p>No hay productos que coincidan con los filtros seleccionados.</p>
                    <Button variant="primary" onClick={clearFilters}>Limpiar Filtros</Button>
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </Container>
      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="start">
        <Offcanvas.Header closeButton><Offcanvas.Title>Filtrar Productos</Offcanvas.Title></Offcanvas.Header>
        <Offcanvas.Body>
          <FilterSidebar isMobile={true} />
          <div className="mobile-filter-actions mt-4">
            <Button variant="primary" className="w-100 mb-2" onClick={() => setShowFilters(false)}>Aplicar Filtros</Button>
            <Button variant="outline-secondary" className="w-100" onClick={() => { clearFilters(); setShowFilters(false); }}>Limpiar Filtros</Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Products;
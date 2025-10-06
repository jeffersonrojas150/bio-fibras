import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Badge, Offcanvas, Spinner, Alert, Pagination } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa';

import apiClient from '../../api';
import CustomSortDropdown from './CustomSortDropdown'; 
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';

const Products = () => {
 
  const { categorySlug: categorySlugFromUrl } = useParams();
  const navigate = useNavigate();

  // === ESTADOS ===
  const [allProducts, setAllProducts] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]); 
  
  // Estados para los filtros del sidebar
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedPriceRanges, setSelectedPriceRanges] = useState(new Set());
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6; 

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

  // === EFECTO PARA OBTENER DATOS INICIALES ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let productsResponse;

        if (categorySlugFromUrl) {
          productsResponse = await apiClient.get(`/categorias/${categorySlugFromUrl}/productos/`);
        } else {
          productsResponse = await apiClient.get('/productos/');
        }
        setAllProducts(productsResponse.data.results || productsResponse.data);

        if (categories.length === 0) {
            const categoriesResponse = await apiClient.get('/categorias/');
            const transformedCategories = (categoriesResponse.data.results || categoriesResponse.data).map(cat => ({
                value: cat.slug,
                label: cat.nombre,
            }));
            setCategories(transformedCategories);
        }

      } catch (err) {
        setError('Hubo un problema al cargar los productos. Por favor, intenta de nuevo más tarde.');
        console.error("Error al obtener datos de la API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categorySlugFromUrl, categories.length]); 

  // === EFECTO PARA SINCRONIZAR FILTROS CON LA URL ===
  useEffect(() => {
    setSelectedCategories(categorySlugFromUrl ? new Set([categorySlugFromUrl]) : new Set());
    setSelectedPriceRanges(new Set()); 
  }, [categorySlugFromUrl]);

  // === EFECTO PARA FILTRAR Y ORDENAR  ===
  useEffect(() => {
    if (loading) return;

    let filtered = [...allProducts];
    
    // Filtrado por categoría (si no estamos en una página de categoría específica)
    if (selectedCategories.size > 0 && !categorySlugFromUrl) {
        const selectedCategoryNames = new Set(
            categories
                .filter(c => selectedCategories.has(c.value))
                .map(c => c.label)
        );
        if (selectedCategoryNames.size > 0) {
            filtered = filtered.filter(product => selectedCategoryNames.has(product.categoria));
        }
    }
    
    // Filtrado por precio
    if (selectedPriceRanges.size > 0) {
        filtered = filtered.filter(product => {
            const price = product.precio_oferta ? parseFloat(product.precio_oferta) : parseFloat(product.precio_unitario);
            return Array.from(selectedPriceRanges).some(range => {
                const [min, max] = range.split('-').map(Number);
                return price >= min && price <= max;
            });
        });
    }
    
    // Ordenamiento
    filtered.sort((a, b) => {
        const priceA = a.precio_oferta ? parseFloat(a.precio_oferta) : parseFloat(a.precio_unitario);
        const priceB = b.precio_oferta ? parseFloat(b.precio_oferta) : parseFloat(b.precio_unitario);
        switch (sortBy) {
            case 'price-low': return priceA - priceB;
            case 'price-high': return priceB - priceA;
            case 'name-desc': return b.nombre.localeCompare(a.nombre);
            case 'name':
            default: return a.nombre.localeCompare(b.nombre);
        }
    });

    setFilteredProducts(filtered);
    
    setCurrentPage(1); 
  }, [selectedCategories, selectedPriceRanges, sortBy, allProducts, categories, loading, categorySlugFromUrl]);
  
  // === MANEJADORES DE EVENTOS ===
  const handleCategoryChange = (categoryValue) => {
    const newSelectedCategories = new Set(selectedCategories);
    if (newSelectedCategories.has(categoryValue)) {
      newSelectedCategories.delete(categoryValue);
    } else {
      newSelectedCategories.add(categoryValue);
    }
    setSelectedCategories(newSelectedCategories);
    
    if (categorySlugFromUrl && !newSelectedCategories.has(categorySlugFromUrl)) {
        navigate('/productos');
    }
  };

  const handlePriceRangeChange = (rangeValue) => {
    const newSelectedPriceRanges = new Set(selectedPriceRanges);
    if (newSelectedPriceRanges.has(rangeValue)) newSelectedPriceRanges.delete(rangeValue);
    else newSelectedPriceRanges.add(rangeValue);
    setSelectedPriceRanges(newSelectedPriceRanges);
  };

  const clearFilters = () => {
    setSelectedCategories(new Set());
    setSelectedPriceRanges(new Set());
    setSortBy('name');
    if (categorySlugFromUrl) {
        navigate('/productos');
    }
  };

  const hasActiveFilters = selectedPriceRanges.size > 0 || (selectedCategories.size > 0 && (!categorySlugFromUrl || selectedCategories.size > 1));

  // === LÓGICA DE PAGINACIÓN ===
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0); 
    }
  };

  // === COMPONENTES DE RENDERIZADO INTERNOS ===
  const FilterSidebar = ({ isMobile = false }) => (
    <div className="filters-container">
      <div className="filters-header">
        <h5>Filtrar Productos</h5>
        {!isMobile && hasActiveFilters && (
            <Button variant="link" className="clear-filters-btn" onClick={clearFilters}>Limpiar Filtros</Button>
        )}
      </div>
      <div className="filter-section">
        <h4>Categorías</h4>
        <div className="checkbox-group">
          {categories.map((category) => (
            <Form.Check key={category.value} type="checkbox" id={`category-${category.value}-${isMobile}`} label={category.label} checked={selectedCategories.has(category.value)} onChange={() => handleCategoryChange(category.value)} className="filter-checkbox"/>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <h4>Precio</h4>
        <div className="checkbox-group">
          {priceRanges.map((range) => (
            <Form.Check key={range.value} type="checkbox" id={`price-${range.value}-${isMobile}`} label={range.label} checked={selectedPriceRanges.has(range.value)} onChange={() => handlePriceRangeChange(range.value)} className="filter-checkbox"/>
          ))}
        </div>
      </div>
    </div>
  );

  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item key={number} active={number === currentPage} onClick={() => paginate(number)}>
          {number}
        </Pagination.Item>,
      );
    }

    return (
      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
          {items}
          <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando productos...</p>
        </div>
      );
    }
    if (error) {
      return <Alert variant="danger" className="text-center">{error}</Alert>;
    }
    
    if (currentProducts.length === 0) {
        const categoryName = categories.find(c => c.value === categorySlugFromUrl)?.label || 'la vista actual';
        return (
            <div className="no-products">
                <div className="no-products-content">
                    <h4>No se encontraron productos</h4>
                    <p>
                        {hasActiveFilters 
                            ? "Prueba ajustando o limpiando los filtros para encontrar lo que buscas." 
                            : `Actualmente no hay productos disponibles en ${categorySlugFromUrl ? `la categoría "${categoryName}"` : 'nuestro catálogo'}.`
                        }
                    </p>
                    {hasActiveFilters || categorySlugFromUrl ? (
                         <Button variant="primary" className="btn-mustard" onClick={clearFilters}>
                            {categorySlugFromUrl ? 'Ver todos los productos' : 'Limpiar Filtros'}
                        </Button>
                    ) : null}
                </div>
            </div>
        );
    }

    return (
      <Row className="products-grid">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Row>
    );
  };

  // === JSX PRINCIPAL DEL COMPONENTE ===
  return (
    <div className="products-page">
      <Container className="py-4">
        
        <div className="products-header">
          <h1 className="products-main-title">Nuestros Productos</h1>
          {!loading && !error && (
            <p className="products-count">
              Mostrando {currentProducts.length} de {filteredProducts.length} producto{filteredProducts.length !== 1 && 's'}
            </p>
          )}
        </div>

        <Row>
          <Col lg={3} className="d-none d-lg-block">
            <div className="filters-sidebar">
              <FilterSidebar />
            </div>
          </Col>
          
          <Col lg={9}>
            <div className="toolbar d-none d-lg-flex">
              <div className="toolbar-left"></div>
              <div className="toolbar-right">
                <div className="sort-controls">
                  <Form.Label className="me-2 mb-0">Ordenar por:</Form.Label>
                  <CustomSortDropdown options={sortOptions} value={sortBy} onChange={setSortBy} />
                </div>
              </div>
            </div>
            
            <div className="mobile-toolbar d-lg-none">
              <Button variant="outline-secondary" className="mobile-filter-btn" onClick={() => setShowFilters(true)}>
                <FaFilter className="me-1" />
                Filtros
                {hasActiveFilters && <Badge pill bg="danger" className="ms-1 filter-badge-count">{selectedPriceRanges.size + (selectedCategories.size - (categorySlugFromUrl ? 1 : 0))}</Badge>}
              </Button>
              <div className="sort-controls">
                <Form.Label className="me-2 mb-0 ">Ordenar por:</Form.Label>
                <CustomSortDropdown options={sortOptions} value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {renderContent()}

            <PaginationComponent />

          </Col>
        </Row>
      </Container>
      
      <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="start" className="mobile-filters-offcanvas">
        <Offcanvas.Header closeButton>
             <Offcanvas.Title>Filtros</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FilterSidebar isMobile={true} />
          <div className="mobile-filter-actions">
            <Button className="w-100 mb-2 btn-mustard" onClick={() => setShowFilters(false)}>Aplicar Filtros</Button>
            <Button variant="outline-secondary" className="w-100 btn-mustard-outline" onClick={clearFilters}>Limpiar Filtros</Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default Products;
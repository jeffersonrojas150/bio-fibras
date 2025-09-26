import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Form, InputGroup, Button } from 'react-bootstrap';

import logo from '../../../assets/logo.png'; 
import './Header.css';

// Paso 1: Importar el nuevo componente del carrito
import { CartIcon } from '../../Cart/Cart';

import { productsData } from '../../../mocks/productsData';

const Header = () => {
  // Hook de React Router para obtener la URL actual
  const location = useLocation();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const searchInputRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const announcements = [
    { icon: <i className="bi bi-truck"></i>, text: "Envíos a todo el Perú" },
    { icon: <i className="bi bi-leaf"></i>, text: "🌱 100% Productos Ecológicos y Sostenibles" },
    { icon: <i className="bi bi-telephone"></i>, text: "Atención 24/7 - WhatsApp: +51 999 888 777" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  useEffect(() => {
    if (isSearchVisible) {
      searchInputRef.current?.focus();
    }
  }, [isSearchVisible]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('body-menu-open');
    } else {
      document.body.classList.remove('body-menu-open');
    }
    return () => {
      document.body.classList.remove('body-menu-open');
    };
  }, [isMenuOpen]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.trim().length > 1) {
      const filtered = productsData.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.category.toLowerCase().includes(value.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(value.toLowerCase()))
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/productos?search=${encodeURIComponent(searchTerm)}`;
      closeSearch();
    }
  };
  
  const closeSearch = () => {
    setIsSearchVisible(false);
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleProductClick = (product) => {
    window.location.href = `/productos/${product.id}`;
    closeSearch();
  };
  
  const isNavLinkActive = (path) => {
    if (path === '/') {
        return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="top-announcement-carousel">
        <div className="carousel-track">
          {announcements.map((announcement, index) => (
            <div
              key={index}
              className={`announcement-slide ${index === currentAnnouncementIndex ? 'active' : ''}`}
            >
              <span className="announcement-icon">{announcement.icon}</span>
              {announcement.text}
            </div>
          ))}
        </div>
      </div>

      <Navbar 
        bg="white" 
        expand="lg" 
        className={`main-navbar shadow-sm ${isSearchVisible ? 'search-active' : ''}`} 
        sticky="top"
        onToggle={(expanded) => setIsMenuOpen(expanded)}
        expanded={isMenuOpen}
      >
        <Container>
          <Navbar.Brand href="/" className="brand-container">
            <img src={logo} height="45" className="logo-image" alt="Biofibra logo" />
            <span className="brand-name">BIOFIBRAS</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav" className="d-none d-lg-flex">
            <Nav className="center-nav mx-auto">
              <Nav.Link href="/" className={`nav-link-custom ${isNavLinkActive('/') ? 'active' : ''}`}>INICIO</Nav.Link>
              <Nav.Link href="/productos" className={`nav-link-custom ${isNavLinkActive('/productos') ? 'active' : ''}`}>PRODUCTOS</Nav.Link>
              <Nav.Link href="/categorias" className={`nav-link-custom ${isNavLinkActive('/categorias') ? 'active' : ''}`}>CATEGORIAS</Nav.Link>
              <Nav.Link href="/nosotros" className={`nav-link-custom ${isNavLinkActive('/nosotros') ? 'active' : ''}`}>SOBRE NOSOSTROS</Nav.Link>
              <Nav.Link href="/contacto" className={`nav-link-custom ${isNavLinkActive('/contacto') ? 'active' : ''}`}>CONTACTO</Nav.Link>
            </Nav>

            <Nav className="right-nav ms-lg-auto">
              <button type="button" className="nav-icon-link btn-reset" onClick={() => setIsSearchVisible(true)}>
                <i className="bi bi-search nav-icon"></i>
              </button>
              <Nav.Link href="/login" className="nav-icon-link">
                <i className="bi bi-person-circle nav-icon"></i>
              </Nav.Link>
              <Nav.Link href="#favoritos" className="nav-icon-link">
                <i className="bi bi-heart nav-icon"></i>
              </Nav.Link>
              
              {/* Paso 2: Usar el componente CartIcon aquí */}
              <CartIcon />
              
            </Nav>
          </Navbar.Collapse>
        </Container>
        
        <div className={`enhanced-search-overlay ${isSearchVisible ? 'active' : ''}`}>
          <Container className="h-100">
            <div className="d-flex align-items-center justify-content-center h-100">
                <Form onSubmit={handleSearchSubmit} className="w-100" style={{ maxWidth: '700px', position: 'relative' }}>
                    <InputGroup className="enhanced-search-group">
                        <Form.Control
                            ref={searchInputRef}
                            type="search"
                            placeholder="Buscar lámparas, espejos, tapetes..."
                            className="enhanced-search-input"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        <Button type="submit" className="enhanced-search-btn">
                            <i className="bi bi-search"></i>
                        </Button>
                    </InputGroup>
                    {searchResults.length > 0 && (
                        <div className="search-results-dropdown">
                           {searchResults.map(product => (
                               <div key={product.id} className="result-item" onClick={() => handleProductClick(product)}>
                                   <img src={product.image} alt={product.name} className="result-image" />
                                   <div className="result-info">
                                       <span className="result-name">{product.name}</span>
                                       <span className="result-category">{product.category}</span>
                                   </div>
                               </div>
                           ))}
                        </div>
                    )}
                </Form>
                 <Button variant="link" className="close-search-btn" onClick={closeSearch}>
                    <i className="bi bi-x-lg"></i>
                </Button>
            </div>
          </Container>
        </div>
      </Navbar>

      {/* Overlay y Panel del Menú Móvil */}
      <div 
        className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} 
        onClick={() => setIsMenuOpen(false)} 
      />
      <div className={`mobile-menu-panel ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
            <div className="brand-container">
                <img src={logo} height="35" className="logo-image" alt="Biofibra logo" />
                <span className="brand-name">BIOFIBRAS</span>
            </div>
            <Button variant="link" className="mobile-close-btn" onClick={() => setIsMenuOpen(false)}>
                <i className="bi bi-x-lg"></i>
            </Button>
        </div>
        
        <div className="mobile-menu-auth">
            <Button variant="dark" className="auth-btn">Iniciar Sesión</Button>
            <Button variant="outline-dark" className="auth-btn">Registrarse</Button>
        </div>

        <Nav className="flex-column mobile-menu-nav">
          <Nav.Link href="/"><i className="bi bi-house-door-fill"></i> Inicio</Nav.Link>
          <Nav.Link href="/productos"><i className="bi bi-basket-fill"></i> Productos</Nav.Link>
          <Nav.Link href="/categorias"><i className="bi bi-grid-fill"></i> Categorías</Nav.Link>
          <Nav.Link href="#nosotros"><i className="bi bi-people-fill"></i> Sobre Nosotros</Nav.Link>
          <Nav.Link href="#contacto"><i className="bi bi-envelope-fill"></i> Contacto</Nav.Link>
        </Nav>

        <div className="mobile-menu-footer">
          <p>Síguenos en redes</p>
          <div className="social-icons">
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href="#"><i className="bi bi-instagram"></i></a>
            <a href="#"><i className="bi bi-tiktok"></i></a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
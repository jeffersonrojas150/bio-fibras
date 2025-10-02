import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom'; 
import { Navbar, Nav, Container, Form, InputGroup, Button } from 'react-bootstrap';

import logo from '../../../assets/logo.png'; 
import './Header.css';

import { CartIcon } from '../../Cart/Cart';
import { productsData } from '../../../mocks/productsData';
import UserMenu from '../UserMenu/UserMenu'; // 👈 Importar UserMenu
import { useAuth } from '../../../context/authContext'; // 👈 Importar useAuth

const Header = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth(); // 👈 Obtener estado de autenticación
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

  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="header-sticky-container">
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
          onToggle={(expanded) => setIsMenuOpen(expanded)}
          expanded={isMenuOpen}
        >
          <Container>
            <Navbar.Brand as={Link} to="/" className="brand-container">
              <img src={logo} height="45" className="logo-image" alt="Biofibra logo" />
              <span className="brand-name">BIOFIBRAS</span>
            </Navbar.Brand>
            
            <div className="d-flex align-items-center ms-auto order-lg-3">
              <Nav className="right-nav flex-row">
                <button type="button" className="nav-icon-link btn-reset" onClick={() => setIsSearchVisible(true)}>
                  <i className="bi bi-search nav-icon"></i>
                </button>
                
                {/* 👇 Reemplazar el Nav.Link con UserMenu */}
                <UserMenu />
                
                <Nav.Link as={Link} to="#favoritos" className="nav-icon-link">
                  <i className="bi bi-heart nav-icon"></i>
                </Nav.Link>
                <CartIcon />
              </Nav>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" className="ms-2 border-0" />
            </div>

            <Navbar.Collapse id="responsive-navbar-nav" className="order-lg-2">
              <Nav className="center-nav mx-auto">
                <Nav.Link as={Link} to="/" className={`nav-link-custom ${isNavLinkActive('/') ? 'active' : ''}`}>INICIO</Nav.Link>
                <Nav.Link as={Link} to="/productos" className={`nav-link-custom ${isNavLinkActive('/productos') ? 'active' : ''}`}>PRODUCTOS</Nav.Link>
                <Nav.Link as={Link} to="/categorias" className={`nav-link-custom ${isNavLinkActive('/categorias') ? 'active' : ''}`}>CATEGORIAS</Nav.Link>
                <Nav.Link as={Link} to="/nosotros" className={`nav-link-custom ${isNavLinkActive('/nosotros') ? 'active' : ''}`}>SOBRE NOSOSTROS</Nav.Link>
                <Nav.Link as={Link} to="/contacto" className={`nav-link-custom ${isNavLinkActive('/contacto') ? 'active' : ''}`}>CONTACTO</Nav.Link>
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
      </header>

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
        
        {/* 👇 Mostrar botones de autenticación solo si NO está autenticado */}
        {!isAuthenticated ? (
          <div className="mobile-menu-auth">
              <Button as={Link} to="/login" variant="dark" className="auth-btn" onClick={handleMobileLinkClick}>Iniciar Sesión</Button>
              <Button as={Link} to="/registro" variant="outline-dark" className="auth-btn" onClick={handleMobileLinkClick}>Registrarse</Button>
          </div>
        ) : (
          <div className="mobile-menu-user-info">
              <div className="mobile-user-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <p className="mobile-user-greeting">¡Bienvenido a Biofibras!</p>
          </div>
        )}

        <Nav className="flex-column mobile-menu-nav">
          <Nav.Link as={Link} to="/" onClick={handleMobileLinkClick}><i className="bi bi-house-door-fill"></i> Inicio</Nav.Link>
          <Nav.Link as={Link} to="/productos" onClick={handleMobileLinkClick}><i className="bi bi-basket-fill"></i> Productos</Nav.Link>
          <Nav.Link as={Link} to="/categorias" onClick={handleMobileLinkClick}><i className="bi bi-grid-fill"></i> Categorías</Nav.Link>
          
          {/* 👇 Mostrar "Mis Órdenes" solo si está autenticado */}
          {isAuthenticated && (
            <Nav.Link as={Link} to="/mis-ordenes" onClick={handleMobileLinkClick}><i className="bi bi-box-seam-fill"></i> Mis Órdenes</Nav.Link>
          )}
          
          <Nav.Link as={Link} to="/nosotros" onClick={handleMobileLinkClick}><i className="bi bi-people-fill"></i> Sobre Nosotros</Nav.Link>
          <Nav.Link as={Link} to="/contacto" onClick={handleMobileLinkClick}><i className="bi bi-envelope-fill"></i> Contacto</Nav.Link>
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
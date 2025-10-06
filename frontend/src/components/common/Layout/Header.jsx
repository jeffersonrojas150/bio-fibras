import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, InputGroup, Button, Spinner } from 'react-bootstrap';

import logo from '../../../assets/logo.png';
import './Header.css';

import { CartIcon } from '../../Cart/Cart';
import apiClient from '../../../api';
import UserMenu from '../UserMenu/UserMenu';
import { useAuth } from '../../../context/authContext';
import { FavoritesIcon } from '../FavoritesIcon/FavoritesIcon';

const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Estados del componente
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  const searchInputRef = useRef(null);

  // Datos para los anuncios
  const announcements = [
    { icon: <i className="bi bi-truck"></i>, text: "Envíos a todo el Perú" },
    { icon: <i className="bi bi-leaf"></i>, text: "🌱 100% Productos Ecológicos y Sostenibles" },
    { icon: <i className="bi bi-telephone"></i>, text: "Atención 24/7 - WhatsApp: +51 910 881 837" },
  ];

  // Efecto para el carrusel de anuncios
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  // Efecto para poner el foco en el input de búsqueda cuando se abre
  useEffect(() => {
    if (isSearchVisible) {
      searchInputRef.current?.focus();
    }
  }, [isSearchVisible]);

  // Efecto para controlar el scroll del body cuando el menú móvil está abierto
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



  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await apiClient.get(`/productos/?search=${searchTerm}`);
        setSearchResults(response.data.results || []);
      } catch (error) {
        console.error("Error en la búsqueda:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchTerm)}`);
      closeSearch();
    }
  };

  const closeSearch = () => {
    setIsSearchVisible(false);
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleProductClick = (product) => {

    navigate(`/producto/${product.slug}`);
    closeSearch();
  };

  // Funciones auxiliares
  const isNavLinkActive = (path) => {
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
  };

  const handleMobileLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
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
                <UserMenu />
                <FavoritesIcon />
                <CartIcon />
              </Nav>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" className="ms-2 border-0" />
            </div>

            <Navbar.Collapse id="responsive-navbar-nav" className="order-lg-2">
              <Nav className="center-nav mx-auto">
                <Nav.Link as={Link} to="/" className={`nav-link-custom ${isNavLinkActive('/') ? 'active' : ''}`}>INICIO</Nav.Link>
                <Nav.Link as={Link} to="/productos" className={`nav-link-custom ${isNavLinkActive('/productos') ? 'active' : ''}`}>PRODUCTOS</Nav.Link>
                <Nav.Link as={Link} to="/categorias" className={`nav-link-custom ${isNavLinkActive('/categorias') ? 'active' : ''}`}>CATEGORIAS</Nav.Link>
                <Nav.Link as={Link} to="/about" className={`nav-link-custom ${isNavLinkActive('/about') ? 'active' : ''}`}>SOBRE NOSOTROS</Nav.Link>
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
                      placeholder="¿Qué producto buscas?"
                      className="enhanced-search-input"
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    <Button type="submit" className="enhanced-search-btn">
                      <i className="bi bi-search"></i>
                    </Button>
                  </InputGroup>


                  {(isSearching || searchResults.length > 0) && (
                    <div className="search-results-dropdown">
                      {isSearching ? (
                        <div className="result-item-loading">
                          <Spinner animation="border" size="sm" /> Buscando...
                        </div>
                      ) : (
                        searchResults.map(product => (
                          <div key={product.id} className="result-item" onClick={() => handleProductClick(product)}>
                            <img src={product.imagen_principal} alt={product.nombre} className="result-image" />
                            <div className="result-info">
                              <span className="result-name">{product.nombre}</span>
                              <span className="result-category">{product.categoria}</span>
                            </div>
                          </div>
                        ))
                      )}
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

        {!isAuthenticated && (
          <div className="mobile-menu-auth">
            <Button as={Link} to="/login" variant="dark" className="auth-btn" onClick={handleMobileLinkClick}>Iniciar Sesión</Button>
            <Button as={Link} to="/registro" variant="outline-dark" className="auth-btn" onClick={handleMobileLinkClick}>Registrarse</Button>
          </div>
        )}

        <Nav className="flex-column mobile-menu-nav">
          <Nav.Link as={Link} to="/" onClick={handleMobileLinkClick}><i className="bi bi-house-door-fill"></i> Inicio</Nav.Link>
          <Nav.Link as={Link} to="/productos" onClick={handleMobileLinkClick}><i className="bi bi-basket-fill"></i> Productos</Nav.Link>
          <Nav.Link as={Link} to="/categorias" onClick={handleMobileLinkClick}><i className="bi bi-grid-fill"></i> Categorías</Nav.Link>

          {isAuthenticated && (
            <>
              <Nav.Link as={Link} to="/perfil" onClick={handleMobileLinkClick}><i className="bi bi-person-fill"></i> Mi Cuenta</Nav.Link>
              <Nav.Link as={Link} to="/mis-ordenes" onClick={handleMobileLinkClick}><i className="bi bi-box-seam-fill"></i> Mis Órdenes</Nav.Link>
            </>
          )}

          <Nav.Link as={Link} to="/about" onClick={handleMobileLinkClick}><i className="bi bi-people-fill"></i> Sobre Nosotros</Nav.Link>
          <Nav.Link as={Link} to="/contacto" onClick={handleMobileLinkClick}><i className="bi bi-envelope-fill"></i> Contacto</Nav.Link>

          {isAuthenticated && (
            <Nav.Link as="button" onClick={handleMobileLogout} className="mobile-logout-btn">
              <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
            </Nav.Link>
          )}
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
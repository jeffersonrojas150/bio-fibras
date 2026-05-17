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
import MobileMenuPanel from './MobileMenuPanel';

const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const searchInputRef = useRef(null);

  const isHomePage = location.pathname === '/';

  const announcements = [
    { icon: <i className="bi bi-truck"></i>, text: "Envíos a todo el Perú" },
    { icon: <i className="bi bi-leaf"></i>, text: "🌱 100% Productos Ecológicos y Sostenibles" },
    { icon: <i className="bi bi-telephone"></i>, text: "Atención 24/7 - WhatsApp: +51 910 881 837" },
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
    return () => document.body.classList.remove('body-menu-open');
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isNavLinkActive = (path) => {
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const transparent = isHomePage && !isScrolled && !isSearchVisible;

  return (
    <>
      <header className={`header-sticky-container ${isHomePage ? 'is-home' : 'is-other'}`}>
        <div className={`top-announcement-carousel ${transparent ? 'carousel-transparent' : ''}`}>
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
          expand="lg"
          className={`main-navbar ${transparent ? 'navbar-transparent' : 'navbar-solid'} ${isSearchVisible ? 'search-active' : ''}`}
          onToggle={(expanded) => setIsMenuOpen(expanded)}
          expanded={isMenuOpen}
        >
          <Container>
            <Navbar.Brand as={Link} to="/" className="brand-container">
              <img src={logo} height="45" className="logo-image" alt="Biofibra logo" />
              <div className="brand-text">
                <span className={`brand-name ${transparent ? 'brand-name--white' : ''}`}>BIOFIBRAS</span>
                <span className={`brand-tagline ${transparent ? 'brand-tagline--white' : ''}`}>Arte con las manos</span>
              </div>
            </Navbar.Brand>

            <div className="d-flex align-items-center ms-auto order-lg-3">
              <Nav className="right-nav flex-row">
                <button type="button" className={`nav-icon-link btn-reset ${transparent ? 'icon--white' : ''}`} onClick={() => setIsSearchVisible(true)}>
                  <i className="bi bi-search nav-icon"></i>
                </button>
                <UserMenu transparent={transparent} />
                <FavoritesIcon transparent={transparent} />
                <CartIcon transparent={transparent} />
              </Nav>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" className={`ms-2 border-0 ${transparent ? 'toggler--white' : ''}`} />
            </div>

            <Navbar.Collapse id="responsive-navbar-nav" className="order-lg-2">
              <Nav className="center-nav mx-auto">
                {[
                  { to: '/', label: 'INICIO' },
                  { to: '/productos', label: 'PRODUCTOS' },
                  { to: '/categorias', label: 'CATEGORIAS' },
                  { to: '/about', label: 'SOBRE NOSOTROS' },
                  { to: '/contacto', label: 'CONTACTO' },
                ].map(({ to, label }) => (
                  <Nav.Link
                    key={to}
                    as={Link}
                    to={to}
                    className={`nav-link-custom ${isNavLinkActive(to) ? 'active' : ''} ${transparent ? 'nav-link--white' : ''}`}
                  >
                    {label}
                  </Nav.Link>
                ))}
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
                      onChange={(e) => setSearchTerm(e.target.value)}
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

      <MobileMenuPanel
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
    </>
  );
};

export default Header;
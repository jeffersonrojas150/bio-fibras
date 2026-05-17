import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';

const MobileMenuPanel = ({ isMenuOpen, setIsMenuOpen, isAuthenticated, logout }) => {
  const navigate = useNavigate();

  const handleMobileLinkClick = () => setIsMenuOpen(false);

  const handleMobileLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <>
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
            <Button as={Link} to="/login" variant="dark" className="auth-btn" onClick={handleMobileLinkClick}>
              Iniciar Sesión
            </Button>
            <Button as={Link} to="/registro" variant="outline-dark" className="auth-btn" onClick={handleMobileLinkClick}>
              Registrarse
            </Button>
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
            <a href="https://www.facebook.com/profile.php?id=100009194640365&mibextid=wwXIfr&mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="https://www.instagram.com/biofibras_artesania?igsh=NTJoZXJheGJidzV0&utm_source=qr" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="https://www.tiktok.com/@biofibras?_t=ZS-90IwoipsWGe&_r=1" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="TikTok">
              <i className="bi bi-tiktok"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenuPanel;
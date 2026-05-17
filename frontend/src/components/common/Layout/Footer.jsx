import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="biofibras-footer">
      <Container>
        <Row className="footer-top gy-5">

          {/* Marca */}
          <Col lg={4} md={12} className="footer-brand-section">
            <div className="footer-logo-area">
              <h5 className="footer-brand-title">BIOFIBRAS</h5>
              <span className="footer-brand-tagline">Arte con las manos</span>
            </div>
            <p className="footer-brand-description">
              Productos artesanales únicos con fibras 100% naturales, elaborados a mano con respeto por la naturaleza y las tradiciones.
            </p>
            <div className="social-media-links">
              <a href="https://www.facebook.com/profile.php?id=100009194640365" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.instagram.com/biofibras_artesania" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.tiktok.com/@biofibras" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="TikTok">
                <i className="bi bi-tiktok"></i>
              </a>
            </div>
          </Col>

          {/* Links */}
          <Col lg={8} md={12}>
            <div className="footer-links-wrapper">

              <div className="footer-column">
                <h6 className="footer-section-title">Navegación</h6>
                <ul className="footer-links-list">
                  <li><Link to="/" className="footer-link">Inicio</Link></li>
                  <li><Link to="/productos" className="footer-link">Productos</Link></li>
                  <li><Link to="/categorias" className="footer-link">Categorías</Link></li>
                  <li><Link to="/about" className="footer-link">Sobre Nosotros</Link></li>
                  <li><Link to="/contacto" className="footer-link">Contacto</Link></li>
                </ul>
              </div>

              <div className="footer-column">
                <h6 className="footer-section-title">Mi Cuenta</h6>
                <ul className="footer-links-list">
                  <li><Link to="/perfil/datos" className="footer-link">Mi Perfil</Link></li>
                  <li><Link to="/mis-ordenes" className="footer-link">Mis Órdenes</Link></li>
                  <li><Link to="/favoritos" className="footer-link">Mis Favoritos</Link></li>
                  <li><Link to="/contacto" className="footer-link footer-link--complaint">
                    <i className="bi bi-journal-text me-1"></i>
                    Libro de Reclamaciones
                  </Link></li>
                </ul>
              </div>

              <div className="footer-column">
                <h6 className="footer-section-title">Contáctanos</h6>
                <ul className="footer-links-list contact-info">
                  <li className="contact-item">
                    <i className="bi bi-geo-alt-fill contact-icon"></i>
                    <span>Piura, Perú</span>
                  </li>
                  <li className="contact-item">
                    <i className="bi bi-envelope-fill contact-icon"></i>
                    <a href="mailto:bio.fibras.j@gmail.com" className="footer-link">bio.fibras.j@gmail.com</a>
                  </li>
                  <li className="contact-item">
                    <i className="bi bi-whatsapp contact-icon"></i>
                    <a href="tel:+51910881837" className="footer-link">+51 910 881 837</a>
                  </li>
                  <li className="contact-item">
                    <i className="bi bi-clock-fill contact-icon"></i>
                    <span>Lun - Sáb: 9:00 am - 9:00 pm</span>
                  </li>
                </ul>
              </div>

            </div>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <Row className="footer-bottom">
          <Col md={6} className="footer-legal-links">
            <Link to="/terminos-y-condiciones" className="footer-legal-link">Términos y Condiciones</Link>
            <span className="footer-legal-separator">·</span>
            <Link to="/politica-de-privacidad" className="footer-legal-link">Política de Privacidad</Link>
          </Col>
          <Col md={6} className="text-md-end text-center">
            <p className="copyright-text">
              © {new Date().getFullYear()} Biofibras. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
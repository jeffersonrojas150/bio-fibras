import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="biofibras-footer">
      <Container>
        <Row className="footer-content">
          {/* Columna 1: Información de la marca */}
          <Col lg={4} md={6} sm={12} className="footer-brand-section">
            <div className="brand-info">
              <h4 className="footer-brand-title">BIOFIBRAS</h4>
              <p className="footer-brand-description">
                Productos artesanales únicos con fibras 100% naturales, 
                elaborados a mano con respeto por la naturaleza y las tradiciones.
              </p>
              
              {/* Redes sociales */}
              <div className="social-media-links">
                <a href="#" className="social-link facebook" aria-label="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="social-link youtube" aria-label="YouTube">
                  <i className="bi bi-youtube"></i>
                </a>
                <a href="#" className="social-link instagram" aria-label="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="social-link whatsapp" aria-label="WhatsApp">
                  <i className="bi bi-whatsapp"></i>
                </a>
                <a href="#" className="social-link tiktok" aria-label="TikTok">
                  <i className="bi bi-tiktok"></i>
                </a>
              </div>
            </div>
          </Col>

          {/* Columna 2: Enlaces Útiles */}
          <Col lg={2} md={6} sm={6} className="footer-links-section">
            <h6 className="footer-section-title">Enlaces Útiles</h6>
            <ul className="footer-links-list">
              <li>
                <Link to="/" className="footer-link">
                  Inicio
                </Link>
              </li>
               <li>
                <Link to="/productos" className="footer-link">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/productos" className="footer-link">
                  Carrito de Compras
                </Link>
              </li>
              <li>
                <Link to="/mis-ordenes" className="footer-link">
                  Mis Órdenes
                </Link>
              </li>
             
            </ul>
          </Col>

          {/* Columna 3: Contacto */}
          <Col lg={3} md={6} sm={6} className="footer-contact-section">
            <h6 className="footer-section-title">Contáctanos</h6>
            <div className="contact-info">
              <div className="contact-item">
                <i className="bi bi-geo-alt-fill contact-icon"></i>
                <span>Piura Perú</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-envelope-fill contact-icon"></i>
                <a href="mailto:info@biofibrasperu.com" className="contact-link">
                  info@biofibrasperu.com
                </a>
              </div>
              <div className="contact-item">
                <i className="bi bi-telephone-fill contact-icon"></i>
                <a href="tel:+51993995253" className="contact-link">
                  +51 993 995 253
                </a>
              </div>
              <div className="contact-item">
                <i className="bi bi-whatsapp contact-icon"></i>
                <a href="https://wa.me/51993995253" className="contact-link" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </div>
            </div>
          </Col>

          {/* Columna 4: Información */}
          <Col lg={3} md={6} sm={12} className="footer-info-section">
            <h6 className="footer-section-title">Información</h6>
            <ul className="footer-links-list">
              <li>
                <Link to="/nosotros" className="footer-link">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-dark">Contacto</Link>
              </li>
              <li>
                <Link to="/terminos" className="footer-link">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/privacidad" className="footer-link">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Línea divisoria */}
        <hr className="footer-divider" />

        {/* Copyright */}
        <Row className="footer-copyright">
          <Col className="text-center">
            <p className="copyright-text">
              © 2025 Biofibras Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
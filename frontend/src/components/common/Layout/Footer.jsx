import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="biofibras-footer">
      <Container>
        <Row className="footer-content gy-5"> 
          
          <Col lg={4} md={12} className="footer-brand-section">
            <h5 className="footer-brand-title">BIOFIBRAS</h5>
            <p className="footer-brand-description">
              Productos artesanales únicos con fibras 100% naturales, elaborados a mano con respeto por la naturaleza y las tradiciones.
            </p>
            <div className="social-media-links">
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
          </Col>

       
          <Col lg={8} md={12}>
            
            <div className="footer-links-wrapper">
              
              {/* Grupo de enlaces 1: Navegación */}
              <div className="footer-column">
                <h6 className="footer-section-title">Enlaces útiles</h6>
                <ul className="footer-links-list">
                  <li><Link to="/" className="footer-link">Inicio</Link></li>
                  <li><Link to="/productos" className="footer-link">Productos</Link></li>
                  <li><Link to="/perfil/datos" className="footer-link">Mi perfil</Link></li>
                  <li><Link to="/mis-ordenes" className="footer-link">Mis Órdenes</Link></li>
                </ul>
              </div>

              {/* Grupo de enlaces 2: Información */}
              <div className="footer-column">
                <h6 className="footer-section-title">Información</h6>
                <ul className="footer-links-list">
                  <li><Link to="/about" className="footer-link">Sobre Nosotros</Link></li>
                  <li><Link to="/contacto" className="footer-link">Contacto</Link></li>
                  <li><Link to="/terminos" className="footer-link">Términos y Condiciones</Link></li>
                  <li><Link to="/privacidad" className="footer-link">Política de Privacidad</Link></li>
                </ul>
              </div>

              {/* Grupo de enlaces 3: Contacto  */}
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
                    <i className="bi bi-telephone-fill contact-icon"></i>
                    <a href="tel:+51910881837" className="footer-link">+51 910 881 837</a>
                  </li>
                </ul>
              </div>

            </div>
          </Col>
        </Row>

        <hr className="footer-divider" />

        <Row className="footer-copyright">
          <Col className="text-center">
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
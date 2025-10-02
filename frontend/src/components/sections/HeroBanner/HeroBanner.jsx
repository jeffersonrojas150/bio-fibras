import { Container, Row, Col, Button } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <section className="hero-banner">
      {/* Imagen de fondo */}
      <div className="hero-background"></div>
      <div className="hero-overlay"></div>
      
      <Container className="hero-content">
        <Row className="align-items-center justify-content-start">
          <Col lg={7} md={8} sm={10}>
            <div className="hero-text-content">
              <h1 className="hero-title">
                Arte natural, hecho
                <br />
                <span className="hero-title-accent">a mano</span>
              </h1>
              
              <p className="hero-description">
                Descubre piezas únicas elaboradas con fibras 100% 
                vegetales
              </p>
              
              
              <div className="hero-buttons">
                <Button 
                  as={Link} 
                  to="/productos" 
                  variant="outline-light" 
                  className="btn-outline-custom"
                >
                  Ver productos
                </Button>
                <Button 
                  as={Link} 
                  to="/categorias" 
                  variant="outline-light" 
                  className="btn-outline-custom"
                >
                  Ver categorías
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroBanner;
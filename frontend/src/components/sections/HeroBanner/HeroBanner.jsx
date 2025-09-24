import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
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
                <Button variant="outline-light" className="btn-outline-custom">
                  Ver productos
                </Button>
                <Button variant="outline-light" className="btn-outline-custom">
                  Ver categorías
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      
      {/* Sección inferior con enlace a productos 
      <div className="hero-bottom">
        <Container>
          <Row>
            <Col className="text-center">
              <a href="#productos" className="featured-link">
                <span>Nuestros productos más vendidos</span>
                <FaArrowRight className="arrow-icon" />
              </a>
            </Col>
          </Row>
        </Container>
      </div>*/}
    </section>
  );
};

export default HeroBanner;
// src/components/common/Layout/HeroBanner.jsx

import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HeroBanner.css';


import localImage from '../../../assets/herobiofibra.jpg'; 
import localImage2 from '../../../assets/herobanner2.jpg';

const HeroBanner = () => {
  
  const carouselImages = [
    {
      id: 1,
      src: localImage,
      alt: 'Artesanías de biofibras en un jardín'
    },
    {
      id: 2,
      src: localImage2,
      alt: 'Detalle de un producto artesanal'
    }
  ];
  return (
    <section className="hero-banner">
      
      <Carousel 
        fade 
        controls={false} 
        indicators={false} 
        interval={3000} 
        pause={false}
      >
        {carouselImages.map((image) => (
          <Carousel.Item key={image.id}>
            <img
              className="d-block w-100 hero-carousel-image"
              src={image.src}
              alt={image.alt}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      
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
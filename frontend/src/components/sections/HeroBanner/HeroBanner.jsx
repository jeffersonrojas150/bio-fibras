// src/components/common/Layout/HeroBanner.jsx

import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './HeroBanner.css';


import localImage from '../../../assets/herobiofibra.jpg'; 

const HeroBanner = () => {
  
  const carouselImages = [
    {
      id: 1,
      src: localImage,
      alt: 'Artesanías de biofibras en un jardín'
    },
    {
      id: 2,
      src: 'https://scontent.flim28-1.fna.fbcdn.net/v/t39.30808-6/544891723_4045894202393695_2790372615599446348_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEpk_NdbNmRy16FKIm_Y3pQn3nNYjelKQGfec1iN6UpAdnFfzwNUTZ4uR4CFUp7nr9x8us3RRpdEEazeWGIvGYe&_nc_ohc=musgR2JThSUQ7kNvwEsUFe8&_nc_oc=AdmTxo3e2DkajjTNIiFVTjReqljSY_VZwyvJT4dOWz4EkxtrUmQXHA8aOT4axbrsBPk&_nc_zt=23&_nc_ht=scontent.flim28-1.fna&_nc_gid=xzjD9LSzTuVa0YM2ijEwSA&oh=00_Afe6GSg9Hl_TgRYtOaUNzuYaft_dBygafbXakWd2naoX8A&oe=68EDA3F4',
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
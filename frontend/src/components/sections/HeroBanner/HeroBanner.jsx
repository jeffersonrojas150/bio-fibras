import React from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

import localImage from '../../../assets/herobiofibra.jpg'; 
import localImage3 from '../../../assets/herobanner3.jpg';
import localImage4 from '../../../assets/herobanner4.jpg';

const PrevIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const NextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isTyping, setIsTyping] = React.useState(true);
  
  const carouselImages = [
    {
      id: 1,
      src: localImage4,
      alt: 'Artesanías de biofibras',
      category: 'ARTESANÍAS',
      title: 'Arte natural, hecho',
      accent: 'a mano',
      description: 'Descubre piezas únicas elaboradas con fibras 100% vegetales'
    },
    {
      id: 2,
      src: localImage,
      alt: 'Productos ecológicos',
      category: 'SOSTENIBLE',
      title: 'Diseño consciente,',
      accent: 'impacto positivo',
      description: 'Cada pieza cuenta una historia de respeto por la naturaleza'
    },
    {
      id: 3,
      src: localImage3,
      alt: 'Decoración natural',
      category: 'DECORACIÓN',
      title: 'Transforma tu espacio',
      accent: 'naturalmente',
      description: 'Lleva la belleza de lo artesanal a tu hogar'
    }
  ];

  const categories = [
    { name: 'BIOFIBRAS', path: '/' },
    { name: 'BIOFIBRAS', path: '/' },
    { name: 'BIOFIBRAS', path: '/' },
    { name: 'BIOFIBRAS', path: '/' },
    { name: 'BIOFIBRAS', path: '/' },
    { name: 'BIOFIBRAS', path: '/' }
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Reiniciar animación de escritura cuando cambia el slide
  React.useEffect(() => {
    setIsTyping(false);
    const timer = setTimeout(() => setIsTyping(true), 50);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <>
      <section className="hero-banner">
        {/* Carousel de imágenes */}
        <div className="carousel-container1">
          {carouselImages.map((image, index) => (
            <div
              key={image.id}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image.src})` }}
            />
          ))}
        </div>

        {/* Overlay gradiente */}
        <div className="hero-overlay"></div>

        {/* Botones de navegación */}
       <button className="carousel-nav prev" onClick={prevSlide} aria-label="Anterior">
          <PrevIcon />
        </button>
        <button className="carousel-nav next" onClick={nextSlide} aria-label="Siguiente">
          <NextIcon />
        </button>

        {/* Contenido del hero */}
        <div className="hero-content-wrapper">
          <div className="hero-text-content">
            <span className="hero-category">{carouselImages[currentSlide].category}</span>
            <h1 className={`hero-title ${isTyping ? 'typing-animation' : ''}`}>
              {carouselImages[currentSlide].title}
              <span className="hero-title-accent"> {carouselImages[currentSlide].accent}</span>
            </h1>
            
            <p className={`hero-description ${isTyping ? 'typing-animation-delay' : ''}`}>
              {carouselImages[currentSlide].description}
            </p>
            
            <div className="hero-buttons">
              <Link to="/productos" className="btn-hero-primary">
                Ver productos
              </Link>
              <Link to="/categorias" className="btn-hero-secondary">
                Ver categorías
              </Link>
            </div>
          </div>
        </div>

        {/* Indicadores del carousel */}
        <div className="carousel-indicators">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Barra de categorías */}
      <section className="categories-bar1">
        <div className="categories-container1">
          {categories.map((category, index) => (
            <Link 
              key={index}
              to={category.path} 
              className="category-item1"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default HeroBanner;
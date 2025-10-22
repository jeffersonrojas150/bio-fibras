import React from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

// 1. Importa tus imágenes locales aquí
import localImage from '../../../assets/herobiofibra.jpg'; 
import localImage3 from '../../../assets/herobanner3.jpg';
import localImage4 from '../../../assets/herobanner4.jpg';

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
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
          ‹
        </button>
        <button className="carousel-nav next" onClick={nextSlide} aria-label="Siguiente">
          ›
        </button>

        {/* Contenido del hero */}
        <div className="hero-content-wrapper">
          <div className="hero-text-content">
            <span className="hero-category">{carouselImages[currentSlide].category}</span>
            <h1 className="hero-title">
              {carouselImages[currentSlide].title}
              <span className="hero-title-accent"> {carouselImages[currentSlide].accent}</span>
            </h1>
            
            <p className="hero-description">
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

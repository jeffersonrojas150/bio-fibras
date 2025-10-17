import React from 'react';
import { Link } from 'react-router-dom';
import './HeroBanner.css';

// 1. Importa tus imágenes locales aquí
import localImage from '../../../assets/herobiofibra.jpg'; 
//import localImage2 from '../../../assets/herobanner2.jpg';
//import localImage3 from '../../../assets/herobanner3.jpg'; 

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  const carouselImages = [
    {
      id: 1,
      src: 'https://scontent.flim28-1.fna.fbcdn.net/v/t39.30808-6/516433285_3988554351461014_7467849132525422307_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeG2km5nyBV5VPqpodBIrv81HkKDP_pXOTkeQoM_-lc5OXWPt5mZUCkxAVpBdQRWE2LUmOH34C4-8rPeMz0JuEk_&_nc_ohc=QdLSVGzWpHIQ7kNvwGK6viH&_nc_oc=AdkSzfPQiwL0GboXOTlhsEL6GPR2V-MRA20AoxyI6a85MVk125SU74Tpc6zI8ErS_Bw&_nc_zt=23&_nc_ht=scontent.flim28-1.fna&_nc_gid=S3f8uz7Bx42AyM8cqXe1LA&oh=00_AfeeE5YfRqnAC_Wo3nJSu4WHKWaFGhQM14D4Rt_n8g0-ig&oe=68F79AAB', 
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
      src: 'https://scontent.flim28-1.fna.fbcdn.net/v/t51.82787-15/536164110_18072813638021521_8787962805984360695_n.jpg?stp=dst-jpegr_tt6&_nc_cat=106&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeF2PHbX7oqD_UZjAXVlYi5LJkCJfzqzT00mQIl_OrNPTV9TU62ENVgMPHCPnr4wcTOH9HHSxhpAXep2aICB-CRo&_nc_ohc=CNWdG5GVIF8Q7kNvwEC4yaj&_nc_oc=AdmkH5j7Vj9pbmZJCa49L73muQIV0JFwZglck8BdO8J44q79URRMqvYcHePm1pgAVjs&_nc_zt=23&se=-1&_nc_ht=scontent.flim28-1.fna&_nc_gid=cHt71y_U3I_sdhBJ7NtYCQ&oh=00_AfdUzj5qmwxD5VvCeRVBXHnO_0WYTxtDjPllAofsTKix5g&oe=68F77987',  
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

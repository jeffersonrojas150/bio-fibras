import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/favoritesContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { FaHeartBroken } from 'react-icons/fa';
import './Favorites.css';

const Favorites = () => {
const { favorites, loading } = useFavorites();

  useEffect(() => {
    const container = document.getElementById('fav-hearts-canvas')
    if (!container) return
    container.innerHTML = ''

    const heartSVG = `<svg viewBox="0 0 24 24" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
      2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 
      14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
      6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
    </svg>`

    const colors = ['#ffffff', '#ffffff', '#b8860b', '#ffffff', '#f5e6cc']

    for (let i = 0; i < 55; i++) {
      const el = document.createElement('div')
      el.className = 'fav-heart-item'
      const size  = [8, 12, 16, 20, 26, 32, 40][Math.floor(Math.random() * 7)]
      const op    = [0.15, 0.25, 0.35, 0.45, 0.6][Math.floor(Math.random() * 5)]
      const dur   = (4 + Math.random() * 6).toFixed(1)
      const delay = -(Math.random() * 9).toFixed(1)
      const rot   = ((Math.random() - 0.5) * 30).toFixed(1)
      const color = colors[Math.floor(Math.random() * colors.length)]
      el.style.cssText = `
        left:${(Math.random() * 100).toFixed(1)}%;
        top:${(Math.random() * 100).toFixed(1)}%;
        width:${size}px; height:${size}px;
        opacity:${op};
        color:${color};
        --dur:${dur}s; --delay:${delay}s; --rot:${rot}deg;
      `
      el.innerHTML = heartSVG
      container.appendChild(el)
    }
  }, [])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="fav-loading">
          <div className="fav-spinner" />
          <p>Cargando tus favoritos...</p>
        </div>
      );
    }

    if (!favorites || favorites.length === 0) {
      return (
        <div className="fav-empty">
          <FaHeartBroken size={52} />
          <h3>Aún no tienes favoritos</h3>
          <p>Explora nuestros productos y guarda los que más te gusten.</p>
          <Link to="/productos" className="fav-empty-btn">Ver Productos</Link>
        </div>
      );
    }

    return (
      <div className="fav-grid">
        {favorites.map(({ producto }) => (
          <div key={producto.id} className="fav-grid-item">
            <ProductCard product={producto} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
    <div className="fav-hero">
      <div className="fav-hero-bg" />
      <div className="fav-hearts" id="fav-hearts-canvas" />
      <div className="fav-hero-content">
        <span className="fav-hero-eyebrow">♥</span>
        <h1 className="fav-hero-title">Favoritos</h1>
        <div className="fav-hero-line" />
      </div>
    </div>

    {/* Raya dorada separadora */}
    <div className="fav-hero-divider" />

    <div className="fav-container">
      {renderContent()}
    </div>
  </>
  );
};

export default Favorites;
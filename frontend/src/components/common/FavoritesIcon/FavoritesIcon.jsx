// src/components/common/FavoritesIcon/FavoritesIcon.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../../../context/favoritesContext';
import { useAuth } from '../../../context/authContext';

export const FavoritesIcon = () => {
  const { favoritesCount } = useFavorites();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault(); // Evita que vaya directo a /favoritos
      navigate('/login'); // Lo mandamos al login
      alert('Debes iniciar sesión para ver tus favoritos'); 
    }
  };

  return (
    <Nav.Link 
      as={Link} 
      to={isAuthenticated ? "/favoritos" : "#"} 
      className="nav-icon-link position-relative"
      onClick={handleClick}
    >
      <i className="bi bi-heart nav-icon"></i>
      {isAuthenticated && favoritesCount > 0 && (
        <span className="badge rounded-pill bg-danger cart-badge">
          {favoritesCount}
        </span>
      )}
    </Nav.Link>
  );
};
export default FavoritesIcon;
// src/pages/Favorites/Favorites.jsx
import React from 'react';
import { Container, Row, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/favoritesContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { FaHeartBroken } from 'react-icons/fa';
import './Favorites.css';

const Favorites = () => {
  const { favorites, loading } = useFavorites();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p>Cargando tus favoritos...</p>
        </div>
      );
    }

    if (!favorites || favorites.length === 0) {
      return (
        <div className="text-center py-5 empty-favorites">
          <FaHeartBroken size={60} className="mb-3" color="#b58a37" />
          <h3>Aún no tienes favoritos</h3>
          <p>Explora nuestros productos y guarda los que más te gusten.</p>
          <Button
            as={Link}
            to="/productos"
            variant="primary"
            style={{ backgroundColor: '#b58a37', borderColor: '#b58a37' }}
          >
            Ver Productos
          </Button>
        </div>
      );
    }

    return (
      <Row>
        {favorites.map(({ producto }) => (
          <ProductCard key={producto.id} product={producto} />
        ))}
      </Row>
    );
  };

  return (
    <Container className="my-5">
      <h1 className="fav-main-title">Tus Favoritos</h1>
      {renderContent()}
    </Container>
  );
};

export default Favorites;

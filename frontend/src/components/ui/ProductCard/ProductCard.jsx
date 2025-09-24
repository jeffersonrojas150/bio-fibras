import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Card className="product-card h-100">
      <div className="product-image-container">
        <Card.Img 
          variant="top" 
          src={product.image} 
          alt={product.name}
          className="product-image"
        />
        <button 
          className="favorite-btn"
          onClick={toggleFavorite}
          aria-label="Agregar a favoritos"
        >
          {isFavorite ? 
            <FaHeart className="heart-icon filled" /> : 
            <FaRegHeart className="heart-icon" />
          }
        </button>
      </div>
      
      <Card.Body className="product-card-body">
        <Card.Title className="product-name">
          {product.name}
        </Card.Title>
        
        <div className="product-price">
          S/ {product.price.toFixed(2)}
        </div>
        
        <Button className="add-to-cart-btn">
          AÑADIR AL CARRITO
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
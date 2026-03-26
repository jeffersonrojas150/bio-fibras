import React from 'react';
import { Col, Card, Button, Badge } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/favoritesContext';
import './ProductCard.css'; 


const ProductPriceDisplay = ({ product }) => {
  const precioMostrado = product.precio_oferta ? parseFloat(product.precio_oferta) : parseFloat(product.precio_unitario);
  const precioOriginal = product.precio_oferta ? parseFloat(product.precio_unitario) : null;

  return (
    <>
      <div className="product-price">
        {precioOriginal && (
          <span className="original-price">S/{precioOriginal.toFixed(2)}</span>
        )}
        <span className="current-price">S/{precioMostrado.toFixed(2)}</span>
      </div>
      {product.precio_mayor && product.cantidad_minima_mayor && (
        <div className="wholesale-price-info">
          A partir de {product.cantidad_minima_mayor} unid. a:  <strong>S/ {parseFloat(product.precio_mayor).toFixed(2)} c/u</strong>
        </div>
      )}
    </>
  );
};

const ProductCard = ({ product }) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  const handleProductClick = (slug) => navigate(`/producto/${slug}`);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };
  
  const discountPercent = product.precio_oferta ? Math.round((1 - parseFloat(product.precio_oferta) / parseFloat(product.precio_unitario)) * 100) : 0;

  // El elemento principal es <Col>. Esto es importante.
  return (
    <Col xs={6} md={4} lg={4} className="mb-4"> 
      <Card className="product-card h-100">
        <div className="product-image-container" onClick={() => handleProductClick(product.slug)}>
          <Card.Img variant="top" src={product.imagen_principal} alt={product.nombre} />
          <div className="product-badges">
            {product.precio_oferta && <Badge bg="warning" text="dark">-{discountPercent}%</Badge>}
          </div>
          <button 
            className={`favorite-btn ${isFavorite(product.id) ? 'favorited' : ''}`} 
            onClick={handleToggleFavorite}
            aria-label={isFavorite(product.id) ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            {isFavorite(product.id) ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title className="product-title">{product.nombre}</Card.Title>
          <ProductPriceDisplay product={product} />
          <Button 
            className="add-to-cart-btn mt-auto" 
            onClick={() => handleProductClick(product.slug)}
          >
            <FaShoppingCart className="me-2" />
            Ver Producto
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductCard;
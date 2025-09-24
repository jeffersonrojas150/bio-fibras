import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from '../../ui/ProductCard/ProductCard';
import './ProductGrid.css';

const ProductGrid = () => {
 
  const products = [
    {
      id: 1,
      name: "Lámpara ovalada grande",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isFavorite: false
    },
    {
      id: 2,
      name: "Lámpara ovalada grande",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isFavorite: true
    },
    {
      id: 3,
      name: "Lámpara ovalada grande",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      isFavorite: false
    }
  ];

  return (
    <section className="product-grid-section">
      <Container>
        <Row>
          <Col>
            <div className="section-header text-center">
              <p className="products-count">{products.length} productos</p>
            </div>
          </Col>
        </Row>
        
        <Row className="justify-content-center">
          {products.map(product => (
            <Col key={product.id} lg={4} md={6} sm={8} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ProductGrid;
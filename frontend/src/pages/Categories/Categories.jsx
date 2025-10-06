import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import './Categories.css';
import { useCategories } from '../../context/categoryContext';


const Categories = () => {

  const { categories, loading, error, fetchCategories } = useCategories();


  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryClick = (slug) => {
    console.log(`Navegando a la categoría con slug: ${slug}`);
    navigate(`/productos/categoria/${slug}`);
  };

  if (loading && categories.length === 0) {
    return (
      <div className="categories-page text-center py-5">
        <Spinner animation="border" variant="primary" />
        <h2>Cargando categorías...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-page py-5">
        <Container>
          <Alert variant="danger">{error}</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="categories-container">
        <header className="categories-header">
          <h1 className="categories-title">Nuestras Categorías</h1>
          <p className="categories-subtitle">Explora nuestra colección de productos artesanales</p>
        </header>

        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category.slug)}
            >
              <div className="category-image-container">
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-image"
                />
                <div className="category-overlay">
                  <span className="category-text">Ver Productos</span>
                </div>
              </div>
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
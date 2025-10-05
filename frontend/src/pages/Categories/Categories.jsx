import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import apiClient from '../../api'; // <-- Asegúrate de que esta ruta sea correcta
import './Categories.css';

const Categories = () => {
  // === PASO 1: DEFINIR ESTADOS ===
  // Estado para almacenar las categorías que vienen de la API
  const [categories, setCategories] = useState([]);
  // Estado para mostrar un indicador de carga mientras se obtienen los datos
  const [loading, setLoading] = useState(true);
  // Estado para manejar cualquier error que ocurra durante la llamada a la API
  const [error, setError] = useState(null);

  // Hook de react-router-dom para manejar la navegación
  const navigate = useNavigate();

  // === PASO 2: OBTENER DATOS DE LA API ===
  useEffect(() => {
    // Definimos una función asíncrona para hacer la llamada a la API
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Hacemos la petición GET al endpoint de categorías
        const response = await apiClient.get('/categorias/');
        
        // La API de Django puede paginar los resultados, por lo que accedemos a `response.data.results`
        // Si no está paginado, `response.data` sería el array. Usamos un fallback por si acaso.
        const apiCategories = response.data.results || response.data;
        
        // Mapeamos los datos de la API al formato que nuestro componente necesita
        const transformedCategories = apiCategories.map(cat => ({
          id: cat.slug, // Usamos el slug como un ID único para la key de React
          name: cat.nombre,
          image: cat.imagen_url, // El serializer ya nos da la URL completa de la imagen
          slug: cat.slug,
        }));

        setCategories(transformedCategories);

      } catch (err) {
        console.error("Error al cargar las categorías:", err);
        setError("No se pudieron cargar las categorías. Por favor, intenta de nuevo más tarde.");
      } finally {
        // Una vez terminada la operación (con éxito o error), dejamos de cargar
        setLoading(false);
      }
    };

    // Llamamos a la función para que se ejecute cuando el componente se monte
    fetchCategories();
  }, []); // El array vacío `[]` asegura que este efecto se ejecute solo una vez

  // === PASO 3: MANEJAR LA NAVEGACIÓN ===
  const handleCategoryClick = (slug) => {
    // Navegamos a la página de productos, pasando el slug de la categoría en la URL
    // Esto requiere que tengas una ruta configurada en App.js para manejar esto
    console.log(`Navegando a la categoría con slug: ${slug}`);
    navigate(`/productos/categoria/${slug}`);
  };

  // === PASO 4: RENDERIZADO CONDICIONAL ===

  // Si está cargando, mostramos un spinner
  if (loading) {
    return (
      <div className="categories-page text-center py-5">
        <Spinner animation="border" variant="primary" />
        <h2 >Cargando categorías...</h2>
      </div>
    );
  }

  // Si hubo un error, mostramos un mensaje de alerta
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
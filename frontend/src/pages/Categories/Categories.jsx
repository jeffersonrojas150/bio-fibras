import React from 'react';
import './Categories.css';

// Mock data para el ejemplo - reemplaza con tu import real
const productsData = [
  {
    id: 1,
    name: 'Lámpara Ovalada Grande',
    price: 120.00,
    originalPrice: 150.00,
    image: 'https://m.media-amazon.com/images/I/51GpE2kVZvL._UF894,1000_QL80_.jpg',
    category: 'lámparas',
    description: 'Lámpara artesanal tejida a mano con fibras naturales de alta calidad',
    isNew: true,
    inStock: true,
    wholesalePrice: {
      minUnits: 6,
      pricePerUnit: 105.00
    }
  },
  {
    id: 2,
    name: 'Lámpara Ovalada Colorida',
    price: 120.00,
    image: 'https://m.media-amazon.com/images/I/51GpE2kVZvL._UF894,1000_QL80_.jpg',
    category: 'lámparas',
    description: 'Lámpara con diseño vibrante en colores naranja y turquesa',
    isNew: false,
    inStock: true,
    wholesalePrice: {
      minUnits: 6,
      pricePerUnit: 105.00
    }
  },
  {
    id: 4,
    name: 'Espejos Rústico Mediano',
    price: 85.00,
    originalPrice: 100.00,
    image: 'https://m.media-amazon.com/images/I/51GpE2kVZvL._UF894,1000_QL80_.jpg',
    category: 'espejos-rústicos',
    description: 'Canasta decorativa para organización del hogar',
    isNew: false,
    inStock: true,
    wholesalePrice: {
      minUnits: 6,
      pricePerUnit: 75.00
    }
  },
  {
    id: 5,
    name: 'Tapete Geométrico',
    price: 65.00,
    image: 'https://m.media-amazon.com/images/I/51GpE2kVZvL._UF894,1000_QL80_.jpg',
    category: 'tapetes',
    description: 'Tapete con diseño geométrico en zigzag',
    isNew: true,
    inStock: true,
    wholesalePrice: {
      minUnits: 10,
      pricePerUnit: 55.00
    }
  },
  {
    id: 6,
    name: 'Lámpara Pequeña',
    price: 95.00,
    image: 'https://m.media-amazon.com/images/I/51GpE2kVZvL._UF894,1000_QL80_.jpg',
    category: 'lámparas',
    description: 'Lámpara compacta perfecta para espacios reducidos',
    isNew: false,
    inStock: true,
    wholesalePrice: {
      minUnits: 6,
      pricePerUnit: 80.00
    }
  },
  {
    id: 7,
    name: 'Cojín Artesanal',
    price: 45.00,
    image: 'https://m.media-amazon.com/images/I/51GpE2kVZvL._UF894,1000_QL80_.jpg',
    category: 'decoración',
    description: 'Cojín tejido a mano con motivos tradicionales',
    isNew: true,
    inStock: true,
    wholesalePrice: {
      minUnits: 12,
      pricePerUnit: 40.00
    }
  },
  {
    id: 8,
    name: 'Espejo Decorativo',
    price: 180.00,
    image: 'https://m.media-amazon.com/images/I/51GpE2kVZvL._UF894,1000_QL80_.jpg',
    category: 'decoración',
    description: 'Espejo con marco de fibra natural',
    isNew: false,
    inStock: true,
    wholesalePrice: {
      minUnits: 4,
      pricePerUnit: 160.00
    }
  }
];

const Categories = () => {
  // Función para obtener categorías únicas
  const getUniqueCategories = () => {
    const categoriesMap = new Map();
    
    productsData.forEach(product => {
      const categoryKey = product.category.toLowerCase();
      if (!categoriesMap.has(categoryKey)) {
        categoriesMap.set(categoryKey, {
          id: categoryKey,
          name: getCategoryDisplayName(product.category),
          image: product.image,
          slug: categoryKey
        });
      }
    });
    
    return Array.from(categoriesMap.values());
  };

  // Función para formatear el nombre de la categoría para mostrar
  const getCategoryDisplayName = (category) => {
    const categoryNames = {
      'lámparas': 'Lámparas',
      'espejos-rústicos': 'Espejos Rústicos',
      'tapetes': 'Tapetes',
      'decoración': 'Decoración'
    };
    return categoryNames[category.toLowerCase()] || category;
  };

  const categories = getUniqueCategories();

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
              onClick={() => {
                // Aquí puedes manejar la navegación
                console.log(`Navegando a categoría: ${category.slug}`);
                // Ejemplo: window.location.href = `/categoria/${category.slug}`;
              }}
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
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft, FaMinus, FaPlus, FaShare, FaWhatsapp, FaFacebook, FaTwitter, FaBox, FaShippingFast, FaUndo } from 'react-icons/fa';

// Paso 1: Importar hooks y cliente de API
import { useCart } from '../../context/cartContext';
import apiClient from '../../api'; // Asegúrate que la ruta a tu cliente API sea correcta
import './ProductDetail.css';

// Componente de Acordeón reutilizable (sin cambios)
const AccordionItem = ({ title, content, isOpen, onToggle, icon }) => (
  <div className="accordion-item">
    <div className="accordion-header" onClick={onToggle}>
      <div className="accordion-title-wrapper">
        {icon}
        <h3 className="accordion-title">{title}</h3>
      </div>
      <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
    </div>
    <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
      <div className="accordion-content-inner">{content}</div>
    </div>
  </div>
);

const ProductDetail = () => {
  // Se usa 'slug' para coincidir con la URL de la API (ej: /productos/nombre-del-producto)
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Estados para manejar el producto, la carga y los errores desde la API
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados existentes para la interacción del usuario
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddedAlert, setShowAddedAlert] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [openAccordion, setOpenAccordion] = useState('description');

  const adminWhatsappNumber = '910881837'; 

  // useEffect reescrito para obtener datos de la API
  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) {
        navigate('/productos');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Llamada a la API para obtener los detalles del producto por su slug
        const response = await apiClient.get(`/productos/${slug}/`);
        const productData = response.data;
        
        // Transformamos los datos de la API al formato que nuestro componente espera
        const formattedProduct = {
          id: productData.id,
          name: productData.nombre,
          description: productData.descripcion,
          price: productData.precio_oferta ? parseFloat(productData.precio_oferta) : parseFloat(productData.precio_unitario),
          originalPrice: productData.precio_oferta ? parseFloat(productData.precio_unitario) : null,
          // Adaptado para precio mayorista
          wholesalePrice: productData.precio_mayor ? {
            pricePerUnit: parseFloat(productData.precio_mayor),
            minUnits: productData.cantidad_minima_mayor || 1
          } : null,
          stock: productData.stock,
          images: productData.imagenes.length > 0 ? productData.imagenes.map(img => img.imagen) : ['/path/to/placeholder.png'], // Usa un placeholder si no hay imágenes
          category: productData.categoria,
        };

        setProduct(formattedProduct);
        
        // Comprobar si es favorito desde localStorage
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(storedFavorites.includes(formattedProduct.id));

        // TODO: Implementar la obtención de productos relacionados desde la API.
        // Se necesitaría un endpoint como `/productos/relacionados/{categoria}/`
        // Por ahora, `relatedProducts` quedará vacío.
        // fetchRelatedProducts(formattedProduct.category, formattedProduct.id);

      } catch (err) {
        console.error("Error al cargar el producto:", err);
        setError("No se pudo encontrar el producto. Puede que haya sido eliminado o la URL sea incorrecta.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug, navigate]);

  const handleAccordionToggle = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(product.stock, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAddedAlert(true);
    setTimeout(() => setShowAddedAlert(false), 3000);
  };

  const toggleFavorite = () => {
    // TODO: En una aplicación real, esto debería ser una llamada a la API
    // para guardar los favoritos del usuario en su cuenta.
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = storedFavorites.filter(favId => favId !== product.id);
    } else {
      newFavorites = [...storedFavorites, product.id];
    }
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `¡No te pierdas este increíble producto! ✨: ${product.name} - S/ ${product.price.toFixed(2)}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      default:
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleWhatsappContact = (message = `Hola, estoy interesado en el producto: "${product?.name}". ¿Podrían darme más información?`) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${adminWhatsappNumber}?text=${encodedMessage}`, '_blank');
  };
  
  // Renderizado condicional para estados de carga y error
  if (loading) {
    return (
      <div className="product-detail-page text-center py-5">
        <Spinner animation="border" variant="primary" />
        <h2 className="mt-3">Cargando producto...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page text-center py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate('/productos')}>
          <FaArrowLeft className="me-2" /> Volver a la tienda
        </Button>
      </div>
    );
  }

  if (!product) {
    // Este caso previene un renderizado vacío si algo sale mal.
    return null;
  }

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const discountPercent = product.originalPrice ? Math.round((savings / product.originalPrice) * 100) : 0;

  return (
    <div className="product-detail-page">
      {showAddedAlert && (
        <Alert variant="success" className="floating-alert animate__animated animate__fadeInDown">
          ¡Producto "{product.name}" añadido al carrito!
        </Alert>
      )}

      <Container className="py-4 product-detail-custom-container">
        <Row className="product-detail-main-row">
          <Col lg={6} className="mb-4">
            <div className="product-gallery">
              <div className="main-image-container">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="main-product-image"
                />
                {product.originalPrice && (
                  <Badge bg="danger" className="discount-badge">
                    -{discountPercent}%
                  </Badge>
                )}
              </div>
              
              {product.images.length > 1 && (
                <div className="image-thumbnails">
                  {product.images.map((image, index) => (
                    <div 
                      key={index}
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img src={image} alt={`${product.name} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          <Col lg={6}>
            <div className="product-info-panel">
              <div className="product-header">
                <h1 className="product-title">{product.name}</h1>
                <Button 
                  variant="link" 
                  className="favorite-btn-detail"
                  onClick={toggleFavorite}
                >
                  {isFavorite ? <FaHeart className="text-warning" /> : <FaRegHeart />}
                </Button>
              </div>

              <div className="product-pricing-section">
                {product.originalPrice && (
                  <span className="original-price-detail">S/ {product.originalPrice.toFixed(2)}</span>
                )}
                <span className="current-price-detail">S/ {product.price.toFixed(2)}</span>
              </div>

              {product.wholesalePrice && (
                <div className="wholesale-box mb-3">
                  <div className="wholesale-header">PRECIO POR MAYOR</div>
                  <div className="wholesale-price-text">
                    S/ {product.wholesalePrice.pricePerUnit.toFixed(2)} 
                    <span className="wholesale-label">c/u</span>
                  </div>
                  <div className="wholesale-min-units">Desde {product.wholesalePrice.minUnits} unidades</div>
                </div>
              )}

              <div className="stock-info mb-4">
                <div className="stock-indicator">
                  <FaBox className="me-2" />
                  <span className="stock-text">
                    {product.stock > 10 ? 'En stock' : 
                     product.stock > 0 ? `Solo quedan ${product.stock} unidades` : 
                     'Sin stock'}
                  </span>
                  <span className={`stock-status ${product.stock > 10 ? 'high' : product.stock > 0 ? 'low' : 'out'}`}>
                    ({product.stock} disponibles)
                  </span>
                </div>
              </div>

              <div className="quantity-section mb-4">
                <label className="quantity-label">Cantidad:</label>
                <div className="quantity-control-group">
                  <Button variant="outline-secondary" size="sm" className="quantity-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <FaMinus />
                  </Button>
                  <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))} className="quantity-input" min="1" max={product.stock}/>
                  <Button variant="outline-secondary" size="sm" className="quantity-btn" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                    <FaPlus />
                  </Button>
                </div>
              </div>

               {product.stock > 0 && (
                <div className="stock-contact-message">
                  <div className="contact-text">¿Necesitas más cantidad o tienes alguna consulta especial?</div>
                  <Button variant="success" size="sm" className="whatsapp-contact-btn" onClick={() => handleWhatsappContact(`Hola, estoy interesado en el producto "${product.name}" y me gustaría consultar sobre disponibilidad de mayor cantidad.`)}>
                    <FaWhatsapp className="me-2" />
                    Contáctanos por WhatsApp
                  </Button>
                </div>
              )}

              <div className="main-actions mb-4">
                <Button className="add-to-cart-btn w-100 mb-3" onClick={handleAddToCart} disabled={product.stock === 0}>
                  <FaShoppingCart className="me-2" />
                  {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                </Button>
                <Button variant="outline-secondary" className="share-btn w-100" onClick={() => setShowShareModal(true)}>
                  <FaShare className="me-2" />
                  Compartir
                </Button>
              </div>

              <div className="payment-methods">
                <div className="section-title">MÉTODOS DE PAGO</div>
                <div className="payment-icons d-flex flex-wrap gap-2">
                  <img src="https://cdn.worldvectorlogo.com/logos/visa-10.svg" alt="Visa" className="payment-logo" />
                  <img src="https://www.coopacsancristobal.pe/wp-content/uploads/2024/11/yape-logo-png_seeklogo-504685.png" alt="Yape" className="payment-logo" />
                </div>
              </div>

              <div className="product-details-accordion">
                <AccordionItem
                  title="Descripción"
                  isOpen={openAccordion === 'description'}
                  onToggle={() => handleAccordionToggle('description')}
                  content={<p className="description-text">{product.description}</p>}
                />
               
                <AccordionItem
                  title="Información de Envío"
                  isOpen={openAccordion === 'shipping'}
                  onToggle={() => handleAccordionToggle('shipping')}
                  content={
                    <div className="shipping-info">
                      <div className="shipping-info-item">
                        <FaShippingFast className="shipping-icon" />
                        <div><strong>Envío Estándar (Lima):</strong> 2-4 días hábiles.</div>
                      </div>
                      <div className="shipping-info-item">
                        <FaBox className="shipping-icon" />
                        <div><strong>Envío a Provincias:</strong> 5-10 días hábiles (vía Olva/Shalom).</div>
                      </div>
                      <div className="shipping-info-item">
                        <FaUndo className="shipping-icon" />
                        <div><strong>Política de Devolución:</strong> Aceptamos devoluciones hasta 7 días después de la entrega por defectos de fábrica.</div>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-end align-items-center mb-4">
          <Button variant="link" className="back-btn" onClick={() => navigate('/productos')}>
            <FaArrowLeft className="me-2" />
            Volver
          </Button>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h3 className="related-title text-center mb-4">Productos Relacionados</h3>
            <Row>
              {relatedProducts.map((relatedProduct) => (
                <Col key={relatedProduct.id} xs={6} md={3} className="mb-4">
                  <div className="related-product-card" onClick={() => navigate(`/producto/${relatedProduct.slug}`)}>
                    <img src={relatedProduct.image} alt={relatedProduct.name} className="img-fluid" />
                    <div className="related-product-info p-2">
                      <h6 className="related-product-name">{relatedProduct.name}</h6>
                      <p className="related-price">S/ {relatedProduct.price.toFixed(2)}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>

      <Modal show={showShareModal} onHide={() => setShowShareModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">Compartir producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="share-buttons d-grid gap-2">
            <Button variant="success" className="share-modal-btn" onClick={() => handleShare('whatsapp')}><FaWhatsapp className="me-2" /> WhatsApp</Button>
            <Button variant="primary" className="share-modal-btn" onClick={() => handleShare('facebook')}><FaFacebook className="me-2" /> Facebook</Button>
            <Button variant="info" className="share-modal-btn" onClick={() => handleShare('twitter')}><FaTwitter className="me-2" /> Twitter</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductDetail;
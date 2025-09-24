import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Badge, Modal, Alert } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft, FaMinus, FaPlus, FaShare, FaWhatsapp, FaFacebook, FaTwitter, FaBox } from 'react-icons/fa';

import { productsData } from '../../mocks/productsData'; 
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddedAlert, setShowAddedAlert] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Número de WhatsApp del administrador
  const adminWhatsappNumber = '931840727'; 

  useEffect(() => {
    // Es importante que el ID de la URL exista para que no muestre "Cargando..."
    if (!id) {
        navigate('/productos'); // Si no hay ID, redirige a la lista de productos
        return;
    }

    const foundProduct = productsData.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct({
        ...foundProduct,
        stock: foundProduct.stock || Math.floor(Math.random() * 20) + 5
      });
      
      if (!foundProduct.images || foundProduct.images.length === 0) {
        foundProduct.images = [
          foundProduct.image,
          foundProduct.image, 
          foundProduct.image
        ];
      }
      
      const related = productsData
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);

      const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(storedFavorites.includes(parseInt(id)));
    } else {
        // Si el producto con ese ID no se encuentra, también redirige
        navigate('/productos');
    }
  }, [id, navigate]);

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(product.stock, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    console.log(`Añadido al carrito: ${product.name}, Cantidad: ${quantity}`);
    setShowAddedAlert(true);
    setTimeout(() => setShowAddedAlert(false), 3000);
  };

  const toggleFavorite = () => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = storedFavorites.filter(favId => favId !== parseInt(id));
    } else {
      newFavorites = [...storedFavorites, parseInt(id)];
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

  if (!product) {
    return (
      <div className="product-detail-page">
        <Container className="py-5 text-center">
          <h2>Cargando producto...</h2>
          <Button variant="primary" onClick={() => navigate('/productos')}>
            Volver a productos
          </Button>
        </Container>
      </div>
    );
  }

  const finalPrice = product.price;
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
        {/* --- CAMBIO REALIZADO AQUÍ --- */}
        {/* Se eliminó el Breadcrumb y se dejó solo el botón "Volver" alineado a la derecha */}
        <div className="d-flex justify-content-end align-items-center mb-4">
          <Button variant="link" className="back-btn" onClick={() => navigate('/productos')}>
            <FaArrowLeft className="me-2" />
            Volver
          </Button>
        </div>

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
                  {isFavorite ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                </Button>
              </div>

              <div className="product-pricing-section">
                {product.originalPrice && (
                  <span className="original-price-detail">S/ {product.originalPrice.toFixed(2)}</span>
                )}
                <span className="current-price-detail">S/ {finalPrice.toFixed(2)}</span>
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
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </Button>
                  <Form.Control 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="quantity-input"
                    min="1"
                    max={product.stock}
                  />
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <FaPlus />
                  </Button>
                </div>
              </div>

               {product.stock > 0 && (
                <div className="stock-contact-message">
                  <div className="contact-text">
                    ¿Necesitas más cantidad o tienes alguna consulta especial?
                  </div>
                  <Button 
                    variant="success" 
                    size="sm" 
                    className="whatsapp-contact-btn"
                    onClick={() => handleWhatsappContact(`Hola, estoy interesado en el producto "${product.name}" y me gustaría consultar sobre disponibilidad de mayor cantidad.`)}
                  >
                    <FaWhatsapp className="me-2" />
                    Contáctanos por WhatsApp
                  </Button>
                </div>
              )}

              <div className="main-actions mb-4">
                <Button 
                  className="add-to-cart-btn w-100 mb-3"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <FaShoppingCart className="me-2" />
                  {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                </Button>
                
                <Button 
                  variant="outline-secondary" 
                  className="share-btn w-100"
                  onClick={() => setShowShareModal(true)}
                >
                  <FaShare className="me-2" />
                  Compartir
                </Button>
              </div>

              <div className="payment-methods">
                <div className="section-title">MÉTODOS DE PAGO</div>
                <div className="payment-icons d-flex flex-wrap gap-2">
                  <img src="https://cdn.worldvectorlogo.com/logos/visa-10.svg" alt="Visa" className="payment-logo" />
                  <img src="https://www.coopacsancristobal.pe/wp-content/uploads/2024/11/yape-logo-png_seeklogo-504685.png" alt="Yape" className="payment-logo" />
                  <img src="https://images.icon-icons.com/2972/PNG/512/whatsapp_logo_icon_186881.png" alt="WhatsApp Pago" className="payment-logo" />
                </div>
              </div>

              <div className="product-description">
                <div className="section-title">DESCRIPCIÓN</div>
                <p className="description-text">{product.description}</p>
                
                <div className="product-features">
                  <div className="features-title">Características:</div>
                  <ul className="features-list">
                    <li>Producto artesanal de alta calidad</li>
                    <li>Material resistente y duradero</li>
                    <li>Diseño único y exclusivo</li>
                    <li>Perfecto para decoración del hogar</li>
                  </ul>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h3 className="related-title text-center mb-4">Productos Relacionados</h3>
            <Row>
              {relatedProducts.map((relatedProduct) => (
                <Col key={relatedProduct.id} xs={6} md={3} className="mb-4">
                  <div 
                    className="related-product-card"
                    onClick={() => navigate(`/producto/${relatedProduct.id}`)}
                  >
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
            <Button variant="success" className="share-modal-btn" onClick={() => handleShare('whatsapp')}>
              <FaWhatsapp className="me-2" />
              WhatsApp
            </Button>
            <Button variant="primary" className="share-modal-btn" onClick={() => handleShare('facebook')}>
              <FaFacebook className="me-2" />
              Facebook
            </Button>
            <Button variant="info" className="share-modal-btn" onClick={() => handleShare('twitter')}>
              <FaTwitter className="me-2" />
              Twitter
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductDetail;
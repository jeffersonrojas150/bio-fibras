import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link} from 'react-router-dom';
import { Container, Row, Col, Button, Form, Badge, Modal, Alert, Spinner } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft, FaMinus, FaPlus, FaShare, FaWhatsapp, FaFacebook, FaInstagram, FaBox, FaShippingFast, FaUndo } from 'react-icons/fa';

import { useCart } from '../../context/cartContext';
import apiClient from '../../api';
import './ProductDetail.css';

import toast from "react-hot-toast";

import { useFavorites } from '../../context/favoritesContext';



const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  // <-- Obtener las funciones del contexto de favoritos
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Estados del producto, carga y error
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de UI
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddedAlert, setShowAddedAlert] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
  

  const adminWhatsappNumber = '51910881837'; 

  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) {
        navigate('/productos');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/productos/${slug}/`);
        const productData = response.data;
        
        const formattedProduct = {
          id: productData.id,
          name: productData.nombre,
          description: productData.descripcion,
          price: productData.precio_oferta ? parseFloat(productData.precio_oferta) : parseFloat(productData.precio_unitario),
          originalPrice: productData.precio_oferta ? parseFloat(productData.precio_unitario) : null,
          wholesalePrice: productData.precio_mayor ? {
            pricePerUnit: parseFloat(productData.precio_mayor),
            minUnits: productData.cantidad_minima_mayor || 1
          } : null,
          stock: productData.stock,
          images: productData.imagenes.length > 0 ? productData.imagenes.map(img => img.imagen) : ['/path/to/placeholder.png'],
          category: productData.categoria,
        };

        setProduct(formattedProduct);

        

      } catch (err) {
        console.error("Error al cargar el producto:", err);
        setError("No se pudo encontrar el producto. Puede que haya sido eliminado o la URL sea incorrecta.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug, navigate]);



  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, Math.min(product.stock, quantity + delta));
    setQuantity(newQuantity);
  };

 const handleAddToCart = () => {
  addToCart(product, quantity);

  toast.success(`🛒 ¡"${product.name}" añadido al carrito!`, {
    style: {
      border: '1px solid #484406ff',
      padding: '10px 16px',
      color: '#000000ff',
      background: '#f4e6c3ff',
      fontWeight: 500,
    },
    iconTheme: {
      primary: '#22c55e',
      secondary: '#ffffff',
    },
  });
};

  // <--  Se reemplaza la función `toggleFavorite` por una que usa el contexto
  const handleToggleFavorite = () => {
    if (!product) return;
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
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
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;

        break;
      case 'instagram':
        navigator.clipboard.writeText(url);
      toast.success('🔗 Enlace copiado. Pégalo en tu historia o bio de Instagram.', {
          style: {
            border: '1px solid #484406ff',
            padding: '10px 16px',
            color: '#000000ff',
            background: '#f4e6c3ff',
            fontWeight: 500,
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#ffffff',
          },
        });
        break;

      default:
        break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  const handleWhatsappContact = (message = `Hola, estoy interesado en el producto: "${product?.name}". ¿Podrían darme más información?`) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${adminWhatsappNumber}?text=${encodedMessage}`, '_blank');
  };
  
  if (loading) {
    return (
      <div className="product-detail-page text-center py-5">
        <Spinner animation="border" variant="success" />
        <h3 className="mt-3">Cargando producto...</h3>
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
    return null;
  }

  const savings = product.originalPrice ? product.originalPrice - product.price : 0;
  const discountPercent = product.originalPrice ? Math.round((savings / product.originalPrice) * 100) : 0;

  return (
    <div className="product-detail-page">
  

      <Container className="py-4 product-detail-custom-container">
        <Row className="product-detail-main-row">
          
              <Col lg={6} className="mb-4">
                <div className="product-gallery">
                  {/* Primero, renderizamos la columna de miniaturas a la izquierda */}
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
                  
                  {/* Luego, la imagen principal que ocupará el espacio restante */}
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
                </div>
              </Col>

          <Col lg={6}>
            <div className="product-info-panel">
              <div className="product-header">
                <h1 className="product-title">{product.name}</h1>
                
                {/* <-- El botón ahora usa la función y el estado del contexto --> */}
                <Button 
                  variant="link" 
                  className="favorite-btn-detail"
                  onClick={handleToggleFavorite}
                >
                  {isFavorite(product.id) ? <FaHeart className="text-warning" /> : <FaRegHeart />}
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

              
                 
                  <div className="quantity-and-stock-section mb-4">
                    
                    <label className="quantity-label">CANTIDAD:</label>

                    {/* Los controles de cantidad */}
                    <div className="quantity-control-group">
                      <Button variant="outline-secondary" size="sm" className="quantity-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                        <FaMinus />
                      </Button>
                      <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))} className="quantity-input" min="1" max={product.stock}/>
                      <Button variant="outline-secondary" size="sm" className="quantity-btn" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                        <FaPlus />
                      </Button>
                    </div>

                    {/* La información de stock, ahora debajo */}
                    {product.stock > 0 && (
                      <div className="stock-info">
                        <span>Tenemos {product.stock} disponible</span>
                      </div>
                    )}
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
               
              
                  <div className="product-tabs-container">
                    {/* Navegación de las pestañas */}
                    <div className="product-tabs-nav">
                      <button 
                        className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
                        onClick={() => setActiveTab('description')}
                      >
                        Descripción
                      </button>
                      <button 
                        className={`tab-button ${activeTab === 'shipping' ? 'active' : ''}`}
                        onClick={() => setActiveTab('shipping')}
                      >
                        Información de Envío
                      </button>
                      <button 
                        className={`tab-button ${activeTab === 'payment' ? 'active' : ''}`}
                        onClick={() => setActiveTab('payment')}
                      >
                        Métodos de Pago
                      </button>
                    </div>

                    {/* Contenido de las pestañas */}
                    <div className="product-tabs-content">
                      {activeTab === 'description' && (
                        <div className="tab-pane">
                          <p className="description-text">{product.description}</p>
                        </div>
                      )}

                      {activeTab === 'shipping' && (
                        <div className="tab-pane">
                          <ul className="shipping-info-list">
                            <li className="shipping-info-item">
                              <FaShippingFast className="shipping-icon" />
                              <div><strong>Lima Metropolitana:</strong> 3 a 5 días hábiles.</div>
                            </li>
                            <li className="shipping-info-item">
                              <FaBox className="shipping-icon" />
                              <div><strong>Envío a Provincias:</strong> 5 a 10 días hábiles (vía Olva, Shalom u otras).</div>
                            </li>
                            <li className="shipping-info-item">
                              <FaUndo className="shipping-icon" />
                            

                              <div className="mt-2 text-sm">
                                <strong>Política de devolución: </strong>
                                <Link to="/terminos-y-condiciones" className="text-primary text-decoration-underline">
                                   Ver política completa en Términos y Condiciones
                                </Link>
                              </div>


                            </li>
                          </ul>
                        </div>
                      )}

                      {activeTab === 'payment' && (
                        <div className="tab-pane">
                          <div className="payment-icons d-flex flex-wrap gap-3 align-items-center">
                            <img src="https://cdn.worldvectorlogo.com/logos/visa-10.svg" alt="Visa" className="payment-logo" />
                            <img src="https://www.coopacsancristobal.pe/wp-content/uploads/2024/11/yape-logo-png_seeklogo-504685.png" alt="Yape" className="payment-logo" />
                          </div>
                        </div>
                      )}
                    </div>
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
            <Button
              style={{ backgroundColor: '#E1306C', borderColor: '#E1306C' }} 
              className="share-modal-btn"
              onClick={() => handleShare('instagram')}
            >
              <FaInstagram className="me-2" /> Instagram
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProductDetail;
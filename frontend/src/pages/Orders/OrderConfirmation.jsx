// src/pages/Orders/OrderConfirmation.jsx
import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Table } from 'react-bootstrap';
import { 
  FaCheckCircle, 
  FaDownload, 
  FaEnvelope, 
  FaTruck, 
  FaHome, 
  FaWhatsapp,
  FaCalendarAlt,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import './Orders.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    // Si no hay orden, redirigir a inicio
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadReceipt = () => {
    // Simular descarga de comprobante
    const receiptData = {
      orderId: order.id,
      date: order.date,
      customer: order.customer,
      items: order.items,
      totals: order.totals
    };
    
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `FioFibras_Pedido_${order.id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleWhatsAppContact = () => {
    const message = `Hola! Tengo una consulta sobre mi pedido #${order.id}`;
    const whatsappUrl = `https://wa.me/51987654321?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="order-confirmation-page">
      <Container>
        {/* Encabezado de confirmación */}
        <div className="confirmation-header text-center mb-5">
          <div className="success-icon mb-4">
            <FaCheckCircle size={80} style={{ color: '#228B22' }} />
          </div>
          
          <h2 className="mb-3" style={{ color: '#2c3e32' }}>
            ¡Pedido Confirmado!
          </h2>
          
          <p className="lead mb-4" style={{ color: '#6c757d' }}>
            Gracias por tu compra. Hemos recibido tu pedido y lo estamos preparando.
          </p>
          
          <div className="order-number mb-4">
            <Alert variant="success" className="d-inline-block">
              <strong>Número de Pedido: #{order.id}</strong>
            </Alert>
          </div>
        </div>

        <Row>
          {/* Información del pedido */}
          <Col lg={8}>
            {/* Resumen del pedido */}
            <Card className="order-details-card mb-4">
              <Card.Header>
                <h5 className="mb-0">Detalles del Pedido</h5>
              </Card.Header>
              <Card.Body>
                <Table responsive className="order-items-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-center">Cantidad</th>
                      <th className="text-end">Precio Unit.</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="item-image me-3">
                              <img 
                                src={item.image || item.images?.[0]} 
                                alt={item.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/50x50/f8f9fa/dee2e6?text=Img';
                                }}
                              />
                            </div>
                            <div>
                              <div className="fw-semibold">{item.name}</div>
                              {item.category && (
                                <small className="text-muted">{item.category}</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">S/ {item.price.toFixed(2)}</td>
                        <td className="text-end fw-semibold">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Subtotal:</strong></td>
                      <td className="text-end"><strong>S/ {order.totals.subtotal.toFixed(2)}</strong></td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="text-end">
                        <strong>Envío:</strong>
                        {order.totals.shipping === 0 && (
                          <small className="text-success ms-2">(Gratis)</small>
                        )}
                      </td>
                      <td className="text-end">
                        <strong>
                          {order.totals.shipping === 0 ? 'Gratis' : `S/ ${order.totals.shipping.toFixed(2)}`}
                        </strong>
                      </td>
                    </tr>
                    <tr className="table-success">
                      <td colSpan="3" className="text-end"><strong>Total Pagado:</strong></td>
                      <td className="text-end"><strong>S/ {order.totals.total.toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </Table>
              </Card.Body>
            </Card>

            {/* Información de envío */}
            <Card className="shipping-info-card mb-4">
              <Card.Header>
                <FaTruck className="me-2" />
                Información de Envío
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="shipping-address">
                      <h6><FaMapMarkerAlt className="me-2" style={{ color: '#d7ad44' }} />Dirección de Entrega</h6>
                      <p className="mb-1">
                        <strong>{order.customer.firstName} {order.customer.lastName}</strong>
                      </p>
                      <p className="mb-1">{order.customer.address}</p>
                      <p className="mb-1">
                        {order.customer.district}, {order.customer.city} {order.customer.zipCode}
                      </p>
                      <p className="mb-0">
                        <strong>Tel:</strong> {order.customer.phone}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="delivery-info">
                      <h6><FaCalendarAlt className="me-2" style={{ color: '#d7ad44' }} />Estimado de Entrega</h6>
                      <p className="mb-2">
                        <strong>{formatDate(order.estimatedDelivery)}</strong>
                      </p>
                      <p className="mb-0 text-muted">
                        Horario: 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </Col>
                </Row>

                {order.customer.orderNotes && (
                  <div className="order-notes mt-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <h6>Notas del Pedido:</h6>
                    <p className="mb-0">{order.customer.orderNotes}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar con acciones */}
          <Col lg={4}>
            {/* Estado del pedido */}
            <Card className="order-status-card mb-4">
              <Card.Body>
                <div className="status-indicator">
                  <div className="status-icon mb-3">
                    <FaCheckCircle size={40} style={{ color: '#228B22' }} />
                  </div>
                  <h6 className="status-text">Pedido Confirmado</h6>
                  <p className="status-description">
                    Tu pedido ha sido recibido y está siendo preparado para el envío.
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Acciones rápidas */}
            <Card className="quick-actions-card mb-4">
              <Card.Header>
                <h6 className="mb-0">Acciones</h6>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button 
                    variant="outline-primary"
                    onClick={handleDownloadReceipt}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <FaDownload className="me-2" />
                    Descargar Comprobante
                  </Button>
                  
                  <Button 
                    variant="outline-success"
                    onClick={handleWhatsAppContact}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <FaWhatsapp className="me-2" />
                    Contactar por WhatsApp
                  </Button>
                  
                  <Button 
                    variant="primary"
                    onClick={() => navigate('/productos')}
                    className="btn-fiofibras d-flex align-items-center justify-content-center"
                  >
                    <FaHome className="me-2" />
                    Seguir Comprando
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Información de contacto */}
            <Card className="contact-info-card">
              <Card.Body>
                <h6 className="mb-3">¿Necesitas Ayuda?</h6>
                <div className="contact-methods">
                  <div className="contact-method">
                    <FaEnvelope className="me-2" style={{ color: '#d7ad44' }} />
                    <span>pedidos@fiofibras.com</span>
                  </div>
                  <div className="contact-method">
                    <FaWhatsapp className="me-2" style={{ color: '#25D366' }} />
                    <span>+51 987 654 321</span>
                  </div>
                </div>
                <p className="mt-3 mb-0">
                  <small className="text-muted">
                    Horario de atención: Lunes a Viernes 9:00 AM - 6:00 PM
                  </small>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Confirmación por email */}
        <Alert variant="info" className="email-confirmation mt-4">
          <FaEnvelope className="me-2" />
          <strong>Confirmación enviada:</strong> Hemos enviado los detalles de tu pedido a 
          <strong> {order.customer.email}</strong>. Si no lo encuentras, revisa tu carpeta de spam.
        </Alert>
      </Container>
    </div>
  );
};

export default OrderConfirmation;
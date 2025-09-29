import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { FaShoppingCart, FaLock, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../../context/cartContext';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import PaymentMethods from './PaymentMethods';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    // Datos de envío
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    city: 'Lima',
    zipCode: '',
    // Datos de facturación
    billingSame: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingDistrict: '',
    billingCity: 'Lima',
    billingZipCode: '',
    // Pago
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    // Notas
    orderNotes: ''
  });

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 100 ? 0 : 15; // Envío gratis por compras mayores a S/100
  const finalTotal = totalPrice + shipping;

  // Si el carrito está vacío, redirigir
  if (cartItems.length === 0) {
    return (
      <Container className="checkout-empty">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div className="empty-checkout">
              <FaShoppingCart size={80} className="mb-4" style={{ color: '#d7ad44' }} />
              <h3>Tu carrito está vacío</h3>
              <p className="text-muted mb-4">
                Agrega algunos productos antes de proceder al checkout
              </p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/productos')}
                className="btn-fiofibras"
              >
                Ver Productos
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simular procesamiento del pedido
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const order = {
        id: Date.now(),
        items: cartItems,
        customer: formData,
        totals: {
          subtotal: totalPrice,
          shipping: shipping,
          total: finalTotal
        },
        status: 'confirmado',
        date: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 días
      };
      
      const orders = JSON.parse(localStorage.getItem('fiofibras_orders') || '[]');
      orders.push(order);
      localStorage.setItem('fiofibras_orders', JSON.stringify(orders));
      
      clearCart();
      
      navigate('/order-confirmation', { state: { order } });
      
    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      alert('Hubo un error al procesar tu pedido. Por favor intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CheckoutForm 
            formData={formData} 
            onChange={handleFormChange}
            onNext={handleNextStep}
          />
        );
      case 2:
        return (
          <PaymentMethods 
            formData={formData} 
            onChange={handleFormChange}
            onNext={handleNextStep}
            onPrev={handlePrevStep}
          />
        );
      case 3:
        return (
          <div className="order-review">
            <Card className="review-card">
              <Card.Body>
                <h5 className="mb-4">
                  <FaLock className="me-2" style={{ color: '#228B22' }} />
                  Revisar y Confirmar Pedido
                </h5>
                <div className="review-section mb-4">
                  <h6>Datos de Envío</h6>
                  <p className="mb-1">{formData.firstName} {formData.lastName}</p>
                  <p className="mb-1">{formData.address}</p>
                  <p className="mb-1">{formData.district}, {formData.city} {formData.zipCode}</p>
                  <p className="mb-1">Tel: {formData.phone}</p>
                  <p className="mb-0">Email: {formData.email}</p>
                </div>
                <div className="review-section mb-4">
                  <h6>Método de Pago</h6>
                  <p className="mb-0">
                    {formData.paymentMethod === 'card' ? 'Tarjeta de Crédito/Débito' : 
                     formData.paymentMethod === 'transfer' ? 'Transferencia Bancaria' : 
                     'Pago con Yape'}
                    {formData.paymentMethod === 'card' && formData.cardNumber && 
                      ` - **** **** **** ${formData.cardNumber.slice(-4)}`
                    }
                  </p>
                </div>
                {formData.orderNotes && (
                  <div className="review-section mb-4">
                    <h6>Notas del Pedido</h6>
                    <p className="mb-0">{formData.orderNotes}</p>
                  </div>
                )}
                <div className="review-actions">
                  <Button 
                    variant="outline-secondary" 
                    onClick={handlePrevStep}
                    disabled={isProcessing}
                  >
                    <FaArrowLeft className="me-2" />
                    Atrás
                  </Button>
                  <Button 
                    variant="primary" 
                    className="btn-fiofibras ms-2"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Procesando...
                      </>
                    ) : (
                      `Confirmar Pedido - S/ ${finalTotal.toFixed(2)}`
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="checkout-page">
      <Container>
        <div className="checkout-header mb-4">
          <div className="steps-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <span>1</span>
              <label>Envío</label>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <span>2</span>
              <label>Pago</label>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <span>3</span>
              <label>Revisar</label>
            </div>
          </div>
        </div>
        <Row className="checkout-mobile-layout">
          <Col lg={8} className="checkout-form-col">
            {renderStep()}
          </Col>
          <Col lg={4} className="order-summary-col">
            {/* === CAMBIO REALIZADO AQUÍ === */}
            <div className="order-summary-sticky-container">
              <OrderSummary 
                items={cartItems}
                subtotal={totalPrice}
                shipping={shipping}
                total={finalTotal}
              />
              {shipping === 0 && (
                <Alert variant="success" className="mt-3">
                  <small>🎉 ¡Tienes envío gratuito por compras mayores a S/ 100!</small>
                </Alert>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
// src/components/Checkout/Checkout.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { useCart } from '../../context/cartContext';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api';
import { useOrders } from '../../context/ordersContext';
import OrderSummary from './OrderSummary';
import PaymentMethods from './PaymentMethods';
import AddressForm from './AddressForm';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCartLocal } = useCart();
  const { invalidateOrders } = useOrders();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('mercado_pago');

  const totalPrice = getTotalPrice();
  const shipping = 0;
  const finalTotal = totalPrice;

  useEffect(() => {
    const getAddresses = async () => {
      setLoadingAddresses(true);
      try {
        const response = await apiClient.get('/direcciones/');
        const userAddresses = response.data.results || response.data;
        setAddresses(userAddresses);

        if (userAddresses.length > 0) {
          const principal = userAddresses.find(addr => addr.es_principal);
          setSelectedAddressId(principal ? principal.id : userAddresses[0].id);
        }
      } catch (err) {
        console.error("Error al obtener las direcciones:", err);
        setError("No pudimos cargar tus datos. Por favor, recarga la página.");
      } finally {
        setLoadingAddresses(false);
      }
    };
    getAddresses();
  }, []);

  const handleAddressCreated = (newAddressId) => {
    setSelectedAddressId(newAddressId);
    apiClient.get('/direcciones/').then(response => {
      const userAddresses = response.data.results || response.data;
      setAddresses(userAddresses);
      handleNextStep(newAddressId);
    });
  };

  const handleNextStep = (addressIdOverride = null) => {
    const finalAddressId = addressIdOverride || selectedAddressId;
    if (currentStep === 1 && !finalAddressId) {
      setError("Debes seleccionar o crear una dirección de envío.");
      return;
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => setCurrentStep(currentStep - 1);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !paymentMethod) {
      setError("Falta la dirección o el método de pago.");
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const orderData = {
        direccion_id: selectedAddressId,
        metodo_pago: paymentMethod,
      };

      const response = await apiClient.post('/ordenes/', orderData);
      const newOrder = response.data;

      clearCartLocal();

      // Invalidar caché para que MyOrders recargue en la próxima visita
      invalidateOrders();

      navigate('/order-confirmation', { state: { order: newOrder } });

    } catch (err) {
      console.error('Error al procesar el pedido:', err.response?.data || err);
      const errorMessage = err.response?.data?.error || "Hubo un error al procesar tu pedido. Verifica el stock de los productos e intenta nuevamente.";
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderAddressStep = () => {
    if (loadingAddresses) {
      return <div className="text-center p-5"><Spinner animation="border" /> <p>Cargando datos...</p></div>;
    }

    if (addresses.length === 0) {
      return <AddressForm onAddressCreated={handleAddressCreated} />;
    }

    return (
      <Card className="checkout-form-card">
        <Card.Header as="h5">1. Selecciona una Dirección de Recojo</Card.Header>
        <Card.Body>
          <Form>
            {addresses.map(addr => (
              <Form.Check
                type="radio"
                key={addr.id}
                id={`addr-${addr.id}`}
                name="address"
                checked={selectedAddressId === addr.id}
                onChange={() => setSelectedAddressId(addr.id)}
                label={
                  <div className="w-100">
                    <strong>Recibe: {addr.nombres} {addr.apellidos}</strong> (DNI: {addr.dni})
                    {addr.es_principal && <Badge bg="success" className="ms-2">Principal</Badge>}
                    <br />
                    <small className="text-muted">
                      {addr.agencia_recojo ? `Recoger en ${addr.agencia_recojo} - ${addr.direccion_agencia}` : `${addr.direccion_completo}, ${addr.distrito}`}
                    </small>
                    <br />
                    <small className="text-muted">Tel: {addr.telefono}</small>
                  </div>
                }
                className="mb-3 p-3 border rounded d-flex align-items-center"
              />
            ))}
          </Form>
          <Alert variant="info" className="mt-3">
            ¿Quieres usar otra dirección? Puedes <Link to="/perfil/direcciones">añadirla en tu perfil</Link> y luego recargar esta página.
          </Alert>
          <div className="text-end mt-4">
            <Button className="btn-fiofibras" onClick={() => handleNextStep()} disabled={!selectedAddressId}>
              Continuar al Pago <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderAddressStep();
      case 2:
        return (
          <PaymentMethods
            selectedMethod={paymentMethod}
            onChange={setPaymentMethod}
            onNext={handlePlaceOrder}
            onPrev={handlePrevStep}
            isProcessing={isProcessing}
            finalTotal={finalTotal}
            selectedAddressId={selectedAddressId}
          />
        );
      default:
        return null;
    }
  };

  if (cartItems.length === 0 && !loadingAddresses) {
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
              <Button variant="primary" onClick={() => navigate('/productos')} className="btn-fiofibras">
                Ver Productos
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <div className="checkout-page">
      <Container>
        <div className="checkout-header mb-4">
          <div className="steps-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <span>1</span>
              <label>Envío</label>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <span>2</span>
              <label>Pago</label>
            </div>
          </div>
        </div>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        <Row className="checkout-mobile-layout">
          <Col lg={8} className="checkout-form-col">
            {renderStep()}
          </Col>
          <Col lg={4} className="order-summary-col">
            <div className="order-summary-sticky-container">
              <OrderSummary
                items={cartItems}
                subtotal={totalPrice}
                shipping={shipping}
                total={finalTotal}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Checkout;
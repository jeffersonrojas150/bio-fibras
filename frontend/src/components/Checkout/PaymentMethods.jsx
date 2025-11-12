// src/components/Checkout/PaymentMethods.jsx

import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUniversity, FaMobileAlt, FaCreditCard, FaArrowLeft, FaLock } from 'react-icons/fa';
import { crearPreferenciaPago } from '../../services/mercadoPagoService';

const PaymentMethods = ({
  selectedMethod,
  onChange,
  onNext, // Para pagos manuales (transferencia/yape)
  onPrev,
  isProcessing,
  finalTotal,
  selectedAddressId, // ← NUEVO: necesitamos el ID de la dirección
}) => {

  const [isMercadoPagoProcessing, setIsMercadoPagoProcessing] = useState(false);
  const [mpError, setMpError] = useState('');

  // Handler para pagos manuales (transferencia/yape)
  const handleManualPaymentSubmit = (e) => {
    e.preventDefault();
    if (selectedMethod === 'transferencia' || selectedMethod === 'yape') {
      onNext(); // Llama a handlePlaceOrder del componente padre
    }
  };

  // Handler para Mercado Pago
  const handleMercadoPagoPayment = async () => {
    if (!selectedAddressId) {
      setMpError('Debes seleccionar una dirección de envío primero.');
      return;
    }

    setIsMercadoPagoProcessing(true);
    setMpError('');

    try {
      // Crear preferencia en Mercado Pago
      const response = await crearPreferenciaPago(selectedAddressId);
      
      const { init_point } = response;

      // Redirigir al usuario a Mercado Pago
      window.location.href = init_point;

    } catch (error) {
      console.error('Error al procesar pago con Mercado Pago:', error);
      setMpError('No se pudo iniciar el pago con Mercado Pago. Por favor, intenta nuevamente.');
      setIsMercadoPagoProcessing(false);
    }
  };

  return (
    <Card className="payment-card">
      <Card.Header as="h5">
        <FaLock className="me-2" />
        2. Elige tu Método de Pago
      </Card.Header>
      <Card.Body>
        {mpError && <Alert variant="danger" dismissible onClose={() => setMpError('')}>{mpError}</Alert>}

        <Form onSubmit={handleManualPaymentSubmit}>
          <div className="payment-methods">

            {/* Opción 1: Mercado Pago (NUEVA) */}
            <div
              className={`payment-method ${selectedMethod === 'mercado_pago' ? 'selected' : ''}`}
              onClick={() => onChange('mercado_pago')}
            >
              <div className="payment-method-header">
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  id="mercado_pago"
                  checked={selectedMethod === 'mercado_pago'}
                  onChange={() => onChange('mercado_pago')}
                  className="payment-method-radio"
                />
                <FaCreditCard className="payment-method-icon" style={{ color: '#009ee3' }} />
                <div className="payment-method-info">
                  <h6>Mercado Pago</h6>
                  <p>Paga con tarjeta, Yape o billetera digital de forma segura.</p>
                </div>
              </div>
            </div>

            {/* Opción 2: Transferencia Bancaria */}
            <div
              className={`payment-method ${selectedMethod === 'transferencia' ? 'selected' : ''}`}
              onClick={() => onChange('transferencia')}
            >
              <div className="payment-method-header">
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  id="transfer"
                  checked={selectedMethod === 'transferencia'}
                  onChange={() => onChange('transferencia')}
                  className="payment-method-radio"
                />
                <FaUniversity className="payment-method-icon" />
                <div className="payment-method-info">
                  <h6>Transferencia Bancaria</h6>
                  <p>Realiza el pago a nuestra cuenta BCP.</p>
                </div>
              </div>
            </div>

            {/* Opción 3: Pago con Yape Manual */}
            <div
              className={`payment-method ${selectedMethod === 'yape' ? 'selected' : ''}`}
              onClick={() => onChange('yape')}
            >
              <div className="payment-method-header">
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  id="yape"
                  checked={selectedMethod === 'yape'}
                  onChange={() => onChange('yape')}
                  className="payment-method-radio"
                />
                <FaMobileAlt className="payment-method-icon" />
                <div className="payment-method-info">
                  <h6>Paga con Yape Manual</h6>
                  <p>Yapea al número y envía el comprobante por WhatsApp.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Mensaje según método seleccionado */}
          {selectedMethod === 'mercado_pago' && (
            <Alert variant="info" className="mt-4 text-center">
              Serás redirigido a Mercado Pago para completar tu pago de forma segura.
            </Alert>
          )}

          {(selectedMethod === 'transferencia' || selectedMethod === 'yape') && (
            <Alert variant="info" className="mt-4 text-center">
              Las instrucciones detalladas para completar tu pago se mostrarán al <strong>finalizar la compra</strong> y también se enviarán a tu correo electrónico.
            </Alert>
          )}

          {/* Botones de Navegación */}
          <div className="form-actions d-flex justify-content-between align-items-center mt-4">
            <Button 
              variant="outline-secondary" 
              onClick={onPrev} 
              disabled={isProcessing || isMercadoPagoProcessing}
            >
              <FaArrowLeft className="me-2" />
              Volver a Envío
            </Button>
            
            {selectedMethod === 'mercado_pago' ? (
              // Botón para Mercado Pago
              <Button 
                onClick={handleMercadoPagoPayment} 
                className="btn-fiofibras" 
                disabled={isMercadoPagoProcessing}
              >
                {isMercadoPagoProcessing ? (
                  <>
                    <Spinner as="span" size="sm" className="me-2" />
                    Redirigiendo a Mercado Pago...
                  </>
                ) : (
                  `Pagar con Mercado Pago - S/ ${finalTotal.toFixed(2)}`
                )}
              </Button>
            ) : (
              // Botón para pagos manuales
              <Button type="submit" className="btn-fiofibras" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Spinner as="span" size="sm" className="me-2" />
                    Procesando Pedido...
                  </>
                ) : (
                  `Confirmar Pedido - S/ ${finalTotal.toFixed(2)}`
                )}
              </Button>
            )}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PaymentMethods;
// src/components/Checkout/PaymentMethods.jsx

import React from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUniversity, FaMobileAlt, FaArrowLeft, FaLock } from 'react-icons/fa';

const PaymentMethods = ({
  selectedMethod,
  onChange,
  onNext, // Esta prop ahora es la función 'handlePlaceOrder'
  onPrev,
  isProcessing,
  finalTotal,
}) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(); // Al hacer submit, llamamos a la función para finalizar el pedido
  };

  return (
    <Card className="payment-card">
      <Card.Header as="h5">
        <FaLock className="me-2" />
        2. Elige tu Método de Pago
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <div className="payment-methods">

            {/* Opción 1: Transferencia Bancaria */}
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

            {/* Opción 2: Pago con Yape */}
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
                  <h6>Paga con Yape</h6>
                  <p>Rápido y sin comisiones desde tu celular.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Mensaje Informativo Clave */}
          <Alert variant="info" className="mt-4 text-center">
            Las instrucciones detalladas para completar tu pago se mostrarán al <strong>finalizar la compra</strong> y también se enviarán a tu correo electrónico.
          </Alert>

          {/* Botones de Navegación */}
          <div className="form-actions d-flex justify-content-between align-items-center mt-4">
            <Button variant="outline-secondary" onClick={onPrev} disabled={isProcessing}>
              <FaArrowLeft className="me-2" />
              Volver a Envío
            </Button>
            
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
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PaymentMethods;
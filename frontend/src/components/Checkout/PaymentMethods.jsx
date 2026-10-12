// src/components/Checkout/PaymentMethods.jsx

import React from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUniversity, FaCreditCard, FaArrowLeft, FaLock, FaInfoCircle } from 'react-icons/fa';
import yapeLogo from '../../assets/yape-logo.png';
// Mercado Pago deshabilitado temporalmente — descomentar para reactivar
// import { crearPreferenciaPago } from '../../services/mercadoPagoService';

const PaymentMethods = ({
  selectedMethod,
  onChange,
  onNext, // Para pagos manuales (transferencia/yape)
  onPrev,
  isProcessing,
  finalTotal,
  selectedAddressId, // eslint-disable-line no-unused-vars -- reservado para cuando se reactive Mercado Pago
}) => {

  // Mercado Pago deshabilitado temporalmente
  // const [isMercadoPagoProcessing, setIsMercadoPagoProcessing] = useState(false);
  // const [mpError, setMpError] = useState('');

  // Handler para pagos manuales (transferencia/yape)
  const handleManualPaymentSubmit = (e) => {
    e.preventDefault();
    if (selectedMethod === 'transferencia' || selectedMethod === 'yape') {
      onNext(); // Llama a handlePlaceOrder del componente padre
    }
  };

  // Mercado Pago deshabilitado temporalmente — descomentar para reactivar
  // const handleMercadoPagoPayment = async () => {
  //   if (!selectedAddressId) {
  //     setMpError('Debes seleccionar una dirección de envío primero.');
  //     return;
  //   }
  //
  //   setIsMercadoPagoProcessing(true);
  //   setMpError('');
  //
  //   try {
  //     // Crear preferencia en Mercado Pago
  //     const response = await crearPreferenciaPago(selectedAddressId);
  //
  //     const { init_point } = response;
  //
  //     // Redirigir al usuario a Mercado Pago
  //     window.location.href = init_point;
  //
  //   } catch (error) {
  //     console.error('Error al procesar pago con Mercado Pago:', error);
  //     setMpError('No se pudo iniciar el pago con Mercado Pago. Por favor, intenta nuevamente.');
  //     setIsMercadoPagoProcessing(false);
  //   }
  // };

  return (
    <Card className="payment-card">
      <Card.Header as="h5">
        <FaLock className="me-2" />
        2. Elige tu Método de Pago
      </Card.Header>
      <Card.Body>
        {/* Mercado Pago deshabilitado temporalmente
        {mpError && <Alert variant="danger" dismissible onClose={() => setMpError('')}>{mpError}</Alert>}
        */}

        <Form onSubmit={handleManualPaymentSubmit}>
          <div className="payment-methods">

            {/* ==========================================
            Mercado Pago deshabilitado temporalmente — descomentar para reactivar
            OPCIÓN PRINCIPAL 1: PAGAR EN LÍNEA
            ==========================================
            <div
              className={`payment-method ${mainOption === 'online' ? 'selected' : ''}`}
              onClick={() => handleMainOptionChange('online')}
            >
              <div className="payment-method-header">
                <Form.Check
                  type="radio"
                  name="mainPaymentOption"
                  id="online"
                  checked={mainOption === 'online'}
                  onChange={() => handleMainOptionChange('online')}
                  className="payment-method-radio"
                />
                <FaCreditCard className="payment-method-icon" style={{ color: '#009ee3' }} />
                <div className="payment-method-info">
                  <h6>Pagar en Línea</h6>
                  <p>Mercado Pago - Tarjeta, Yape o billetera digital</p>
                </div>
              </div>
            </div>
            */}

            {/* ========================================== */}
            {/* OPCIÓN: TRANSFERENCIA BANCARIA */}
            {/* ========================================== */}
            <div
              className={`payment-method ${selectedMethod === 'transferencia' ? 'selected' : ''}`}
              onClick={() => onChange('transferencia')}
            >
              <div className="payment-method-header">
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  id="transferencia"
                  checked={selectedMethod === 'transferencia'}
                  onChange={() => onChange('transferencia')}
                  className="payment-method-radio"
                />
                <FaUniversity className="payment-method-icon" style={{ color: '#d7ad44' }} />
                <div className="payment-method-info">
                  <h6>Transferencia Bancaria</h6>
                  <p>BCP - Recibe instrucciones por correo</p>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* OPCIÓN: YAPE */}
            {/* ========================================== */}
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
                <img src={yapeLogo} alt="Yape" className="payment-method-logo" />
                <div className="payment-method-info">
                  <h6>Yape</h6>
                  <p>Yapea al número de Biofibras y sube tu comprobante</p>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================== */}
          {/* MENSAJES INFORMATIVOS SEGÚN SELECCIÓN */}
          {/* ========================================== */}

          {/* Mercado Pago deshabilitado temporalmente
          {selectedMethod === 'mercado_pago' && (
            <Alert variant="info" className="mt-4 d-flex align-items-center">
              <FaLock className="me-2" style={{ fontSize: '1.5rem', color: '#0dcaf0' }} />
              <div>
                <strong>Pago Seguro:</strong> Serás redirigido a Mercado Pago para completar tu pago de forma segura.
              </div>
            </Alert>
          )}
          */}

          {(selectedMethod === 'transferencia' || selectedMethod === 'yape') && (
            <Alert variant="info" className="mt-4 d-flex align-items-center">
              <FaInfoCircle className="me-2" style={{ fontSize: '1.5rem', color: '#0dcaf0' }} />
              <div>
                <strong>Instrucciones de Pago:</strong> Las instrucciones detalladas para completar tu pago se mostrarán al finalizar la compra y también se enviarán a tu correo electrónico.
              </div>
            </Alert>
          )}

          {/* ========================================== */}
          {/* BOTONES DE NAVEGACIÓN */}
          {/* ========================================== */}

          <div className="form-actions d-flex justify-content-between align-items-center mt-4">
            <Button
              variant="outline-secondary"
              onClick={onPrev}
              disabled={isProcessing}
            >
              <FaArrowLeft className="me-2" />
              Volver a Envío
            </Button>

            {/* Mercado Pago deshabilitado temporalmente — descomentar para reactivar
            {selectedMethod === 'mercado_pago' ? (
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
                  `Pagar S/ ${finalTotal.toFixed(2)}`
                )}
              </Button>
            ) : ( */}
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
            {/* )} */}
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PaymentMethods;
// src/components/Checkout/PaymentMethods.jsx

import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner, Collapse } from 'react-bootstrap';
import { FaUniversity, FaMobileAlt, FaCreditCard, FaArrowLeft, FaLock, FaWhatsapp } from 'react-icons/fa';
import { crearPreferenciaPago } from '../../services/mercadoPagoService';

const PaymentMethods = ({
  selectedMethod,
  onChange,
  onNext, // Para pagos manuales (transferencia/yape)
  onPrev,
  isProcessing,
  finalTotal,
  selectedAddressId,
}) => {

  const [isMercadoPagoProcessing, setIsMercadoPagoProcessing] = useState(false);
  const [mpError, setMpError] = useState('');

  // Estado para controlar si se seleccionó "Pagar vía WhatsApp"
  const [showWhatsAppOptions, setShowWhatsAppOptions] = useState(false);

  // Determinar cuál es la opción principal seleccionada
  const mainOption = selectedMethod === 'mercado_pago' ? 'online' : 'whatsapp';

  // Handler para seleccionar opción principal
  const handleMainOptionChange = (option) => {
    if (option === 'online') {
      onChange('mercado_pago');
      setShowWhatsAppOptions(false);
    } else {
      setShowWhatsAppOptions(true);
      // Por defecto, seleccionar transferencia si no hay nada seleccionado
      if (selectedMethod === 'mercado_pago' || !selectedMethod) {
        onChange('transferencia');
      }
    }
  };

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

            {/* ========================================== */}
            {/* OPCIÓN PRINCIPAL 1: PAGAR EN LÍNEA */}
            {/* ========================================== */}
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

            {/* ========================================== */}
            {/* OPCIÓN PRINCIPAL 2: PAGAR VÍA WHATSAPP */}
            {/* ========================================== */}
            <div
              className={`payment-method ${mainOption === 'whatsapp' ? 'selected' : ''}`}
              onClick={() => handleMainOptionChange('whatsapp')}
            >
              <div className="payment-method-header">
                <Form.Check
                  type="radio"
                  name="mainPaymentOption"
                  id="whatsapp"
                  checked={mainOption === 'whatsapp'}
                  onChange={() => handleMainOptionChange('whatsapp')}
                  className="payment-method-radio"
                />
                <FaWhatsapp className="payment-method-icon" style={{ color: '#25D366' }} />
                <div className="payment-method-info">
                  <h6>Pagar vía WhatsApp</h6>
                  <p>Transferencia o Yape - Envía tu comprobante</p>
                </div>
              </div>

              {/* SUB-OPCIONES (SOLO SI SE SELECCIONA WHATSAPP) */}
              <Collapse in={showWhatsAppOptions}>
                <div className="whatsapp-suboptions mt-3 ps-5">

                  {/* Sub-opción 1: Transferencia */}
                  <div
                    className={`payment-method-sub ${selectedMethod === 'transferencia' ? 'selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); onChange('transferencia'); }}
                  >
                    <Form.Check
                      type="radio"
                      name="whatsappMethod"
                      id="transferencia"
                      checked={selectedMethod === 'transferencia'}
                      onChange={() => onChange('transferencia')}
                      label={
                        <div className="d-flex align-items-center">
                          <FaUniversity className="me-2" style={{ color: '#d7ad44' }} />
                          <div>
                            <strong>Transferencia Bancaria</strong>
                            <br />
                            <small className="text-muted">BCP - Recibe instrucciones por correo</small>
                          </div>
                        </div>
                      }
                    />
                  </div>

                  {/* Sub-opción 2: Yape */}
                  <div
                    className={`payment-method-sub ${selectedMethod === 'yape' ? 'selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); onChange('yape'); }}
                  >
                    <Form.Check
                      type="radio"
                      name="whatsappMethod"
                      id="yape"
                      checked={selectedMethod === 'yape'}
                      onChange={() => onChange('yape')}
                      label={
                        <div className="d-flex align-items-center">
                          <FaMobileAlt className="me-2" style={{ color: '#d7ad44' }} />
                          <div>
                            <strong>Yape</strong>
                            <br />
                            <small className="text-muted">Yapea y envía el comprobante</small>
                          </div>
                        </div>
                      }
                    />
                  </div>

                </div>
              </Collapse>
            </div>

          </div>

          {/* ========================================== */}
          {/* MENSAJES INFORMATIVOS SEGÚN SELECCIÓN */}
          {/* ========================================== */}

          {selectedMethod === 'mercado_pago' && (
            <Alert variant="info" className="mt-4 d-flex align-items-center">
              <FaLock className="me-2" style={{ fontSize: '1.5rem', color: '#0dcaf0' }} />
              <div>
                <strong>Pago Seguro:</strong> Serás redirigido a Mercado Pago para completar tu pago de forma segura.
              </div>
            </Alert>
          )}

          {(selectedMethod === 'transferencia' || selectedMethod === 'yape') && (
            <Alert variant="info" className="mt-4 d-flex align-items-center">
              <FaWhatsapp className="me-2" style={{ fontSize: '1.5rem', color: '#25D366' }} />
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
                  `Pagar S/ ${finalTotal.toFixed(2)}`
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
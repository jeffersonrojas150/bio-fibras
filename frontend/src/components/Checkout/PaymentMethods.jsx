import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { 
  FaCreditCard, 
  FaUniversity, 
  FaArrowLeft, 
  FaArrowRight,
  FaShieldAlt,
  FaLock,
  FaMobileAlt,
  FaExclamationTriangle,
  FaWhatsapp,
  FaMoneyBillWave,
} from 'react-icons/fa';
import yapeQrImage from '../../assets/yapebiofibras.jpeg';
import './YapePayment.css'; // Asegúrate que este archivo CSS esté en la ruta correcta

const PaymentMethods = ({ formData, onChange, onNext, onPrev }) => {
  const [errors, setErrors] = useState({});

  const validatePayment = () => {
    const newErrors = {};
    
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Número de tarjeta requerido';
      } else if (formData.cardNumber.replace(/\D/g, '').length < 13) {
        newErrors.cardNumber = 'Número de tarjeta inválido';
      }
      
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Fecha de vencimiento requerida';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Formato MM/AA';
      }
      
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV requerido';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV inválido';
      }
      
      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Nombre del titular requerido';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validatePayment()) {
      onNext();
    }
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const getCardBrand = (number) => {
    const cleaned = number.replace(/\D/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    return '';
  };

  return (
    <Card className="payment-card">
      <Card.Header>
        <FaCreditCard className="me-2" />
        Método de Pago
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <div className="payment-methods">
            {/* Tarjeta de Crédito/Débito (Sin cambios) */}
            <div 
              className={`payment-method ${formData.paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => onChange('paymentMethod', 'card')}
            >
              <div className="payment-method-header">
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  id="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={() => onChange('paymentMethod', 'card')}
                  className="payment-method-radio"
                />
                <FaCreditCard className="payment-method-icon" />
                <div className="payment-method-info">
                  <h6>Tarjeta de Crédito/Débito</h6>
                  <p>Visa, Mastercard, American Express</p>
                </div>
              </div>

              {formData.paymentMethod === 'card' && (
                <div className="card-inputs">
                  <Alert variant="success" className="security-notice">
                    <FaShieldAlt className="me-2" />
                    <small>
                      Tus datos están protegidos con encriptación SSL de 256 bits
                    </small>
                  </Alert>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3">
                        <Form.Label>Número de tarjeta *</Form.Label>
                        <Form.Control type="text" value={formData.cardNumber} onChange={(e) => onChange('cardNumber', formatCardNumber(e.target.value))} placeholder="1234 5678 9012 3456" isInvalid={!!errors.cardNumber}/>
                        {getCardBrand(formData.cardNumber) && (<Form.Text className="text-muted">{getCardBrand(formData.cardNumber)} detectada</Form.Text>)}
                        <Form.Control.Feedback type="invalid">{errors.cardNumber}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>CVV *</Form.Label>
                        <Form.Control type="text" value={formData.cvv} onChange={(e) => onChange('cvv', e.target.value.replace(/\D/g, '').substring(0, 4))} placeholder="123" isInvalid={!!errors.cvv}/>
                        <Form.Control.Feedback type="invalid">{errors.cvv}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha de vencimiento *</Form.Label>
                        <Form.Control type="text" value={formData.expiryDate} onChange={(e) => onChange('expiryDate', formatExpiryDate(e.target.value))} placeholder="MM/AA" isInvalid={!!errors.expiryDate}/>
                        <Form.Control.Feedback type="invalid">{errors.expiryDate}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre del titular *</Form.Label>
                        <Form.Control type="text" value={formData.cardName} onChange={(e) => onChange('cardName', e.target.value.toUpperCase())} placeholder="JUAN PÉREZ" isInvalid={!!errors.cardName}/>
                        <Form.Control.Feedback type="invalid">{errors.cardName}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}
            </div>

            {/* Transferencia Bancaria - ACTUALIZADO */}
            <div 
              className={`payment-method ${formData.paymentMethod === 'transfer' ? 'selected' : ''}`}
              onClick={() => onChange('paymentMethod', 'transfer')}
            >
              <div className="payment-method-header">
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  id="transfer"
                  checked={formData.paymentMethod === 'transfer'}
                  onChange={() => onChange('paymentMethod', 'transfer')}
                  className="payment-method-radio"
                />
                <FaUniversity className="payment-method-icon" />
                <div className="payment-method-info">
                  <h6>Transferencia Bancaria o Depósito</h6>
                  <p>Realiza el pago a nuestra cuenta BCP</p>
                </div>
              </div>

              {formData.paymentMethod === 'transfer' && (
                <Alert variant="info" className="mt-3">
                  <h6>Instrucciones para Transferencia BCP:</h6>
                  <p className="mb-2">
                    <strong>Banco:</strong> Banco de Crédito del Perú (BCP)<br />
                    <strong>Titular:</strong> Jairo Jhanpier Villegas Solano<br />
                    <strong>Cuenta de Ahorro:</strong> 47571003862030<br />
                    <strong>CCI:</strong> 00247517100386203021
                  </p>
                  <hr/>
                  <p className="mt-3 mb-2">
                    <strong>¡Importante!</strong> Una vez realizado el pago, envía la captura junto con tu <span className="highlight">número de pedido</span> por WhatsApp para procesar tu pedido.
                  </p>
                  <Button 
                    variant="success" 
                    href="https://wa.me/51910881837?text=Hola,%20adjunto%20el%20voucher%20de%20mi%20pedido."
                    target="_blank"
                    className="mt-2 w-100"
                  >
                    <FaWhatsapp className="me-2" />
                    Enviar Voucher por WhatsApp (910 881 837)
                  </Button>
                </Alert>
              )}
            </div>
            
            {/* Pago con Yape - ACTUALIZADO */}
            <div 
              className={`payment-method ${formData.paymentMethod === 'yape' ? 'selected' : ''}`}
              onClick={() => onChange('paymentMethod', 'yape')}
            >
              <div className="payment-method-header">
                <Form.Check
                  type="radio"
                  name="paymentMethod"
                  id="yape"
                  checked={formData.paymentMethod === 'yape'}
                  onChange={() => onChange('paymentMethod', 'yape')}
                  className="payment-method-radio"
                />
                <FaMobileAlt className="payment-method-icon" />
                <div className="payment-method-info">
                  <h6>Paga con Yape</h6>
                  <p>Rápido y sin comisiones desde tu celular</p>
                </div>
              </div>

              {formData.paymentMethod === 'yape' && (
                <div className="yape-payment-container">
                  <div className="yape-header">
                    <h6>💜 Paga con Yape</h6>
                    <p>Escanea el código QR o yapea al número</p>
                  </div>

                  <div className="yape-qr-section">
                    <img 
                      src={yapeQrImage} 
                      alt="Código QR de Yape" 
                      className="yape-qr-code"
                    />
                    
                    <div className="yape-contact-info">
                      <div className="yape-contact-name">Jairo Jhanpier Villegas Solano</div>
                      <div className="yape-contact-phone">+51 910 881 837</div>
                    </div>
                  </div>

                  <div className="yape-instructions" >
                    <h6>
                      <FaExclamationTriangle className="warning-icon" />
                      ¡Muy importante!
                    </h6>
                    
                    <div className="yape-steps">
                      <div className="yape-step">
                        <div className="yape-step-number">1</div>
                        <div className="yape-step-text">
                          Abre tu app <strong>Yape</strong> y escanea el QR o yapea al número mostrado.
                        </div>
                      </div>
                      
                      <div className="yape-step">
                        <div className="yape-step-number">2</div>
                        <div className="yape-step-text">
                          Ingresa el <span className="highlight">monto exacto</span> de tu pedido.
                        </div>
                      </div>
                      
                      <div className="yape-step">
                        <div className="yape-step-number">3</div>
                        <div className="yape-step-text">
                          Toma una <span className="highlight">captura de pantalla</span> del voucher de pago.
                        </div>
                      </div>
                      
                      <div className="yape-step">
                        <div className="yape-step-number">4</div>
                        <div className="yape-step-text">
                          Envía la captura junto con tu <span className="highlight">número de pedido</span> por WhatsApp.
                        </div>
                      </div>
                    </div>

                    <div className="contact-options mt-3 text-center">
                       <Button 
                    variant="success" 
                    href="https://wa.me/51910881837?text=Hola,%20adjunto%20el%20voucher%20de%20mi%20pedido."
                    target="_blank"
                    className="mt-2 w-100"
                  >
                    <FaWhatsapp className="me-2" />
                    Enviar Voucher por WhatsApp (910 881 837)
                  </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          
            
          </div>

          {/* Términos y condiciones */}
          <div className="terms-section mt-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <Form.Check
              type="checkbox"
              id="terms"
              label={
                <span>
                  Acepto los <a href="/terminos" target="_blank">términos y condiciones</a> y 
                  la <a href="/privacidad" target="_blank">política de privacidad</a>
                </span>
              }
              required
              className="mb-0"
            />
          </div>

          {/* Garantías */}
          <div className="guarantees mt-4">
            <Row className="text-center">
              <Col md={4}>
                <div className="guarantee-item">
                  <FaShieldAlt size={24} style={{ color: '#228B22' }} />
                  <small className="d-block mt-1">Compra Segura</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="guarantee-item">
                  <FaLock size={24} style={{ color: '#228B22' }} />
                  <small className="d-block mt-1">Datos Protegidos</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="guarantee-item">
                  <FaMoneyBillWave size={24} style={{ color: '#228B22' }} />
                  <small className="d-block mt-1">Devolución Garantizada</small>
                </div>
              </Col>
            </Row>
          </div>

          {/* Botones de navegación */}
          <div className="form-actions d-flex justify-content-between align-items-center mt-4">
            <Button 
              variant="outline-secondary"
              onClick={onPrev}
              size="lg"
            >
              <FaArrowLeft className="me-2" />
              Atrás
            </Button>
            
            <Button 
              type="submit" 
              className="btn-fiofibras"
              size="lg"
            >
              Revisar Pedido
              <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PaymentMethods;
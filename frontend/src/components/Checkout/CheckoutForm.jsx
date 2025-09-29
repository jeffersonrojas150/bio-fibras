// src/components/Checkout/CheckoutForm.jsx
import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FaTruck, FaUser, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

const CheckoutForm = ({ formData, onChange, onNext }) => {
  const [errors, setErrors] = useState({});
  const [showBilling, setShowBilling] = useState(!formData.billingSame);

  // Distritos de Lima más comunes
  const districts = [
    'Miraflores', 'San Isidro', 'Barranco', 'Surco', 'La Molina',
    'San Borja', 'Surquillo', 'Magdalena', 'Jesús María', 'Lince',
    'Pueblo Libre', 'Breña', 'Lima Cercado', 'Rímac', 'Los Olivos',
    'San Miguel', 'Callao', 'Bellavista', 'La Victoria', 'San Luis',
    'Chorrillos', 'Villa El Salvador', 'Villa María del Triunfo'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones de envío
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^[0-9]{9,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Teléfono no válido';
    }
    if (!formData.address.trim()) newErrors.address = 'La dirección es requerida';
    if (!formData.district.trim()) newErrors.district = 'El distrito es requerido';
    
    // Validaciones de facturación si es diferente
    if (!formData.billingSame) {
      if (!formData.billingFirstName.trim()) newErrors.billingFirstName = 'El nombre de facturación es requerido';
      if (!formData.billingLastName.trim()) newErrors.billingLastName = 'El apellido de facturación es requerido';
      if (!formData.billingAddress.trim()) newErrors.billingAddress = 'La dirección de facturación es requerida';
      if (!formData.billingDistrict.trim()) newErrors.billingDistrict = 'El distrito de facturación es requerido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const handleBillingSameChange = (checked) => {
    onChange('billingSame', checked);
    setShowBilling(!checked);
    
    // Si marca "misma dirección", copiar datos de envío a facturación
    if (checked) {
      onChange('billingFirstName', formData.firstName);
      onChange('billingLastName', formData.lastName);
      onChange('billingAddress', formData.address);
      onChange('billingDistrict', formData.district);
      onChange('billingCity', formData.city);
      onChange('billingZipCode', formData.zipCode);
    }
  };

  const formatPhone = (value) => {
    // Formatear teléfono mientras escribe (9 dígitos peruanos)
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 9) {
      return cleaned.substring(0, 9).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    return cleaned;
  };

  return (
    <Card className="checkout-form-card">
      <Card.Header>
        <FaTruck className="me-2" />
        Información de Envío y Facturación
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit} className="shipping-form">
          {/* Información Personal */}
          <div className="form-section mb-4">
            <h6 className="section-title mb-3">
              <FaUser className="me-2" style={{ color: '#d7ad44' }} />
              Información Personal
            </h6>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombres *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => onChange('firstName', e.target.value)}
                    isInvalid={!!errors.firstName}
                    placeholder="Ingresa tus nombres"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellidos *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => onChange('lastName', e.target.value)}
                    isInvalid={!!errors.lastName}
                    placeholder="Ingresa tus apellidos"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => onChange('email', e.target.value)}
                    isInvalid={!!errors.email}
                    placeholder="ejemplo@correo.com"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Te enviaremos la confirmación del pedido a este email
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono *</Form.Label>
                  <Form.Control
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => onChange('phone', formatPhone(e.target.value))}
                    isInvalid={!!errors.phone}
                    placeholder="999 999 999"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Dirección de Envío */}
          <div className="form-section mb-4">
            <h6 className="section-title mb-3">
              <FaMapMarkerAlt className="me-2" style={{ color: '#d7ad44' }} />
              Dirección de Envío
            </h6>
            
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Dirección completa *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.address}
                    onChange={(e) => onChange('address', e.target.value)}
                    isInvalid={!!errors.address}
                    placeholder="Av. Principal 123, Dpto. 4B"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Distrito *</Form.Label>
                  <Form.Select
                    value={formData.district}
                    onChange={(e) => onChange('district', e.target.value)}
                    isInvalid={!!errors.district}
                  >
                    <option value="">Selecciona un distrito</option>
                    {districts.map(district => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.district}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Ciudad</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.city}
                    onChange={(e) => onChange('city', e.target.value)}
                    readOnly
                  />
                </Form.Group>
              </Col>
              
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Código Postal</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => onChange('zipCode', e.target.value)}
                    placeholder="15001"
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* Información de Facturación */}
          <div className="form-section mb-4">
            <Form.Check
              type="checkbox"
              id="billing-same"
              label="La dirección de facturación es la misma que la de envío"
              checked={formData.billingSame}
              onChange={(e) => handleBillingSameChange(e.target.checked)}
              className="mb-3"
            />

            {showBilling && (
              <div className="billing-section">
                <h6 className="mb-3" style={{ color: '#2c3e32' }}>
                  Dirección de Facturación
                </h6>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombres *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.billingFirstName}
                        onChange={(e) => onChange('billingFirstName', e.target.value)}
                        isInvalid={!!errors.billingFirstName}
                        placeholder="Nombres"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.billingFirstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellidos *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.billingLastName}
                        onChange={(e) => onChange('billingLastName', e.target.value)}
                        isInvalid={!!errors.billingLastName}
                        placeholder="Apellidos"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.billingLastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dirección *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.billingAddress}
                        onChange={(e) => onChange('billingAddress', e.target.value)}
                        isInvalid={!!errors.billingAddress}
                        placeholder="Dirección de facturación"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.billingAddress}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Distrito *</Form.Label>
                      <Form.Select
                        value={formData.billingDistrict}
                        onChange={(e) => onChange('billingDistrict', e.target.value)}
                        isInvalid={!!errors.billingDistrict}
                      >
                        <option value="">Selecciona un distrito</option>
                        {districts.map(district => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.billingDistrict}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ciudad</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.billingCity}
                        onChange={(e) => onChange('billingCity', e.target.value)}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Código Postal</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.billingZipCode}
                        onChange={(e) => onChange('billingZipCode', e.target.value)}
                        placeholder="15001"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            )}
          </div>

          {/* Notas adicionales */}
          <div className="form-section mb-4">
            <Form.Group>
              <Form.Label>Notas del pedido (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.orderNotes}
                onChange={(e) => onChange('orderNotes', e.target.value)}
                placeholder="Instrucciones especiales para la entrega, referencias, etc."
              />
            </Form.Group>
          </div>

          <Alert variant="info" className="d-flex align-items-center">
            <FaTruck className="me-2" style={{ color: '#0dcaf0' }} />
            <div>
              <strong>Tiempo de entrega:</strong> 3-5 días hábiles en Lima Metropolitana.
              <br />
              <strong>Envío gratuito</strong> en compras mayores a S/ 100.
            </div>
          </Alert>

          <div className="form-actions text-end">
            <Button 
              type="submit" 
              className="btn-fiofibras"
              size="lg"
            >
              Continuar al Pago
              <FaArrowRight className="ms-2" />
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CheckoutForm;
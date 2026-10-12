// src/components/Checkout/SubirComprobantePago.jsx
import React, { useState } from 'react';
import { Card, Button, Alert, Form, Spinner, Modal } from 'react-bootstrap';
import { FaUpload, FaCheckCircle, FaWhatsapp, FaExclamationTriangle, FaFileImage } from 'react-icons/fa';
import apiClient from '../../api';
import './SubirComprobantePago.css';

const ComprobanteReadOnly = ({ src, onExpand }) => (
  <div className="text-center mb-2">
    <img
      src={src}
      alt="Comprobante de pago"
      style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', cursor: 'pointer' }}
      onClick={onExpand}
    />
    <div>
      <Button variant="link" size="sm" className="py-1" onClick={onExpand}>
        Ver imagen completa
      </Button>
    </div>
  </div>
);

const SubirComprobantePago = ({ orden, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);

  const tieneComprobante = !!orden.comprobante_pago;
  const permiteSubir = orden.estado_pago === 'pendiente' || orden.estado_pago === 'rechazado';

  // Nada que mostrar: sin comprobante aún y el pedido ya no admite subir uno (ej. cancelado)
  if (!tieneComprobante && !permiteSubir) {
    return null;
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Selecciona una imagen del comprobante de pago.');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('comprobante_pago', file);
      const response = await apiClient.post(
        `/ordenes/${orden.id}/comprobante/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      onUploaded(response.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'No pudimos subir tu comprobante. Intenta nuevamente.';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  const whatsappMessage = `Hola, ya subí el comprobante de pago de mi pedido #${orden.numero_orden} a la web, por favor revísenlo.`;
  const whatsappUrl = `https://wa.me/51910881837?text=${encodeURIComponent(whatsappMessage)}`;

  const imageModal = tieneComprobante && (
    <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Comprobante de Pago</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img src={orden.comprobante_pago} alt="Comprobante de pago" style={{ width: '100%', height: 'auto' }} />
      </Modal.Body>
    </Modal>
  );

  // Pedido en revisión: comprobante ya enviado, de solo lectura mientras el admin lo revisa
  if (orden.estado_pago === 'en_revision') {
    return (
      <>
        <Card className="shipping-info-card h-100">
          <Card.Header as="h5"><FaFileImage className="me-2" />Comprobante de Pago</Card.Header>
          <Card.Body className="text-center">
            <FaCheckCircle size={36} style={{ color: '#228B22' }} className="mb-2" />
            <h6>¡Comprobante recibido!</h6>
            <ComprobanteReadOnly src={orden.comprobante_pago} onExpand={() => setShowImageModal(true)} />
            <p className="text-muted small">
              Tu pedido #{orden.numero_orden} quedó en revisión. Avísanos por WhatsApp para agilizar la confirmación.
            </p>
            <Button variant="success" size="sm" href={whatsappUrl} target="_blank" className="w-100">
              <FaWhatsapp className="me-2" /> Avisar por WhatsApp
            </Button>
          </Card.Body>
        </Card>
        {imageModal}
      </>
    );
  }

  // Pago ya confirmado: comprobante de solo lectura, como constancia
  if (orden.estado_pago === 'pagado') {
    return (
      <>
        <Card className="shipping-info-card h-100">
          <Card.Header as="h5"><FaFileImage className="me-2" />Comprobante de Pago</Card.Header>
          <Card.Body className="text-center">
            <FaCheckCircle size={36} style={{ color: '#228B22' }} className="mb-2" />
            <h6>Pago confirmado</h6>
            <ComprobanteReadOnly src={orden.comprobante_pago} onExpand={() => setShowImageModal(true)} />
          </Card.Body>
        </Card>
        {imageModal}
      </>
    );
  }

  // Pedido cancelado pero con comprobante: se deja como constancia, de solo lectura
  if (orden.estado_pago === 'cancelado') {
    return (
      <>
        <Card className="shipping-info-card h-100">
          <Card.Header as="h5"><FaFileImage className="me-2" />Comprobante de Pago</Card.Header>
          <Card.Body>
            <ComprobanteReadOnly src={orden.comprobante_pago} onExpand={() => setShowImageModal(true)} />
          </Card.Body>
        </Card>
        {imageModal}
      </>
    );
  }

  // Pendiente (primera vez) o rechazado (corrección): formulario de subida habilitado
  return (
    <>
      <Card className="comprobante-upload-card mt-4 h-100">
        <Card.Header as="h5">
          {orden.estado_pago === 'rechazado' ? 'Sube tu comprobante corregido' : 'Último paso: sube tu comprobante de pago'}
        </Card.Header>
        <Card.Body>
          {orden.estado_pago === 'rechazado' && (
            <>
              <Alert variant="warning">
                <FaExclamationTriangle className="me-2" />
                <strong>Tu comprobante anterior fue rechazado:</strong> {orden.motivo_rechazo}
                <br />
                Por favor, sube una nueva captura corregida.
              </Alert>
              <ComprobanteReadOnly src={orden.comprobante_pago} onExpand={() => setShowImageModal(true)} />
            </>
          )}
          <p>
            Una vez que hayas realizado el pago siguiendo las instrucciones de arriba,
            sube aquí la captura de pantalla para que podamos confirmarlo.
          </p>
          <Form onSubmit={handleUpload}>
            <Form.Group controlId="comprobante_pago" className="mb-3">
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button type="submit" className="btn-fiofibras w-100" disabled={uploading}>
              {uploading ? (
                <>
                  <Spinner as="span" size="sm" className="me-2" />
                  Subiendo...
                </>
              ) : (
                <>
                  <FaUpload className="me-2" />
                  {orden.estado_pago === 'rechazado' ? 'Subir comprobante corregido' : 'Subir comprobante de pago'}
                </>
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      {imageModal}
    </>
  );
};

export default SubirComprobantePago;

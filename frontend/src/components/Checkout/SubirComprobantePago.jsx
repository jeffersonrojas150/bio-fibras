// src/components/Checkout/SubirComprobantePago.jsx
import React, { useState } from 'react';
import { Card, Button, Alert, Form, Spinner } from 'react-bootstrap';
import { FaUpload, FaCheckCircle, FaWhatsapp, FaExclamationTriangle } from 'react-icons/fa';
import apiClient from '../../api';
import './SubirComprobantePago.css';

const SubirComprobantePago = ({ orden, onUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploaded, setUploaded] = useState(orden.estado_pago === 'en_revision');

  if (orden.estado_pago === 'pagado' || orden.estado_pago === 'cancelado') {
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
      setUploaded(true);
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

  if (uploaded) {
    return (
      <Card className="comprobante-upload-card comprobante-upload-success mt-4">
        <Card.Body className="text-center">
          <FaCheckCircle size={48} style={{ color: '#228B22' }} className="mb-3" />
          <h5>¡Comprobante recibido!</h5>
          <p className="text-muted">
            Tu pedido #{orden.numero_orden} quedó en revisión. Avísanos por WhatsApp para agilizar la confirmación.
          </p>
          <Button variant="success" href={whatsappUrl} target="_blank" className="w-100">
            <FaWhatsapp className="me-2" /> Avisar por WhatsApp
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="comprobante-upload-card mt-4">
      <Card.Header as="h5">Último paso: sube tu comprobante de pago</Card.Header>
      <Card.Body>
        {orden.estado_pago === 'rechazado' && (
          <Alert variant="warning">
            <FaExclamationTriangle className="me-2" />
            <strong>Tu comprobante anterior fue rechazado:</strong> {orden.motivo_rechazo}
            <br />
            Por favor, sube una nueva captura corregida.
          </Alert>
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
  );
};

export default SubirComprobantePago;

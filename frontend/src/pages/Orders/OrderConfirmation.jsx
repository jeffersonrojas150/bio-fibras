// src/pages/Orders/OrderConfirmation.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Table, Badge } from 'react-bootstrap';
import { FaCheckCircle, FaHome, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

// Importamos los nuevos componentes de instrucciones
import YapeInstructions from '../../components/Checkout/YapeInstructions';
import TransferInstructions from '../../components/Checkout/TransferInstructions';
import SubirComprobantePago from '../../components/Checkout/SubirComprobantePago';
import './Orders.css';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.order); // Obtenemos la orden REAL desde el estado de la navegación

  useEffect(() => {
    // Si no hay datos de la orden, es un acceso inválido. Redirigir a inicio.
    if (!order) {
      console.warn("Acceso a OrderConfirmation sin datos de orden. Redirigiendo...");
      navigate('/');
    }
  }, [order, navigate]);

  // Mientras el efecto redirige, no renderizamos nada.
  if (!order) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="order-confirmation-page">
      <Container>
        {/* Encabezado de confirmación */}
        <div className="confirmation-header text-center mb-5">
          <div className="success-icon mb-4">
            <FaCheckCircle size={80} style={{ color: '#228B22' }} />
          </div>
          <h2 className="mb-3" style={{ color: '#2c3e32' }}>¡Pedido Recibido!</h2>
          <p className="lead mb-4" style={{ color: '#6c757d' }}>
            Gracias por tu compra. Tu pedido ha sido generado.
          </p>
          <div className="order-number mb-4">
            <Alert variant="success" className="d-inline-block">
              <strong>Número de Pedido: #{order.numero_orden}</strong>
            </Alert>
          </div>
        </div>

        {/* === RENDERIZADO CONDICIONAL DE INSTRUCCIONES DE PAGO === */}
        {order.metodo_pago === 'yape' && <YapeInstructions orderNumber={order.numero_orden} />}
        {order.metodo_pago === 'transferencia' && <TransferInstructions orderNumber={order.numero_orden} />}
        {order.metodo_pago === 'mercado_pago' && (
          <Alert variant="success" className="mt-4">
            <strong>✅ Pago procesado con Mercado Pago</strong>
            <p className="mb-0 mt-2">Tu pago fue confirmado exitosamente. No necesitas realizar ninguna acción adicional.</p>
          </Alert>
        )}

        {(order.metodo_pago === 'yape' || order.metodo_pago === 'transferencia') && (
          <SubirComprobantePago orden={order} onUploaded={setOrder} />
        )}

        <Row className="mt-5">
          {/* Columna Izquierda: Detalles del Pedido */}
          <Col lg={7}>
            <Card className="order-details-card mb-4">
              <Card.Header as="h5">Detalles del Pedido</Card.Header>
              <Card.Body>
                <Table responsive borderless className="order-items-table">
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.producto_nombre}</td>
                        <td className="text-center">x {item.cantidad}</td>
                        <td className="text-end">S/ {parseFloat(item.precio_total).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="table-success">
                      <td colSpan="2" className="text-end"><strong>Total del Pedido:</strong></td>
                      <td className="text-end"><strong>S/ {parseFloat(order.total).toFixed(2)}</strong></td>
                    </tr>
                  </tfoot>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Columna Derecha: Información de Recojo */}
          <Col lg={5}>
            <Card className="shipping-info-card mb-4">
              <Card.Header as="h5">Información de Recojo</Card.Header>
              <Card.Body>
                <h6><strong>Recoge:</strong> {order.direccion.nombres} {order.direccion.apellidos}</h6>
                <p className="mb-1"><strong>DNI:</strong> {order.direccion.dni}</p>
                <p className="mb-1"><strong>Teléfono:</strong> {order.direccion.telefono}</p>
                <hr />
                <p className="mb-1"><strong>Agencia:</strong> {order.direccion.agencia_recojo}</p>
                <p className="mb-0"><strong>Dirección de Agencia:</strong> {order.direccion.direccion_agencia}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Alert variant="info" className="email-confirmation mt-4">
          <FaEnvelope className="me-2" />
          <strong>Confirmación enviada:</strong> Hemos enviado los detalles de tu pedido a tu correo electrónico.
          Ahí también encontrarás las instrucciones de pago.
        </Alert>

        <div className="text-center mt-4">
          <Button variant="primary" onClick={() => navigate('/productos')} className="btn-fiofibras">
            <FaHome className="me-2" /> Seguir Comprando
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default OrderConfirmation;
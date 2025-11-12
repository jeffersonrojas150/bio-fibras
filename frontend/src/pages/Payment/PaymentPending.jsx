// src/pages/Payment/PaymentPending.jsx
import React from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { FaClock, FaShoppingBag } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Payment.css';

const PaymentPending = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const paymentId = searchParams.get('payment_id');

    return (
        <Container className="payment-status-container">
            <Card className="payment-status-card">
                <Card.Body className="p-5 text-center">
                    <div className="pending-icon mb-4">
                        <FaClock size={80} style={{ color: '#ffc107' }} />
                    </div>

                    <h2 className="mb-3" style={{ color: '#2c3e32' }}>
                        Pago Pendiente
                    </h2>

                    <Alert variant="warning" className="mb-4">
                        Tu pago está siendo procesado. Esto puede tomar unos minutos.
                    </Alert>

                    {paymentId && (
                        <p className="text-muted mb-4">
                            <small>ID de Transacción: {paymentId}</small>
                        </p>
                    )}

                    <div className="text-muted mb-4">
                        <p>
                            <strong>Te notificaremos por correo</strong> cuando se confirme tu pago.
                        </p>
                        <p>
                            Puedes revisar el estado de tu pedido en cualquier momento.
                        </p>
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        <Button
                            variant="primary"
                            onClick={() => navigate('/perfil/ordenes')}
                            className="btn-fiofibras"
                        >
                            <FaShoppingBag className="me-2" />
                            Ver mis pedidos
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={() => navigate('/productos')}
                        >
                            Seguir Comprando
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PaymentPending;
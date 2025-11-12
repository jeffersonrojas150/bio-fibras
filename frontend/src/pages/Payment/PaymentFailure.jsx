// src/pages/Payment/PaymentFailure.jsx
import React from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import { FaTimesCircle, FaShoppingCart } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Payment.css';

const PaymentFailure = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const paymentId = searchParams.get('payment_id');
    const statusDetail = searchParams.get('status_detail');

    const getErrorMessage = () => {
        if (statusDetail === 'cc_rejected_insufficient_amount') {
            return 'Fondos insuficientes en tu tarjeta.';
        } else if (statusDetail === 'cc_rejected_bad_filled_security_code') {
            return 'Código de seguridad incorrecto.';
        } else if (statusDetail === 'cc_rejected_call_for_authorize') {
            return 'Tu banco rechazó el pago. Contacta con tu entidad bancaria.';
        }
        return 'El pago no pudo ser procesado. Por favor, intenta nuevamente.';
    };

    return (
        <Container className="payment-status-container">
            <Card className="payment-status-card">
                <Card.Body className="p-5 text-center">
                    <div className="error-icon mb-4">
                        <FaTimesCircle size={80} style={{ color: '#dc3545' }} />
                    </div>

                    <h2 className="mb-3" style={{ color: '#dc3545' }}>
                        Pago Rechazado
                    </h2>

                    <Alert variant="danger" className="mb-4">
                        {getErrorMessage()}
                    </Alert>

                    {paymentId && (
                        <p className="text-muted mb-4">
                            <small>ID de intento: {paymentId}</small>
                        </p>
                    )}

                    <div className="text-muted mb-4">
                        <p>
                            No te preocupes, tu pedido no se ha creado y no se realizó ningún cargo.
                        </p>
                        <p>
                            Puedes intentar nuevamente con otro método de pago.
                        </p>
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        <Button
                            variant="primary"
                            onClick={() => navigate('/checkout')}
                            className="btn-fiofibras"
                        >
                            <FaShoppingCart className="me-2" />
                            Volver al Checkout
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

export default PaymentFailure;
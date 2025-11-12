// src/pages/Payment/PaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { obtenerDetalleOrden } from '../../services/mercadoPagoService';
import './Payment.css';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    // Mercado Pago devuelve estos parámetros en la URL
    const paymentId = searchParams.get('payment_id');
    const preferenceId = searchParams.get('preference_id');
    const merchantOrderId = searchParams.get('merchant_order_id');

    useEffect(() => {
        const verificarPago = async () => {
            // Esperamos un poco para dar tiempo al webhook de procesar
            await new Promise(resolve => setTimeout(resolve, 2000));

            try {
                // Aquí podrías obtener la orden desde el backend usando el preference_id
                // Por ahora mostramos un mensaje genérico
                setLoading(false);
            } catch (err) {
                console.error('Error al verificar el pago:', err);
                setError('No pudimos verificar tu pago. Por favor, revisa tu email o contacta con soporte.');
                setLoading(false);
            }
        };

        if (paymentId) {
            verificarPago();
        } else {
            setError('No se encontró información del pago.');
            setLoading(false);
        }
    }, [paymentId]);

    if (loading) {
        return (
            <Container className="payment-status-container">
                <Card className="payment-status-card text-center">
                    <Card.Body className="p-5">
                        <Spinner animation="border" variant="primary" className="mb-3" />
                        <h4>Verificando tu pago...</h4>
                        <p className="text-muted">Por favor espera un momento</p>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="payment-status-container">
                <Card className="payment-status-card">
                    <Card.Body className="p-5 text-center">
                        <Alert variant="warning">{error}</Alert>
                        <Button onClick={() => navigate('/perfil/ordenes')} className="btn-fiofibras">
                            Ver mis pedidos
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    return (
        <Container className="payment-status-container">
            <Card className="payment-status-card">
                <Card.Body className="p-5 text-center">
                    <div className="success-icon mb-4">
                        <FaCheckCircle size={80} style={{ color: '#28a745' }} />
                    </div>

                    <h2 className="mb-3" style={{ color: '#2c3e32' }}>
                        ¡Pago Exitoso!
                    </h2>

                    <p className="lead mb-4">
                        Tu pago ha sido procesado correctamente por Mercado Pago.
                    </p>

                    {paymentId && (
                        <Alert variant="info" className="mb-4">
                            <strong>ID de Transacción:</strong> {paymentId}
                        </Alert>
                    )}

                    <div className="text-muted mb-4">
                        <p>
                            <strong>✅ Recibirás un correo de confirmación</strong> con los detalles de tu pedido.
                        </p>
                        <p>
                            El administrador procesará tu orden y te notificaremos cuando sea enviada.
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

export default PaymentSuccess;
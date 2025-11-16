import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../api';
import './Payment.css';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [intentos, setIntentos] = useState(0);

    const paymentId = searchParams.get('payment_id');
    const maxIntentos = 10;

    useEffect(() => {
        const verificarOrden = async () => {
            if (!paymentId) {
                setError('No se encontró información del pago.');
                setLoading(false);
                return;
            }

            try {
                const response = await apiClient.get(`/ordenes/?mercado_pago_payment_id=${paymentId}`);

                if (response.data.results && response.data.results.length > 0) {
                    setOrder(response.data.results[0]);
                    setLoading(false);
                } else {
                    if (intentos < maxIntentos) {
                        setTimeout(() => {
                            setIntentos(prev => prev + 1);
                        }, 2000);
                    } else {
                        setError('Tu pago fue procesado correctamente, pero estamos procesando tu orden. Revisa tu email en unos minutos.');
                        setLoading(false);
                    }
                }
            } catch (err) {
                console.error('Error al verificar la orden:', err);

                if (intentos < maxIntentos) {
                    setTimeout(() => {
                        setIntentos(prev => prev + 1);
                    }, 2000);
                } else {
                    setError('Tu pago fue procesado correctamente. Recibirás un email de confirmación en breve.');
                    setLoading(false);
                }
            }
        };

        verificarOrden();
    }, [paymentId, intentos]);

    if (loading) {
        return (
            <Container className="payment-status-container">
                <Card className="payment-status-card text-center">
                    <Card.Body className="p-5">
                        <Spinner animation="border" variant="success" className="mb-3" />
                        <h4>Procesando tu pedido...</h4>
                        <p className="text-muted">
                            Tu pago fue exitoso. Estamos creando tu orden.
                        </p>
                        <small className="text-muted">Esto puede tomar unos segundos...</small>
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
                        <div className="success-icon mb-4">
                            <FaCheckCircle size={80} style={{ color: '#28a745' }} />
                        </div>

                        <h2 className="mb-3" style={{ color: '#2c3e32' }}>
                            ¡Pago Exitoso!
                        </h2>

                        <Alert variant="info">{error}</Alert>

                        {paymentId && (
                            <p className="text-muted mb-4">
                                <small>ID de Transacción: {paymentId}</small>
                            </p>
                        )}

                        <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                            <Button onClick={() => navigate('/mis-ordenes')} className="btn-fiofibras">
                                <FaShoppingBag className="me-2" />
                                Ver mis pedidos
                            </Button>
                            <Button variant="outline-secondary" onClick={() => navigate('/productos')}>
                                Seguir Comprando
                            </Button>
                        </div>
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
                        ¡Pedido Confirmado!
                    </h2>

                    <p className="lead mb-4">
                        Tu pago ha sido procesado correctamente.
                    </p>

                    {order && (
                        <Alert variant="success" className="mb-4">
                            <strong>Orden #{order.numero_orden}</strong>
                            <br />
                            <small>Total: S/ {parseFloat(order.total).toFixed(2)}</small>
                        </Alert>
                    )}

                    {paymentId && (
                        <p className="text-muted mb-4">
                            <small>ID de Transacción: {paymentId}</small>
                        </p>
                    )}

                    <div className="text-muted mb-4">
                        <p>
                            <strong>✅ Hemos enviado un correo de confirmación</strong> con los detalles de tu pedido.
                        </p>
                        <p>
                            Te notificaremos cuando tu orden sea enviada.
                        </p>
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        <Button
                            variant="primary"
                            onClick={() => navigate('/mis-ordenes')}
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
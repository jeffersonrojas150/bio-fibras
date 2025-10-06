import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge, Table } from 'react-bootstrap';
import { FaArrowLeft, FaBox, FaUser, FaTruck, FaCreditCard } from 'react-icons/fa';
import apiClient from '../../api';
import './Orders.css'; // Usaremos el mismo CSS de MyOrders y añadiremos más estilos después

const OrderDetail = () => {
    // useParams nos permite leer los parámetros de la URL, en este caso, el 'orderId'
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Esta función se ejecuta cuando el componente se monta
        const fetchOrderDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                // Hacemos la llamada al endpoint de detalle de la orden usando el ID de la URL
                const response = await apiClient.get(`/ordenes/${orderId}/`);
                setOrder(response.data);
            } catch (err) {
                console.error("Error al cargar el detalle de la orden:", err);
                setError("No pudimos encontrar los detalles de esta orden. Es posible que no te pertenezca o haya sido eliminada.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId]); // El efecto se vuelve a ejecutar si el orderId cambia

    // Función para obtener el badge de estado, similar a la de MyOrders
    const getStatusBadge = (estadoOrden, estadoPago) => {
        if (estadoPago === 'cancelado') {
            return <Badge bg="danger">Cancelado</Badge>;
        }
        const statusConfig = {
            pendiente: { text: 'Pendiente', variant: 'warning' },
            enviado: { text: 'Enviado', variant: 'info' },
            entregado: { text: 'Entregado', variant: 'success' },
        };
        const config = statusConfig[estadoOrden] || { text: 'Procesando', variant: 'secondary' };
        return <Badge bg={config.variant} className="fs-6">{config.text}</Badge>;
    };

    // Renderizado mientras carga
    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Cargando detalles de la orden...</p>
            </Container>
        );
    }

    // Renderizado si hay un error
    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
                <Link to="/mis-ordenes" className="btn btn-outline-primary">
                    <FaArrowLeft className="me-2" /> Volver a Mis Órdenes
                </Link>
            </Container>
        );
    }

    // Renderizado principal una vez que tenemos los datos
    return (
        <div className="order-confirmation-page">
            <Container className="py-5">
                <Link to="/mis-ordenes" className="btn btn-outline-dark mb-4">
                    <FaArrowLeft className="me-2" /> Volver a Mis Órdenes
                </Link>

                <Row>
                    <Col lg={8}>
                        {/* Detalles del Pedido y Items */}
                        <Card className="order-details-card mb-4">
                            <Card.Header as="h5">Detalles del Pedido #{order?.numero_orden}</Card.Header>
                            <Card.Body>
                                <Table responsive borderless className="order-items-table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th className="text-center">Cantidad</th>
                                            <th className="text-center">Precio Unit.</th>
                                            <th className="text-end">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order?.items.map(item => (
                                            <tr key={item.id}>
                                                <td>
                                                    <div className="order-item-display">
                                                        {item.producto_imagen ? (
                                                            <img src={item.producto_imagen} alt={item.producto_nombre} className="order-item-thumbnail" />
                                                        ) : (
                                                            <div className="order-item-thumbnail-placeholder">
                                                                <i className="bi bi-image-fill text-muted"></i>
                                                            </div>
                                                        )}
                                                        <span>{item.producto_nombre}</span>
                                                    </div>
                                                </td>
                                                <td className="text-center">{item.cantidad}</td>
                                                <td className="text-center">S/ {parseFloat(item.precio_unitario).toFixed(2)}</td>
                                                <td className="text-end">S/ {parseFloat(item.precio_total).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="table-success">
                                            <td colSpan="3" className="text-end"><strong>Total del Pedido:</strong></td>
                                            <td className="text-end"><strong>S/ {parseFloat(order?.total).toFixed(2)}</strong></td>
                                        </tr>
                                    </tfoot>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4}>
                        {/* Resumen e Información de Envío */}
                        <Card className="shipping-info-card mb-4">
                            <Card.Header as="h5"><FaBox className="me-2" />Resumen</Card.Header>
                            <Card.Body>
                                <p><strong>Fecha:</strong> {new Date(order?.fecha_creacion).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                <p className="d-flex justify-content-between align-items-center">
                                    <strong>Estado:</strong>
                                    {getStatusBadge(order?.estado_orden, order?.estado_pago)}
                                </p>
                                <hr />
                                <h6><FaCreditCard className="me-2" />Método de Pago</h6>
                                <p>{order?.metodo_pago === 'transferencia' ? 'Transferencia Bancaria' : 'Yape'}</p>
                            </Card.Body>
                        </Card>

                        <Card className="shipping-info-card mb-4">
                            <Card.Header as="h5"><FaTruck className="me-2" />Información de Recojo</Card.Header>
                            <Card.Body>
                                <h6><FaUser className="me-2" />Recibe:</h6>
                                <p className="mb-1">{order?.direccion?.nombres} {order?.direccion?.apellidos}</p>
                                <p className="mb-1"><strong>DNI:</strong> {order?.direccion?.dni}</p>
                                <p><strong>Teléfono:</strong> {order?.direccion?.telefono}</p>
                                <hr />
                                <h6>Agencia:</h6>
                                <p className="mb-1"><strong>{order?.direccion?.agencia_recojo}</strong></p>
                                <p className="mb-0">{order?.direccion?.direccion_agencia}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default OrderDetail;
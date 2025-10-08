// src/pages/Orders/MyOrders.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
// CAMBIO: Importamos apiClient para hacer la llamada al backend
import apiClient from '../../api';
import './MyOrders.css';


const MyOrders = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // CAMBIO: El estado de 'orders' empieza vacío.
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CAMBIO: Los filtros ahora usan los estados reales del backend en español.
  const [filter, setFilter] = useState('all'); // all, pendiente, enviado, entregado


  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }


    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // CAMBIO: Hacemos la llamada real a la API.
        const response = await apiClient.get('/ordenes/');
        // Los datos paginados de DRF vienen en 'results'.
        setOrders(response.data.results || response.data);
      } catch (err) {
        console.error('Error al cargar órdenes:', err);
        setError("No pudimos cargar tu historial de órdenes. Inténtalo de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };


    fetchOrders();
  }, [isAuthenticated, navigate]); // El useEffect se ejecuta si el estado de autenticación cambia.


  // CAMBIO: La función getStatusBadge ahora mapea los estados del backend.
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
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };


  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'cancelado') return order.estado_pago === 'cancelado';
    return order.estado_orden === filter && order.estado_pago !== 'cancelado';
  });


  if (loading) {
    return (
      <Container className="my-orders-page py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-2">Cargando tus órdenes...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-orders-page py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }


  return (
    <Container className="my-orders-page py-5">
      <Row>
        <Col lg={12}>
          <div className="page-header mb-4">
            <h1 className="page-title">Mis Órdenes</h1>
            <p className="page-subtitle">Aquí puedes ver el historial de tus compras</p>
          </div>


          {/* CAMBIO: Los filtros ahora reflejan los estados del backend */}
          <div className="orders-filters mb-4">
            <Button
              variant={filter === 'all' ? 'mustard' : 'outline-mustard'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'btn-mustard' : 'btn-outline-mustard'}
            >
              Todas
            </Button>


            <Button
              variant={filter === 'pendiente' ? 'warning' : 'outline-warning'}
              onClick={() => setFilter('pendiente')}
            >
              Pendientes
            </Button>
            <Button
              variant={filter === 'enviado' ? 'info' : 'outline-info'}
              onClick={() => setFilter('enviado')}
            >
              Enviadas
            </Button>
            <Button
              variant={filter === 'entregado' ? 'success' : 'outline-success'}
              onClick={() => setFilter('entregado')}
            >
              Entregadas
            </Button>
            <Button
              variant={filter === 'cancelado' ? 'danger' : 'outline-danger'}
              onClick={() => setFilter('cancelado')}
            >
              Canceladas
            </Button>
          </div>


          {filteredOrders.length === 0 ? (
            <Card className="empty-orders text-center p-5">
              <i className="bi bi-bag-x empty-icon"></i>
              <h3>No tienes órdenes en esta categoría</h3>
              <p className="text-muted mb-4">
                {filter === 'all'
                  ? 'Aún no has realizado ninguna compra.'
                  : `No se encontraron órdenes con el estado seleccionado.`
                }
              </p>
              <Link to="/productos" className="btn btn-mustard">
                Explorar Productos
              </Link>

            </Card>
          ) : (
            <div className="orders-list">
              {filteredOrders.map(order => (
                <Card key={order.id} className="order-card mb-4">
                  <Card.Body>
                    <Row className="align-items-center mb-3">
                      <Col md={6}>
                        <div className="order-header">
                          {/* CAMBIO: Usamos los campos reales de la API */}
                          <h5 className="order-id mb-1">Orden #{order.numero_orden}</h5>
                          <p className="order-date text-muted mb-0">
                            <i className="bi bi-calendar3 me-2"></i>
                            {new Date(order.fecha_creacion).toLocaleDateString('es-PE', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                        </div>
                      </Col>
                      <Col md={6} className="text-md-end">
                        {/* CAMBIO: Pasamos ambos estados para determinar el badge correcto */}
                        {getStatusBadge(order.estado_orden, order.estado_pago)}
                      </Col>
                    </Row>


                    <div className="order-items mb-3">
                      {order.items.map(item => (
                        <div key={item.id} className="order-item d-flex align-items-center mb-2">
                          <div className="item-image me-3">
                            {item.producto_imagen ? (
                              <img src={item.producto_imagen} alt={item.producto_nombre} />
                            ) : (
                              <i className="bi bi-image-fill text-muted fs-3"></i>
                            )}
                          </div>
                          <div className="item-info flex-grow-1">
                            {/* CAMBIO: Usamos los campos de item de la API */}
                            <p className="item-name mb-0">{item.producto_nombre}</p>
                            <small className="text-muted">Cantidad: {item.cantidad}</small>
                          </div>
                          <div className="item-price">
                            <strong>S/ {parseFloat(item.precio_total).toFixed(2)}</strong>
                          </div>
                        </div>
                      ))}
                    </div>


                    <div className="order-footer d-flex justify-content-between align-items-center pt-3 border-top">
                      <div className="order-total">
                        <span className="text-muted me-2">Total:</span>
                        <strong className="total-amount">S/ {parseFloat(order.total).toFixed(2)}</strong>
                      </div>
                      <div className="order-actions">
                        {/* CAMBIO: El enlace ahora va al detalle de la orden real */}
                        <Button
                          variant="outline-success"
                          size="sm"
                          as={Link}
                          to={`/ordenes/${order.id}`} // Usamos el ID numérico de la orden para la URL
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};


export default MyOrders;
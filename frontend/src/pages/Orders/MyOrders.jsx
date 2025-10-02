// src/pages/Orders/MyOrders.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import './MyOrders.css';

const MyOrders = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed, cancelled

  useEffect(() => {
    // Redirigir si no está autenticado
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Simular carga de órdenes (aquí conectarás tu API)
    const fetchOrders = async () => {
      try {
        // TODO: Aquí irá tu llamada a la API
        // const response = await fetch(`tu-api/orders?userId=${user.id}`);
        
        // Datos simulados
        const mockOrders = [
          {
            id: 'ORD-2024-001',
            date: '2024-10-01',
            status: 'completed',
            total: 150.00,
            items: [
              { id: 1, name: 'Lámpara de Bambú', quantity: 1, price: 80.00, image: '/path/to/image1.jpg' },
              { id: 2, name: 'Tapete Natural', quantity: 2, price: 35.00, image: '/path/to/image2.jpg' }
            ]
          },
          {
            id: 'ORD-2024-002',
            date: '2024-09-28',
            status: 'pending',
            total: 95.00,
            items: [
              { id: 3, name: 'Espejo Decorativo', quantity: 1, price: 95.00, image: '/path/to/image3.jpg' }
            ]
          },
          {
            id: 'ORD-2024-003',
            date: '2024-09-15',
            status: 'cancelled',
            total: 45.00,
            items: [
              { id: 4, name: 'Cesta de Mimbre', quantity: 1, price: 45.00, image: '/path/to/image4.jpg' }
            ]
          }
        ];

        setOrders(mockOrders);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar órdenes:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate, user]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { text: 'Pendiente', variant: 'warning' },
      completed: { text: 'Completada', variant: 'success' },
      cancelled: { text: 'Cancelada', variant: 'danger' },
      processing: { text: 'En Proceso', variant: 'info' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <Container className="my-orders-page py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
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

          {/* Filtros */}
          <div className="orders-filters mb-4">
            <Button 
              variant={filter === 'all' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('all')}
              className="me-2"
            >
              Todas
            </Button>
            <Button 
              variant={filter === 'pending' ? 'warning' : 'outline-warning'}
              onClick={() => setFilter('pending')}
              className="me-2"
            >
              Pendientes
            </Button>
            <Button 
              variant={filter === 'completed' ? 'success' : 'outline-success'}
              onClick={() => setFilter('completed')}
              className="me-2"
            >
              Completadas
            </Button>
            <Button 
              variant={filter === 'cancelled' ? 'danger' : 'outline-danger'}
              onClick={() => setFilter('cancelled')}
            >
              Canceladas
            </Button>
          </div>

          {/* Lista de órdenes */}
          {filteredOrders.length === 0 ? (
            <Card className="empty-orders text-center p-5">
              <i className="bi bi-bag-x empty-icon"></i>
              <h3>No tienes órdenes</h3>
              <p className="text-muted mb-4">
                {filter === 'all' 
                  ? 'Aún no has realizado ninguna compra'
                  : `No tienes órdenes con el estado: ${filter}`
                }
              </p>
              <Link to="/productos" className="btn btn-primary">
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
                          <h5 className="order-id mb-1">Orden #{order.id}</h5>
                          <p className="order-date text-muted mb-0">
                            <i className="bi bi-calendar3 me-2"></i>
                            {new Date(order.date).toLocaleDateString('es-PE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </Col>
                      <Col md={6} className="text-md-end">
                        {getStatusBadge(order.status)}
                      </Col>
                    </Row>

                    <div className="order-items mb-3">
                      {order.items.map(item => (
                        <div key={item.id} className="order-item d-flex align-items-center mb-2">
                          <div className="item-image me-3">
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div className="item-info flex-grow-1">
                            <p className="item-name mb-0">{item.name}</p>
                            <small className="text-muted">Cantidad: {item.quantity}</small>
                          </div>
                          <div className="item-price">
                            <strong>S/ {item.price.toFixed(2)}</strong>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer d-flex justify-content-between align-items-center pt-3 border-top">
                      <div className="order-total">
                        <span className="text-muted me-2">Total:</span>
                        <strong className="total-amount">S/ {order.total.toFixed(2)}</strong>
                      </div>
                      <div className="order-actions">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          as={Link}
                          to={`/orden/${order.id}`}
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
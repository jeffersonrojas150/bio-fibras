import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useAuth } from '../../context/authContext';
import { FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import './ProfilePage.css';

const ProfilePage = () => {
    const { isAuthenticated, loading } = useAuth();

    // Mientras se verifica la autenticación, no mostramos nada para evitar parpadeos
    if (loading) {
        return null; // O un spinner a pantalla completa si lo prefieres
    }

    // Si el usuario no está autenticado, lo redirigimos al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="profile-page">
            <Container className="py-5">
                <Row>
                    {/* Columna del Menú Lateral */}
                    <Col lg={3} className="mb-4">
                        <Card className="profile-menu-card">
                            <Card.Header as="h5">Mi Cuenta</Card.Header>
                            <nav className="profile-nav">
                                <NavLink to="/perfil/datos" className="profile-nav-link">
                                    <FaUser className="me-2" /> Datos Personales
                                </NavLink>
                                <NavLink to="/perfil/direcciones" className="profile-nav-link">
                                    <FaMapMarkerAlt className="me-2" /> Mis Direcciones
                                </NavLink>
                                {/* Aquí podríamos añadir más enlaces en el futuro, como "Cambiar Contraseña" */}
                            </nav>
                        </Card>
                    </Col>

                    {/* Columna del Contenido Principal */}
                    <Col lg={9}>
                        {/* El componente Outlet renderizará la sub-ruta activa */}
                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ProfilePage;
import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/authContext';
import apiClient from '../../api';

const PersonalData = () => {
    // Obtenemos el usuario actual y la función para actualizarlo desde el contexto de autenticación
    const { user, updateUser } = useAuth();

    // El estado del formulario se inicializa con los datos del usuario del contexto
    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '', // El email se muestra pero no se edita
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        // Preparamos el payload solo con los campos que queremos actualizar
        const payload = {
            first_name: formData.first_name,
            last_name: formData.last_name,
        };

        try {
            // Hacemos una petición PATCH a /auth/perfil/. 
            // PATCH es ideal para actualizaciones parciales.
            const response = await apiClient.patch('/auth/perfil/', payload);

            // Si la API responde con éxito, actualizamos el estado global del usuario
            updateUser(response.data);

            setSuccess('¡Tus datos han sido actualizados con éxito!');

        } catch (err) {
            console.error("Error al actualizar los datos:", err.response?.data);
            setError('No se pudieron actualizar tus datos. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <Card.Header as="h5">Datos Personales</Card.Header>
            <Card.Body>
                <Form noValidate onSubmit={handleSubmit}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombres</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Apellidos</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-4">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            disabled
                            title="El correo electrónico no se puede modificar."
                        />
                        <Form.Text className="text-muted">
                            El correo electrónico está asociado a tu cuenta y no puede ser modificado.
                        </Form.Text>
                    </Form.Group>

                    <div className="text-end">
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Spinner as="span" size="sm" className="me-2" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default PersonalData;
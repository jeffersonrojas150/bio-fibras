// src/pages/Contact/Contact.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FaEnvelope, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import apiClient from '../../api';
import { useAuth } from '../../context/authContext';
import './Contact.css'; // Crearemos este archivo a continuación

const Contact = () => {

    const { user, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                name: user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.username,
                email: user.email
            }));
        }
    }, [isAuthenticated, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error del campo al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Tu nombre es requerido.';
        if (!formData.email.trim()) {
            newErrors.email = 'Tu correo electrónico es requerido.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El formato del correo no es válido.';
        }
        if (!formData.subject.trim()) newErrors.subject = 'El asunto es requerido.';
        if (!formData.message.trim()) newErrors.message = 'El mensaje no puede estar vacío.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setApiError('');

        try {
            await apiClient.post('/contacto/', formData);
            setSuccess(true); // Si la llamada es exitosa, mostramos el mensaje de éxito
        } catch (err) {
            console.error("Error al enviar el formulario de contacto:", err.response?.data || err);
            setApiError("Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    // Si el formulario se envió con éxito, mostramos este mensaje
    if (success) {
        return (
            <div className="contact-page">
                <Container className="success-container text-center">
                    <FaCheckCircle className="success-icon mb-4" />
                    <h1 className="success-title">¡Mensaje Enviado!</h1>
                    <p className="success-text">
                        Gracias por ponerte en contacto con nosotros. Hemos recibido tu mensaje y te responderemos lo antes posible.
                    </p>
                    <Button variant="primary" href="/" className="btn-fiofibras mt-3">
                        Volver al Inicio
                    </Button>
                </Container>
            </div>
        );
    }

    // Renderizado del formulario principal
    return (
        <div className="contact-page">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <div className="contact-form-container">
                            <div className="contact-header text-center">
                                <FaEnvelope className="header-icon" />
                                <h1 className="page-title">Contáctanos</h1>
                                <p className="page-subtitle">
                                    ¿Tienes alguna pregunta, sugerencia o problema? Estamos aquí para ayudarte.
                                </p>
                            </div>

                            <Form noValidate onSubmit={handleSubmit}>
                                {apiError && <Alert variant="danger">{apiError}</Alert>}

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Tu Nombre</Form.Label>
                                            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} isInvalid={!!errors.name} placeholder="Ingresa tu nombre completo" readOnly={isAuthenticated} />
                                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label>Tu Correo Electrónico</Form.Label>
                                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email} placeholder="ejemplo@correo.com" readOnly={isAuthenticated} />
                                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>Asunto</Form.Label>
                                    <Form.Control type="text" name="subject" value={formData.subject} onChange={handleChange} isInvalid={!!errors.subject} placeholder="Ej: Problema con mi pedido #12345" />
                                    <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Mensaje</Form.Label>
                                    <Form.Control as="textarea" name="message" value={formData.message} onChange={handleChange} isInvalid={!!errors.message} rows={6} placeholder="Describe tu consulta aquí..." />
                                    <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                                </Form.Group>

                                <div className="text-center">
                                    <Button variant="primary" type="submit" className="btn-fiofibras btn-submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane className="me-2" />
                                                Enviar Mensaje
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Contact;
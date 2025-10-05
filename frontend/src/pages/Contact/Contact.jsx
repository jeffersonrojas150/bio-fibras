// src/pages/Contact/Contact.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';

import { FaEnvelope, FaPaperPlane, FaCheckCircle, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaTiktok, FaInstagram, FaFacebook } from 'react-icons/fa';
import apiClient from '../../api';
import { useAuth } from '../../context/authContext';
import './Contact.css'; 

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
            setSuccess(true);
        } catch (err) {
            console.error("Error al enviar el formulario de contacto:", err.response?.data || err);
            setApiError("Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    // Mensaje de éxito
    if (success) {
        return (
            <div className="contact-page">
                <Container className="contact-success-container text-center">
                    <FaCheckCircle className="contact-success-icon mb-4" />
                    <h1 className="contact-success-title">¡Mensaje Enviado!</h1>
                    <p className="contact-success-text">
                        Gracias por ponerte en contacto con nosotros. Hemos recibido tu mensaje y te responderemos lo antes posible.
                    </p>
                    <Button variant="primary" href="/" className="btn-fiofibras mt-3">
                        Volver al Inicio
                    </Button>
                </Container>
            </div>
        );
    }

    // Renderizado del formulario principal con la información de contacto
    return (
        <div className="contact-page">
            <Container>
                <div className="contact-header text-center">
                    <FaEnvelope className="contact-header-icon" />
                    <h1 className="contact-page-title">Contáctanos</h1>
                    <p className="contact-page-subtitle">
                        ¿Tienes alguna pregunta, sugerencia o problema? Estamos aquí para ayudarte.
                    </p>
                </div>

                <Row className="contact-main-content">
                    {/* COLUMNA DE INFORMACIÓN DE CONTACTO */}
                    <Col lg={5} className="order-2 order-lg-1 mb-5 mb-lg-0">
                        <div className="contact-info-wrapper">
                            <h3 className="contact-info-title">Información de Contacto</h3>
                            <p className="contact-info-intro">
                                Si prefieres, puedes usar cualquiera de estos medios para comunicarte directamente con nosotros.
                            </p>
                            <ul className="contact-info-list">
                                <li>
                                    <FaEnvelope className="contact-info-icon" />
                                    <div>
                                        <strong>Email de Soporte</strong>
                                        <a href="mailto:bio.fibras.j@gmail.com">bio.fibras.j@gmail.com</a>
                                    </div>
                                </li>
                                <li>
                                    <FaPhoneAlt className="contact-info-icon" />
                                    <div>
                                        <strong>Teléfono</strong>
                                        <span>+51 910 881 837</span>
                                    </div>
                                </li>
                                 <li>
                                    <FaClock className="contact-info-icon" />
                                    <div>
                                        <strong>Horario de Atención</strong>
                                        <span>Lunes a Viernes, 9am - 6pm</span>
                                    </div>
                                </li>
                                <li>
                                    <FaMapMarkerAlt className="contact-info-icon" />
                                    <div>
                                        <strong>Oficina Central</strong>
                                        <span>Vichayal, La Arena<br/>Piura, Perú</span>
                                    </div>
                                </li>
                            </ul>
                            <h3 className="contact-social-title">Síguenos en Redes</h3>
                            <div className="contact-social-icons">
                                
                                <a href="https://www.tiktok.com/@biofibras?_t=ZS-90IwoipsWGe&_r=1" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok /></a>
                                <a href="https://www.instagram.com/biofibras_artesania?igsh=NTJoZXJheGJidzV0&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                                <a href="https://www.facebook.com/profile.php?id=100009194640365&mibextid=wwXIfr&mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
                            </div>
                        </div>
                    </Col>

                    {/* COLUMNA DEL FORMULARIO */}
                    <Col lg={7} className="order-1 order-lg-2">
                        <div className="contact-form-wrapper">
                            <Form noValidate onSubmit={handleSubmit}>
                                {apiError && <Alert variant="danger">{apiError}</Alert>}

                                
                                    <h3 className="contact-info-title1">Envianos un mensaje directo</h3>
                                    
                                        <Form.Group className="mb-4">
                                            <Form.Label>Tu Nombre</Form.Label>
                                            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} isInvalid={!!errors.name} placeholder="Ingresa tu nombre completo" readOnly={isAuthenticated} />
                                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                        </Form.Group>
                                    
                                        <Form.Group className="mb-4">
                                            <Form.Label>Tu Correo Electrónico</Form.Label>
                                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email} placeholder="ejemplo@correo.com" readOnly={isAuthenticated} />
                                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                        </Form.Group>
                                

                                <Form.Group className="mb-4">
                                    <Form.Label>Asunto</Form.Label>
                                    <Form.Control type="text" name="subject" value={formData.subject} onChange={handleChange} isInvalid={!!errors.subject} placeholder="Ej: Problema con mi pedido #12345" />
                                    <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Mensaje</Form.Label>
                                    <Form.Control as="textarea" name="message" value={formData.message} onChange={handleChange} isInvalid={!!errors.message} rows={5} placeholder="Describe tu consulta aquí..." />
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
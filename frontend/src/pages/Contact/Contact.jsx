// src/pages/Contact/Contact.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Spinner, Alert } from 'react-bootstrap';
import {
    FaEnvelope, FaPaperPlane, FaCheckCircle,
    FaPhoneAlt, FaMapMarkerAlt, FaClock,
    FaTiktok, FaInstagram, FaFacebook, FaWhatsapp
} from 'react-icons/fa';
import apiClient from '../../api';
import { useAuth } from '../../context/authContext';
import heroImg from '../../assets/contact-hero.png';
import './Contact.css';

const Contact = () => {
    const { user, isAuthenticated } = useAuth();
    const formRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', subject: '', message: ''
    });
    const [errors, setErrors]     = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess]   = useState(false);
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                name:  user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.username,
                email: user.email
            }));
        }
    }, [isAuthenticated, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim())    newErrors.name    = 'Tu nombre es requerido.';
        if (!formData.email.trim()) {
            newErrors.email = 'Tu correo electrónico es requerido.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El formato del correo no es válido.';
        }
        if (formData.phone && !/^[+\d\s\-()]{7,20}$/.test(formData.phone)) {
            newErrors.phone = 'Ingresa un número de teléfono válido.';
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
            console.error('Error al enviar formulario:', err.response?.data || err);
            setApiError('Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="cp-page">
                <div className="cp-success-wrap">
                    <FaCheckCircle style={{ fontSize: '3rem', color: '#28a745', marginBottom: '1rem' }} />
                    <h1 className="cp-success-title">¡Mensaje Enviado!</h1>
                    <p className="cp-success-text">
                        Gracias por ponerte en contacto con nosotros. Hemos recibido tu mensaje
                        y te responderemos lo antes posible.
                    </p>
                    <a href="/" className="cp-submit-btn" style={{ textDecoration: 'none', width: 'auto' }}>
                        Volver al Inicio
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="cp-page">

            {/* HERO  */}
            <div className="cp-hero">
                {/* Imagen de fondo */}
                <div
                    className="cp-hero-bg-img"
                    style={{ backgroundImage: `url(${heroImg})` }}
                />

                {/* Contenido centrado */}
                <div className="cp-hero-inner">
                    <span className="cp-hero-tag">✦ Estamos para ti ✦</span>
                    <h1 className="cp-hero-title">Contáctanos</h1>
                    <p className="cp-hero-sub">
                        ¿Tienes alguna pregunta, sugerencia o problema?<br />
                        Escríbenos y con gusto te atenderemos ♥
                    </p>
                </div>

                {/* Raya dorada al fondo del hero */}
                <div className="cp-hero-divider" />
            </div>

            {/* GRID PRINCIPAL */}
            <Container className="cp-container">
                <div className="cp-grid">

                    {/* INFO DE CONTACTO */}
                    <div className="cp-left">
                        <div className="cp-info-card">
                            <h2 className="cp-section-title">Información de Contacto</h2>
                            <p className="cp-info-intro">
                                Usa cualquiera de estos medios para comunicarte directamente con nosotros.
                            </p>

                            <div className="cp-info-items">
                                <div className="cp-info-item">
                                    <span className="cp-info-icon-wrap"><FaEnvelope /></span>
                                    <div>
                                        <strong>Email de Soporte</strong>
                                        <a href="mailto:bio.fibras.j@gmail.com">bio.fibras.j@gmail.com</a>
                                    </div>
                                </div>
                                <div className="cp-info-item">
                                    <span className="cp-info-icon-wrap"><FaPhoneAlt /></span>
                                    <div>
                                        <strong>Teléfono / WhatsApp</strong>
                                        <a href="https://wa.me/51910881837" target="_blank" rel="noopener noreferrer">
                                            +51 910 881 837
                                        </a>
                                    </div>
                                </div>
                                <div className="cp-info-item">
                                    <span className="cp-info-icon-wrap"><FaClock /></span>
                                    <div>
                                        <strong>Horario de Atención</strong>
                                        <span>Lunes a Viernes, 9:00 AM – 6:00 PM</span>
                                    </div>
                                </div>
                                <div className="cp-info-item">
                                    <span className="cp-info-icon-wrap"><FaMapMarkerAlt /></span>
                                    <div>
                                        <strong>Oficina Central</strong>
                                        <span>Vichayal, La Arena<br />Piura, Perú</span>
                                    </div>
                                </div>
                            </div>

                            <div className="cp-wa-btn-wrap">
                                <a
                                    href="https://wa.me/51910881837"
                                    target="_blank" rel="noopener noreferrer"
                                    className="cp-wa-btn"
                                >
                                    <FaWhatsapp />
                                    Escríbenos por WhatsApp
                                </a>
                            </div>

                            <div className="cp-social-section">
                                <h3 className="cp-social-title">Síguenos en Redes</h3>
                                <div className="cp-social-row">
                                    <a href="https://www.tiktok.com/@biofibras?_t=ZS-90IwoipsWGe&_r=1"
                                       target="_blank" rel="noopener noreferrer"
                                       aria-label="TikTok" className="cp-social-link">
                                        <FaTiktok />
                                    </a>
                                    <a href="https://www.instagram.com/biofibras_artesania?igsh=NTJoZXJheGJidzV0&utm_source=qr"
                                       target="_blank" rel="noopener noreferrer"
                                       aria-label="Instagram" className="cp-social-link">
                                        <FaInstagram />
                                    </a>
                                    <a href="https://www.facebook.com/profile.php?id=100009194640365&mibextid=wwXIfr"
                                       target="_blank" rel="noopener noreferrer"
                                       aria-label="Facebook" className="cp-social-link">
                                        <FaFacebook />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FORMULARIO */}
                    <div className="cp-right">
                        <div className="cp-form-card">
                            <h2 className="cp-section-title">Envíanos un mensaje directo</h2>
                            <p className="cp-info-intro">Completa el formulario y te responderemos a la brevedad.</p>

                            <Form noValidate onSubmit={handleSubmit} ref={formRef}>
                                {apiError && (
                                    <Alert variant="danger" className="cp-alert">{apiError}</Alert>
                                )}

                                <div className="cp-form-row">
                                    <Form.Group className="cp-form-group">
                                        <Form.Label className="cp-label">Tu Nombre</Form.Label>
                                        <Form.Control
                                            className={`cp-input${errors.name ? ' cp-input--error' : ''}`}
                                            type="text" name="name" value={formData.name}
                                            onChange={handleChange} placeholder="Ej: Juan Perez"
                                            readOnly={isAuthenticated}
                                        />
                                        {errors.name && <span className="cp-error">{errors.name}</span>}
                                    </Form.Group>

                                    <Form.Group className="cp-form-group">
                                        <Form.Label className="cp-label">
                                            Teléfono <span className="cp-optional">(opcional)</span>
                                        </Form.Label>
                                        <Form.Control
                                            className={`cp-input${errors.phone ? ' cp-input--error' : ''}`}
                                            type="tel" name="phone" value={formData.phone}
                                            onChange={handleChange} placeholder="+51 987 654 321"
                                        />
                                        {errors.phone && <span className="cp-error">{errors.phone}</span>}
                                    </Form.Group>
                                </div>

                                <Form.Group className="cp-form-group">
                                    <Form.Label className="cp-label">Correo Electrónico</Form.Label>
                                    <Form.Control
                                        className={`cp-input${errors.email ? ' cp-input--error' : ''}`}
                                        type="email" name="email" value={formData.email}
                                        onChange={handleChange} placeholder="ejemplo@correo.com"
                                        readOnly={isAuthenticated}
                                    />
                                    {errors.email && <span className="cp-error">{errors.email}</span>}
                                </Form.Group>

                                <Form.Group className="cp-form-group">
                                    <Form.Label className="cp-label">Asunto</Form.Label>
                                    <Form.Control
                                        className={`cp-input${errors.subject ? ' cp-input--error' : ''}`}
                                        type="text" name="subject" value={formData.subject}
                                        onChange={handleChange} placeholder="Ej: Problema con mi pedido #12345"
                                    />
                                    {errors.subject && <span className="cp-error">{errors.subject}</span>}
                                </Form.Group>

                                <Form.Group className="cp-form-group">
                                    <Form.Label className="cp-label">Mensaje</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        className={`cp-input cp-textarea${errors.message ? ' cp-input--error' : ''}`}
                                        name="message" value={formData.message}
                                        onChange={handleChange} rows={5}
                                        placeholder="Describe tu solicitud..."
                                    />
                                    {errors.message && <span className="cp-error">{errors.message}</span>}
                                </Form.Group>

                                <div className="cp-submit-wrap">
                                    <button type="submit" className="cp-submit-btn" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane />
                                                Enviar Mensaje
                                            </>
                                        )}
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>

                </div>
            </Container>

            {/* MAPA */}
            <div className="cp-map-fullscreen">
                <div className="cp-map-body">

                    {/* Header pegado al mapa */}
                    <div className="cp-map-header-bar">
                        <div className="cp-map-header-content">
                            <span className="cp-map-header-icon"><FaMapMarkerAlt /></span>
                            <span className="cp-map-header-title">VISITA NUESTRO TALLER</span>
                        </div>
                    </div>

                    <div className="cp-map-frame">
                        <iframe
                            title="Ubicación Biofibras"
                            width="100%"
                            height="100%"
                            style={{ border: 0, display: 'block' }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=BIOFIBRAS,Vichayal,Piura,Peru&zoom=16&language=es`}
                        />
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Contact;
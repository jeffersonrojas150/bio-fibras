// src/components/Checkout/YapeInstructions.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaWhatsapp, FaExclamationTriangle } from 'react-icons/fa';
import yapeQrImage from '../../assets/yapebiofibras.jpeg';
import './YapePayment.css';

const YapeInstructions = ({ orderNumber }) => {
    const whatsappMessage = `Hola, adjunto el voucher de mi pedido #${orderNumber} pagado por Yape.`;
    const whatsappUrl = `https://wa.me/51910881837?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="yape-payment-container mt-4">
            <div className="yape-header">
                <h6>Completa tu pago con Yape</h6>
                <p>Escanea el QR o yapea al número indicado.</p>
            </div>
            <div className="yape-qr-section">
                <img src={yapeQrImage} alt="Código QR de Yape" className="yape-qr-code" />
                <div className="yape-contact-info">
                    <div className="yape-contact-name">Jairo Jhanpier Villegas Solano</div>
                    <div className="yape-contact-phone">+51 910 881 837</div>
                </div>
            </div>
            <div className="yape-instructions">
                <h6><FaExclamationTriangle className="warning-icon" /> ¡No olvides este último paso!</h6>
                <p>Para confirmar tu compra, envía la captura de pantalla de tu pago a nuestro WhatsApp.</p>
                <Button variant="success" href={whatsappUrl} target="_blank" className="w-100">
                    <FaWhatsapp className="me-2" /> Enviar Voucher por WhatsApp
                </Button>
            </div>
        </div>
    );
};

export default YapeInstructions;
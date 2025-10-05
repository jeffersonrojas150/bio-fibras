// src/components/Checkout/TransferInstructions.jsx
import React from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { FaWhatsapp, FaExclamationTriangle } from 'react-icons/fa';

const TransferInstructions = ({ orderNumber }) => {
    const whatsappMessage = `Hola, adjunto el voucher de mi pedido #${orderNumber} pagado por Transferencia BCP.`;
    const whatsappUrl = `https://wa.me/51910881837?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <Card className="mt-4">
            <Card.Header as="h5">Completa tu pago con Transferencia BCP</Card.Header>
            <Card.Body>
                <p>Por favor, realiza la transferencia o depósito a la siguiente cuenta:</p>
                <Alert variant="info">
                    <strong>Banco:</strong> Banco de Crédito del Perú (BCP)<br />
                    <strong>Titular:</strong> Jairo Jhanpier Villegas Solano<br />
                    <strong>Cuenta de Ahorro:</strong> 47571003862030<br />
                    <strong>CCI:</strong> 00247517100386203021
                </Alert>
                <hr />
                <h6><FaExclamationTriangle style={{ color: '#ffc107' }} className="me-2" /> ¡Paso Final Importante!</h6>
                <p>Para confirmar tu compra, envía la captura de pantalla de tu pago a nuestro WhatsApp.</p>
                <Button variant="success" href={whatsappUrl} target="_blank" className="w-100">
                    <FaWhatsapp className="me-2" /> Enviar Voucher por WhatsApp
                </Button>
            </Card.Body>
        </Card>
    );
};

export default TransferInstructions;
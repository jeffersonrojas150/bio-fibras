// src/components/Checkout/TransferInstructions.jsx
import React from 'react';
import { Card, Alert } from 'react-bootstrap';

const TransferInstructions = () => {
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
            </Card.Body>
        </Card>
    );
};

export default TransferInstructions;
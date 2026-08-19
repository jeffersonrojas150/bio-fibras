// src/components/Checkout/YapeInstructions.jsx
import React from 'react';
import yapeQrImage from '../../assets/yapebiofibras.jpeg';
import './YapePayment.css';

const YapeInstructions = () => {
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
        </div>
    );
};

export default YapeInstructions;
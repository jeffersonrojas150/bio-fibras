// src/components/Checkout/OrderSummary.jsx

import React from 'react';
import { Card, Badge, Alert } from 'react-bootstrap'; // Añadimos Alert
import { FaShoppingCart, FaTruck, FaTag } from 'react-icons/fa';

const OrderSummary = ({ items = [], subtotal = 0, shipping = 0, total = 0 }) => {
  return (
    <Card className="order-summary-card">
      <Card.Header as="h5">
        <FaShoppingCart className="me-2" />
        Resumen del Pedido
        <Badge bg="success" className="ms-2">
          {items.reduce((acc, item) => acc + item.quantity, 0)} producto(s)
        </Badge>
      </Card.Header>
     
      <Card.Body className="order-summary">
        {/* Lista de productos */}
        <div className="order-items mb-3">
          {items.map((item) => {
            // === CORRECCIÓN CLAVE AQUÍ ===
            // 1. Obtenemos el precio correcto (oferta o unitario)
            const price = parseFloat(item.precio_oferta || item.precio_unitario);
            // 2. Calculamos el subtotal del item
            const itemTotal = price * item.quantity;

            return (
              <div key={item.id} className="order-item">
                <div className="order-item-image">
                  <img
                    // 3. Accedemos a la imagen correcta
                    src={item.imagen_principal}
                    alt={item.nombre}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/60x60/f8f9fa/dee2e6?text=Img'; }}
                  />
                </div>
                
                <div className="order-item-details">
                  <div className="order-item-name">
                    {/* 4. Accedemos al nombre correcto */}
                    {item.nombre}
                  </div>
                  <div className="order-item-quantity">
                    Cantidad: {item.quantity}
                  </div>
                </div>
                
                <div className="order-item-price">
                  {/* 5. Mostramos el subtotal del item calculado */}
                  S/ {itemTotal.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Totales */}
        <div className="order-totals">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>S/ {subtotal.toFixed(2)}</span>
          </div>
          
          <div className="total-row">
            <span>Envío:</span>
            {/* El valor de shipping ahora será 0, lo mostraremos como "Pago en Destino" */}
            <strong>Pago en Destino</strong>
          </div>
          
          <div className="total-row final-total">
            <strong>Total a Pagar:</strong>
            <strong>S/ {total.toFixed(2)}</strong>
          </div>
        </div>

        <Alert variant="info" className="mt-4">
          <FaTruck className="me-2" />
          El costo del envío será pagado por usted al momento de recoger el pedido en la agencia.
        </Alert>

      </Card.Body>
    </Card>
  );
};

export default OrderSummary;
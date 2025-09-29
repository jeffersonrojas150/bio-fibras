// src/components/Checkout/OrderSummary.jsx
import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaTruck, FaTag } from 'react-icons/fa';

const OrderSummary = ({ items = [], subtotal = 0, shipping = 0, total = 0 }) => {
  return (
    <Card className="order-summary-card">
      <Card.Header>
        <FaShoppingCart className="me-2" />
        Resumen del Pedido
        <Badge bg="" className="ms-2" style={{ color: '#000', backgroundColor: '#d7ad44' }}>
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </Badge>
      </Card.Header>
      
      <Card.Body className="order-summary">
        {/* Lista de productos */}
        <div className="order-items">
          {items.map((item) => (
            <div key={item.id} className="order-item">
              <div className="order-item-image">
                <img 
                  src={item.image || item.images?.[0]} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/60x60/f8f9fa/dee2e6?text=Img';
                  }}
                />
              </div>
              
              <div className="order-item-details">
                <div className="order-item-name">
                  {item.name}
                </div>
                <div className="order-item-quantity">
                  Cantidad: {item.quantity}
                </div>
                {item.category && (
                  <div className="order-item-category">
                    <FaTag size={12} className="me-1" />
                    {item.category}
                  </div>
                )}
              </div>
              
              <div className="order-item-price">
                S/ {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Totales */}
        <div className="order-totals">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>S/ {subtotal.toFixed(2)}</span>
          </div>
          
          <div className={`total-row ${shipping === 0 ? 'shipping free' : 'shipping'}`}>
            <span className="d-flex align-items-center">
              <FaTruck className="me-2" size={14} />
              Envío:
              {shipping === 0 && (
                <Badge bg="success" className="ms-2 small-badge">
                  GRATIS
                </Badge>
              )}
            </span>
            <span>
              {shipping === 0 ? 'Gratis' : `S/ ${shipping.toFixed(2)}`}
            </span>
          </div>
          
          {shipping === 0 && subtotal > 0 && (
            <div className="total-row savings">
              <span style={{ color: '#228B22', fontSize: '0.85rem' }}>
                🎉 ¡Ahorraste S/ 15 en envío!
              </span>
            </div>
          )}
          
          <div className="total-row">
            <strong>Total a Pagar:</strong>
            <strong>S/ {total.toFixed(2)}</strong>
          </div>
        </div>

        {/* Información adicional */}
        <div className="order-info mt-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div className="info-item">
            <FaTruck className="me-2" style={{ color: '#d7ad44' }} />
            <small>
              <strong>Entrega estimada:</strong> 3-5 días hábiles
            </small>
          </div>
          
          <div className="info-item mt-2">
            <FaTag className="me-2" style={{ color: '#228B22' }} />
            <small>
              <strong>Productos ecológicos</strong> certificados
            </small>
          </div>
        </div>

        {/* Cupón de descuento - placeholder para futura funcionalidad */}
        {false && ( // Deshabilitado por ahora
          <div className="coupon-section mt-3">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Código de descuento"
                style={{ fontSize: '0.9rem' }}
              />
              <button className="btn btn-outline-secondary" type="button">
                Aplicar
              </button>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default OrderSummary;
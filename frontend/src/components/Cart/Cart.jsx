// src/components/Cart/Cart.jsx
import React, { useState } from 'react';
import { Offcanvas, Button, Badge, Form } from 'react-bootstrap';
import { FaTimes, FaShoppingCart, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../../context/cartContext';
import './Cart.css';

// Componente para el icono del carrito en el header
export const CartIcon = () => {
  const { getTotalItems, toggleCart } = useCart();
  const totalItems = getTotalItems();

  return (
    <div className="nav-icon-link cart-icon-container" onClick={toggleCart}>
      <div className="cart-icon-wrapper">
        <i className="bi bi-cart nav-icon"></i>
        {totalItems > 0 && (
          <Badge bg="danger" pill className="cart-badge">
            {totalItems > 99 ? '99+' : totalItems}
          </Badge>
        )}
      </div>
    </div>
  );
};

// Componente para cada item del carrito
const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      handleRemove();
    } else {
      updateQuantity(item.id, Math.min(newQuantity, item.stock));
    }
  };

  const handleRemove = () => {
    setShowRemoveAlert(true);
    setTimeout(() => {
      removeFromCart(item.id);
      setShowRemoveAlert(false);
    }, 300);
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className={`cart-item ${showRemoveAlert ? 'removing' : ''}`}>
      <div className="cart-item-image">
        <img 
          src={item.image || item.images?.[0]} 
          alt={item.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/85x85/f8f9fa/dee2e6?text=Imagen';
          }}
        />
      </div>

      <div className="cart-item-details">
        <h6 className="cart-item-name">{item.name}</h6>
        
        <div className="cart-item-price">
          <span className="current-price">S/ {item.price.toFixed(2)}</span>
        </div>

        <div className="cart-item-controls">
          <div className="quantity-controls">
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <FaMinus />
            </Button>
            
            <Form.Control
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              min="1"
              max={item.stock}
              className="quantity-input"
              size="sm"
            />
            
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.stock}
            >
              <FaPlus />
            </Button>
          </div>

          <Button 
            variant="link" 
            className="remove-btn"
            onClick={handleRemove}
            title="Eliminar producto"
          >
            <FaTrash />
          </Button>
        </div>

        <div className="cart-item-subtotal">
          <strong>S/ {subtotal.toFixed(2)}</strong>
        </div>

        {item.quantity >= item.stock && (
          <div className="stock-warning">
            <small style={{ color: '#856404', fontSize: '0.8rem' }}>
              Stock máximo: {item.stock} unidades
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal del carrito (sidebar)
const Cart = () => {
  const { cartItems, isCartOpen, toggleCart, getTotalItems, getTotalPrice, clearCart } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    console.log('Proceder al checkout');
    // Aquí puedes agregar la lógica de checkout
    alert(`Proceder al pago de S/ ${totalPrice.toFixed(2)}`);
    toggleCart();
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      clearCart();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`cart-overlay ${isCartOpen ? 'active' : ''}`}
        onClick={toggleCart}
      />
      
      <Offcanvas 
        show={isCartOpen} 
        onHide={toggleCart} 
        placement="end" 
        className="cart-sidebar"
        backdrop={false}
      >
        <Offcanvas.Header className="cart-header">
          <div className="cart-title">
            <FaShoppingCart />
            <span>Tu Carrito</span>
            {totalItems > 0 && (
              <Badge bg="primary" pill className="ms-2">
                {totalItems}
              </Badge>
            )}
          </div>
          <Button variant="link" className="cart-close-btn" onClick={toggleCart}>
            <FaTimes />
          </Button>
        </Offcanvas.Header>

        <Offcanvas.Body className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <FaShoppingCart />
              </div>
              <h5>Tu carrito está vacío</h5>
              <p>Descubre nuestros productos ecológicos y sostenibles</p>
              <Button 
                variant="primary" 
                onClick={toggleCart}
                href="/productos"
              >
                Explorar Productos
              </Button>
            </div>
          ) : (
            <div className="cart-content">
              {/* Botón limpiar carrito (solo si hay más de 2 items) */}
              {cartItems.length > 2 && (
                <div className="cart-actions">
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={handleClearCart}
                    className="clear-cart-btn"
                  >
                    <FaTrash className="me-2" />
                    Vaciar carrito
                  </Button>
                </div>
              )}

              {/* Lista de items */}
              <div className="cart-items">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>

              {/* Total y checkout */}
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Total de productos:</span>
                    <span>{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total a pagar:</span>
                    <span>S/ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  variant="primary" 
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceder al Pago
                </Button>
              </div>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Cart;
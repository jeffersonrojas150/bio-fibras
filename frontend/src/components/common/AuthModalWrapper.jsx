// src/components/auth/AuthModalWrapper.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth-modal-wrapper.css';

const AuthModalWrapper = ({ children }) => {
  const navigate = useNavigate();

  // Prevenir scroll cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleClose = () => {
    // CORRECCIÓN: En lugar de retroceder (-1), vamos al inicio ('/') y reemplazamos la entrada.
    // Esto asegura que el modal se cierre completamente.
    navigate('/', { replace: true });
  };

  const handleOverlayClick = (e) => {
    // Cerrar solo si se hace clic en el overlay, no en el contenido
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="auth-modal-wrapper-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal-wrapper-container">
        <button 
          className="auth-modal-wrapper-close" 
          onClick={handleClose}
          aria-label="Cerrar"
          type="button"
        >
          ×
        </button>
        <div className="auth-modal-wrapper-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthModalWrapper;
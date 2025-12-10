// src/components/auth/AuthLayout.jsx
import React from 'react';
import '../styles/auth.css';
import logo from '../../assets/logo.png'; 

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-modal-container">
      {/* Header con logo */}
      <div className="auth-header">
        <div className="auth-logo-container">
          <img 
            src={logo} 
            alt="Logo de Biofibras" 
            className="biofibras-logo" 
          />
        </div>
        <h2 className="auth-title">{title}</h2>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      </div>
      
      {/* Contenido del formulario */}
      {children}
    </div>
  );
};

export default AuthLayout;
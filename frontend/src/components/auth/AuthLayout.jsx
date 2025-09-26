import React from 'react';
import '../styles/auth.css';
import biofibrasImage from '../../assets/Auth.jpeg';
// 1. Se añade la importación de tu logo (corregí la ruta a una estándar)
import logo from '../../assets/logo.png'; 

// 2. El componente 'BiofibrasLogo' con el SVG ha sido eliminado.

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-container">
      {/* Lado izquierdo - Imagen */}
      <div className="auth-image-section">
        <img 
          src={biofibrasImage}
          alt="Biofibras - Materiales sostenibles" 
          className="auth-background-image"
        />
      </div>
      
      {/* Lado derecho - Formulario */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          {/* Header con logo */}
          <div className="auth-header">
            <div className="auth-logo-container">
              {/* 3. Se reemplaza el componente SVG por una etiqueta <img> */}
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
      </div>
    </div>
  );
};

export default AuthLayout;
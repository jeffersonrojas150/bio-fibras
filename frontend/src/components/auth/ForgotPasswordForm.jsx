import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import apiClient from '../../api';


const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiClient.post('/auth/password-reset-request/', { email });
      setSuccess(true);
    } catch (error) {
      console.error("Error al solicitar el reseteo de contraseña:", err);
      setError('Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout title="Correo Enviado" subtitle="Revisa tu bandeja de entrada">
        <div className="auth-success">
          <div className="success-icon">✉️</div>
          <p>
            Si existe una cuenta asociada a <strong>{email}</strong>, hemos enviado un correo
            con las instrucciones para restablecer tu contraseña.
          </p>
          <p>
            Si no lo encuentras, por favor revisa tu carpeta de spam.
          </p>

          <div className="auth-footer">
            <Link to="/login" className="auth-button primary">
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Recuperar Contraseña" subtitle="Te ayudamos a recuperar tu cuenta">
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="auth-error">{error}</div>}

        <p className="forgot-password-description">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <div className="auth-input-group">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email}
          className="auth-button primary"
        >
          {isLoading ? (
            <span className="loading-content">
              <div className="spinner"></div>
              Enviando...
            </span>
          ) : (
            'Enviar Enlace de Recuperación'
          )}
        </button>

        <div className="auth-footer">
          <span>¿Recordaste tu contraseña? </span>
          <Link to="/login" className="auth-link">
            Inicia sesión
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordForm;
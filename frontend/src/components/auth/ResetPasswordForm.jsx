// src/components/auth/ResetPasswordForm.jsx

import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import apiClient from '../../api';

// (Opcional) Puedes reusar los iconos de ojo si los extraes a un archivo separado
// Por ahora, los duplicamos aquí para que el componente sea autocontenido.
const EyeIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="password-icon"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>);
const EyeOffIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" className="password-icon"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" /></svg>);

const ResetPasswordForm = () => {
    // Hooks para manejar estado y navegación
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Hooks de react-router-dom para obtener parámetros y navegar
    const { uid, token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación simple en el frontend
        if (password !== password2) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const endpoint = `/auth/password-reset-confirm/${uid}/${token}/`;

            await apiClient.post(endpoint, { password, password2 });

            setSuccess(true);

        } catch (err) {
            console.error("Error al restablecer la contraseña:", err.response?.data || err);
            const apiError = err.response?.data?.error || "El enlace de restablecimiento es inválido o ha expirado. Por favor, solicita uno nuevo.";
            setError(apiError);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <AuthLayout title="¡Éxito!" subtitle="Tu contraseña ha sido cambiada">
                <div className="auth-success">
                    <div className="success-icon">✅</div>
                    <p>Tu contraseña ha sido restablecida exitosamente.</p>
                    <p>Ahora puedes iniciar sesión con tu nueva contraseña.</p>

                    <div className="auth-footer" style={{ marginTop: '2rem' }}>
                        <Link to="/login" className="auth-button primary">
                            Ir a Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Crea una Nueva Contraseña" subtitle="Asegúrate de que sea segura">
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <div className="auth-error">{error}</div>}

                <div className="auth-input-group">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        required
                        disabled={isLoading}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>

                <div className="auth-input-group">
                    <input
                        type={showPassword2 ? "text" : "password"}
                        name="password2"
                        placeholder="Confirmar nueva contraseña"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        className="auth-input"
                        required
                        disabled={isLoading}
                    />
                    <button type="button" onClick={() => setShowPassword2(!showPassword2)} className="password-toggle">
                        {showPassword2 ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="auth-button primary"
                >
                    {isLoading ? (
                        <span className="loading-content">
                            <div className="spinner"></div>
                            Cambiando...
                        </span>
                    ) : (
                        'Restablecer Contraseña'
                    )}
                </button>
            </form>
        </AuthLayout>
    );
};

export default ResetPasswordForm;
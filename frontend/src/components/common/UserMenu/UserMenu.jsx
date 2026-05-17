import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import './UserMenu.css';

const UserMenu = ({ transparent = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const userFullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
    : '';

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button
        type="button"
        className={`nav-icon-link btn-reset user-menu-trigger ${transparent ? 'icon--white' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="bi bi-person-circle nav-icon"></i>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          {isAuthenticated && user ? (
            <>
              <div className="user-menu-header">
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={userFullName} />
                  ) : (
                    <i className="bi bi-person-circle"></i>
                  )}
                </div>
                <div className="user-info">
                  <p className="user-greeting">¡Bienvenido a Biofibras!</p>
                  <p className="user-name">{userFullName || user.username}</p>
                </div>
              </div>

              <ul className="user-menu-list">
                <li>
                  <Link to="/perfil" className="user-menu-item" onClick={() => setIsOpen(false)}>
                    <i className="bi bi-person-circle"></i>
                    <span>Mi Perfil</span>
                  </Link>
                </li>
                <li>
                  <Link to="/mis-ordenes" className="user-menu-item" onClick={() => setIsOpen(false)}>
                    <i className="bi bi-box-seam"></i>
                    <span>Mis Órdenes</span>
                  </Link>
                </li>
              </ul>

              <div className="user-menu-divider"></div>

              <button className="user-menu-item user-menu-logout" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i>
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <>
              <div className="user-menu-guest">
                <p className="guest-message">¡Bienvenido a Biofibras!</p>
                <p className="guest-submessage">Inicia sesión para una mejor experiencia</p>
              </div>
              <div className="user-menu-buttons">
                <Link to="/login" className="btn btn-dark w-100 mb-2" onClick={() => setIsOpen(false)}>
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="btn btn-outline-dark w-100" onClick={() => setIsOpen(false)}>
                  Registrarse
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
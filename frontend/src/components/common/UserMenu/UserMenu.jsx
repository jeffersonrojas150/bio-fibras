// src/components/common/UserMenu/UserMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import './UserMenu.css';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button 
        type="button" 
        className="nav-icon-link btn-reset user-menu-trigger" 
        onClick={toggleMenu}
      >
        <i className="bi bi-person-circle nav-icon"></i>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          {isAuthenticated ? (
            // Usuario autenticado
            <>
              <div className="user-menu-header">
                <div className="user-avatar">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <i className="bi bi-person-circle"></i>
                  )}
                </div>
                <div className="user-info">
                  <p className="user-greeting">¡Bienvenido a Biofibras!</p>
                  <p className="user-name">{user?.name || 'Usuario'}</p>
                </div>
              </div>

              <div className="user-menu-divider"></div>

              <ul className="user-menu-list">
                <li>
                  <Link 
                    to="/mis-ordenes" 
                    className="user-menu-item"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="bi bi-box-seam"></i>
                    <span>Mis Órdenes</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/mi-perfil" 
                    className="user-menu-item"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="bi bi-person"></i>
                    <span>Mi Perfil</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/favoritos" 
                    className="user-menu-item"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="bi bi-heart"></i>
                    <span>Favoritos</span>
                  </Link>
                </li>
              </ul>

              <div className="user-menu-divider"></div>

              <button 
                className="user-menu-item user-menu-logout" 
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            // Usuario no autenticado
            <>
              <div className="user-menu-guest">
                <p className="guest-message">¡Bienvenido a Biofibras!</p>
                <p className="guest-submessage">Inicia sesión para acceder a tu cuenta</p>
              </div>

              <div className="user-menu-buttons">
                <Link 
                  to="/login" 
                  className="btn btn-dark w-100 mb-2"
                  onClick={() => setIsOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/registro" 
                  className="btn btn-outline-dark w-100"
                  onClick={() => setIsOpen(false)}
                >
                  Registrarse
                </Link>
              </div>

              <div className="user-menu-divider"></div>

              <ul className="user-menu-list">
                <li>
                  <Link 
                    to="/productos" 
                    className="user-menu-item"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="bi bi-basket"></i>
                    <span>Ver Productos</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contacto" 
                    className="user-menu-item"
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="bi bi-envelope"></i>
                    <span>Contacto</span>
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;
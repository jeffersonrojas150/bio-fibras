// src/utils/notify.js
// Helpers de toast con el look & feel de Biofibras, para no repetir los
// mismos objetos de estilo en cada archivo que necesita avisar algo al
// usuario (antes cada quien usaba window.alert() o reinventaba el estilo).
import toast from 'react-hot-toast';

const baseStyle = {
  padding: '10px 16px',
  fontWeight: 500,
};

export const notifySuccess = (message) =>
  toast.success(message, {
    style: { ...baseStyle, border: '1px solid #484406', color: '#000000', background: '#f4e6c3' },
    iconTheme: { primary: '#22c55e', secondary: '#ffffff' },
  });

export const notifyError = (message) =>
  toast.error(message, {
    style: { ...baseStyle, border: '1px solid #f5c2c7', color: '#842029', background: '#f8d7da' },
    iconTheme: { primary: '#dc3545', secondary: '#ffffff' },
  });

// Para avisos no destructivos (ej. "inicia sesión para continuar")
export const notifyInfo = (message) =>
  toast(message, {
    icon: '🔒',
    style: { ...baseStyle, border: '1px solid #C8860D', color: '#5c4109', background: '#fdf3e0' },
  });

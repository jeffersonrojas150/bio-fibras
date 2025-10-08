// src/components/ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  // Extrae el "pathname" (ej: "/productos") del objeto de ubicación actual
  const { pathname } = useLocation();

  // Este efecto se ejecutará cada vez que el "pathname" cambie
  useEffect(() => {
    // "scrollTo(0, 0)" le dice al navegador que se mueva a la parte superior de la página
    window.scrollTo(0, 0);
  }, [pathname]);

  // Este componente no renderiza nada en la pantalla, solo ejecuta la lógica del efecto
  return null;
}

export default ScrollToTop;
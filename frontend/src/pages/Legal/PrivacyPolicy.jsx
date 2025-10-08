// src/pages/Legal/PrivacyPolicy.jsx

import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaShieldAlt, FaUserLock, FaDatabase, FaCookie, FaUserShield, FaLock } from 'react-icons/fa';
import './Legal.css';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="legal-page">
            <div className="legal-hero">
                <Container>
                    <div className="legal-hero-content">
                        <FaUserLock className="legal-hero-icon" />
                        <h1 className="legal-hero-title">Política de Privacidad</h1>
                        <p className="legal-hero-subtitle">
                            Última actualización: Octubre 2025
                        </p>
                    </div>
                </Container>
            </div>

            <Container className="legal-content">
                <Row>
                    <Col lg={3} className="d-none d-lg-block">
                        <div className="legal-sidebar">
                            <h3 className="legal-sidebar-title">Contenido</h3>
                            <nav className="legal-nav">
                                <a href="#introduccion">Introducción</a>
                                <a href="#informacion">Información que Recopilamos</a>
                                <a href="#uso">Uso de la Información</a>
                                <a href="#compartir">Compartir Información</a>
                                <a href="#cookies">Cookies y Tecnologías</a>
                                <a href="#seguridad">Seguridad</a>
                                <a href="#derechos">Tus Derechos</a>
                                <a href="#menores">Menores de Edad</a>
                                <a href="#cambios">Cambios a esta Política</a>
                                <a href="#contacto">Contacto</a>
                            </nav>
                        </div>
                    </Col>

                    <Col lg={9}>
                        <div className="legal-document">
                            <section id="introduccion" className="legal-section">
                                <div className="legal-section-header">
                                    <FaShieldAlt className="legal-section-icon" />
                                    <h2>1. Introducción</h2>
                                </div>
                                <p>
                                    En Bio Fibras J, valoramos y respetamos tu privacidad. Esta Política de Privacidad 
                                    describe cómo recopilamos, usamos, almacenamos y protegemos tu información personal 
                                    cuando utilizas nuestro sitio web y servicios.
                                </p>
                                <p>
                                    Nos comprometemos a cumplir con la Ley N° 29733 - Ley de Protección de Datos Personales 
                                    del Perú y su Reglamento, aprobado por Decreto Supremo N° 003-2013-JUS.
                                </p>
                                <div className="legal-highlight">
                                    <strong>⚡ Puntos Clave:</strong>
                                    <ul>
                                        <li>Solo recopilamos información necesaria para brindarte nuestros servicios</li>
                                        <li>Nunca venderemos tu información personal a terceros</li>
                                        <li>Utilizamos medidas de seguridad avanzadas para proteger tus datos</li>
                                        <li>Tienes derecho a acceder, corregir o eliminar tu información</li>
                                    </ul>
                                </div>
                            </section>

                            <section id="informacion" className="legal-section">
                                <div className="legal-section-header">
                                    <FaDatabase className="legal-section-icon" />
                                    <h2>2. Información que Recopilamos</h2>
                                </div>
                                
                                <h3>2.1 Información que nos Proporcionas Directamente</h3>
                                <p>Recopilamos información que nos proporcionas cuando:</p>
                                <ul>
                                    <li><strong>Creas una cuenta:</strong> Nombre, apellido, correo electrónico, contraseña, 
                                    número de teléfono, dirección de entrega</li>
                                    <li><strong>Realizas una compra:</strong> Información de facturación, método de pago, 
                                    historial de pedidos</li>
                                    <li><strong>Contactas con nosotros:</strong> Mensajes, consultas, comentarios, 
                                    opiniones sobre productos</li>
                                    <li><strong>Participas en promociones:</strong> Información de participación en 
                                    sorteos, concursos o encuestas</li>
                                </ul>

                                <h3>2.2 Información que Recopilamos Automáticamente</h3>
                                <p>Cuando visitas nuestro sitio web, recopilamos automáticamente:</p>
                                <ul>
                                    <li><strong>Información del dispositivo:</strong> Dirección IP, tipo de navegador, 
                                    sistema operativo, dispositivo utilizado</li>
                                    <li><strong>Información de navegación:</strong> Páginas visitadas, tiempo de permanencia, 
                                    enlaces clicados, productos visualizados</li>
                                    <li><strong>Datos de interacción:</strong> Productos agregados al carrito, búsquedas 
                                    realizadas, preferencias de usuario</li>
                                    <li><strong>Ubicación geográfica:</strong> Ubicación aproximada basada en dirección IP 
                                    (con tu consentimiento para ubicación precisa)</li>
                                </ul>

                                <h3>2.3 Información de Terceros</h3>
                                <p>
                                    Podemos recibir información sobre ti de servicios de terceros cuando utilizas opciones 
                                    de inicio de sesión social (Google, Facebook) o servicios de pago externos.
                                </p>
                            </section>

                            <section id="uso" className="legal-section">
                                <div className="legal-section-header">
                                    <FaUserShield className="legal-section-icon" />
                                    <h2>3. Uso de la Información</h2>
                                </div>
                                <p>Utilizamos tu información personal para los siguientes propósitos:</p>
                                
                                <h3>3.1 Prestación de Servicios</h3>
                                <ul>
                                    <li>Procesar y completar tus pedidos</li>
                                    <li>Gestionar tu cuenta y autenticación</li>
                                    <li>Facilitar pagos y transacciones</li>
                                    <li>Coordinar envíos y entregas</li>
                                    <li>Proporcionar soporte al cliente</li>
                                </ul>

                                <h3>3.2 Comunicación</h3>
                                <ul>
                                    <li>Enviar confirmaciones de pedidos y actualizaciones de envío</li>
                                    <li>Responder a tus consultas y solicitudes</li>
                                    <li>Notificarte sobre cambios en nuestros servicios</li>
                                    <li>Enviar newsletters y promociones (solo con tu consentimiento)</li>
                                </ul>

                                <h3>3.3 Mejora de Servicios</h3>
                                <ul>
                                    <li>Analizar el uso del sitio web para mejorar la experiencia del usuario</li>
                                    <li>Desarrollar nuevos productos y servicios</li>
                                    <li>Realizar investigación de mercado y análisis de tendencias</li>
                                    <li>Personalizar contenido y recomendaciones</li>
                                </ul>

                                <h3>3.4 Seguridad y Prevención de Fraude</h3>
                                <ul>
                                    <li>Detectar y prevenir actividades fraudulentas</li>
                                    <li>Proteger la seguridad del sitio web</li>
                                    <li>Cumplir con obligaciones legales y regulatorias</li>
                                    <li>Resolver disputas y hacer cumplir nuestros términos</li>
                                </ul>

                                <h3>3.5 Marketing (con tu consentimiento)</h3>
                                <ul>
                                    <li>Enviar ofertas personalizadas y promociones</li>
                                    <li>Mostrar anuncios relevantes en redes sociales</li>
                                    <li>Invitarte a participar en encuestas o eventos</li>
                                </ul>
                            </section>

                            <section id="compartir" className="legal-section">
                                <div className="legal-section-header">
                                    <h2>4. Compartir tu Información</h2>
                                </div>
                                <p>
                                    No vendemos, alquilamos ni compartimos tu información personal con terceros para sus 
                                    propios fines de marketing. Compartimos tu información solo en las siguientes circunstancias:
                                </p>

                                <h3>4.1 Proveedores de Servicios</h3>
                                <p>Compartimos información con proveedores que nos ayudan a operar nuestro negocio:</p>
                                <ul>
                                    <li><strong>Procesadores de pago:</strong> Para procesar transacciones de forma segura</li>
                                    <li><strong>Servicios de envío:</strong> Para entregar tus pedidos (Olva Courier, Shalom, etc.)</li>
                                    <li><strong>Servicios de hosting:</strong> Para alojar nuestro sitio web y datos</li>
                                    <li><strong>Herramientas de análisis:</strong> Para mejorar nuestro sitio (Google Analytics)</li>
                                    <li><strong>Servicios de email:</strong> Para enviar comunicaciones (con tu consentimiento)</li>
                                </ul>

                                <h3>4.2 Requisitos Legales</h3>
                                <p>Podemos divulgar tu información cuando:</p>
                                <ul>
                                    <li>Sea requerido por ley o proceso legal</li>
                                    <li>Sea necesario para proteger nuestros derechos o propiedad</li>
                                    <li>Sea necesario para prevenir actividades ilegales o proteger la seguridad pública</li>
                                    <li>Sea parte de una fusión, adquisición o venta de activos</li>
                                </ul>

                                <h3>4.3 Con tu Consentimiento</h3>
                                <p>
                                    Podemos compartir tu información con terceros cuando nos hayas dado tu consentimiento 
                                    explícito para hacerlo.
                                </p>
                            </section>

                            <section id="cookies" className="legal-section">
                                <div className="legal-section-header">
                                    <FaCookie className="legal-section-icon" />
                                    <h2>5. Cookies y Tecnologías Similares</h2>
                                </div>
                                <p>
                                    Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio web.
                                </p>

                                <h3>5.1 ¿Qué son las Cookies?</h3>
                                <p>
                                    Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando 
                                    visitas nuestro sitio web. Nos ayudan a recordar tus preferencias y mejorar tu experiencia.
                                </p>

                                <h3>5.2 Tipos de Cookies que Utilizamos</h3>
                                <ul>
                                    <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio 
                                    (inicio de sesión, carrito de compras)</li>
                                    <li><strong>Cookies de rendimiento:</strong> Recopilan información sobre cómo utilizas 
                                    el sitio (páginas visitadas, errores encontrados)</li>
                                    <li><strong>Cookies de funcionalidad:</strong> Recuerdan tus preferencias (idioma, región, 
                                    productos favoritos)</li>
                                    <li><strong>Cookies de marketing:</strong> Rastrean tu actividad para mostrar anuncios 
                                    relevantes (solo con tu consentimiento)</li>
                                </ul>

                                <h3>5.3 Gestión de Cookies</h3>
                                <p>
                                    Puedes controlar y eliminar cookies a través de la configuración de tu navegador. 
                                    Ten en cuenta que deshabilitar ciertas cookies puede afectar la funcionalidad del sitio.
                                </p>

                                <h3>5.4 Otras Tecnologías</h3>
                                <p>También utilizamos:</p>
                                <ul>
                                    <li><strong>Web beacons:</strong> Pequeñas imágenes que nos ayudan a entender el 
                                    comportamiento del usuario</li>
                                    <li><strong>Local storage:</strong> Para almacenar preferencias localmente en tu dispositivo</li>
                                    <li><strong>Píxeles de seguimiento:</strong> Para medir la efectividad de campañas de marketing</li>
                                </ul>
                            </section>

                            <section id="seguridad" className="legal-section">
                                <div className="legal-section-header">
                                    <FaLock className="legal-section-icon" />
                                    <h2>6. Seguridad de la Información</h2>
                                </div>
                                <p>
                                    Nos tomamos muy en serio la seguridad de tu información personal y hemos implementado 
                                    medidas técnicas y organizativas apropiadas para protegerla.
                                </p>

                                <h3>6.1 Medidas de Seguridad Técnicas</h3>
                                <ul>
                                    <li><strong>Encriptación SSL/TLS:</strong> Todas las transmisiones de datos están encriptadas</li>
                                    <li><strong>Encriptación de contraseñas:</strong> Las contraseñas se almacenan con hash seguro</li>
                                    <li><strong>Firewalls y protección DDoS:</strong> Protección contra ataques y accesos no autorizados</li>
                                    <li><strong>Monitoreo continuo:</strong> Sistemas de detección de intrusiones 24/7</li>
                                    <li><strong>Actualizaciones regulares:</strong> Mantenemos nuestro software actualizado</li>
                                </ul>

                                <h3>6.2 Medidas Organizativas</h3>
                                <ul>
                                    <li>Acceso limitado a datos personales solo a personal autorizado</li>
                                    <li>Acuerdos de confidencialidad con todos los empleados</li>
                                    <li>Auditorías de seguridad regulares</li>
                                    <li>Procedimientos de respuesta a incidentes de seguridad</li>
                                    <li>Capacitación regular en protección de datos</li>
                                </ul>

                                <h3>6.3 Limitaciones</h3>
                                <p>
                                    Aunque implementamos medidas de seguridad robustas, ningún sistema es completamente seguro. 
                                    No podemos garantizar la seguridad absoluta de la información transmitida a través de Internet. 
                                    Te recomendamos mantener seguras tus credenciales de acceso.
                                </p>

                                <h3>6.4 Retención de Datos</h3>
                                <p>
                                    Conservamos tu información personal solo durante el tiempo necesario para cumplir con los 
                                    propósitos descritos en esta política, a menos que la ley requiera o permita un período 
                                    de retención más largo. Los datos de transacciones se conservan según lo requiere la 
                                    legislación tributaria peruana (mínimo 5 años).
                                </p>
                            </section>

                            <section id="derechos" className="legal-section">
                                <div className="legal-section-header">
                                    <h2>7. Tus Derechos de Privacidad</h2>
                                </div>
                                <p>
                                    De acuerdo con la Ley de Protección de Datos Personales del Perú, tienes los siguientes derechos:
                                </p>

                                <h3>7.1 Derecho de Acceso</h3>
                                <p>
                                    Puedes solicitar información sobre los datos personales que tenemos sobre ti, incluyendo 
                                    cómo los obtenemos, para qué los usamos y con quién los compartimos.
                                </p>

                                <h3>7.2 Derecho de Rectificación</h3>
                                <p>
                                    Puedes solicitar la corrección de datos inexactos o incompletos. Puedes actualizar tu 
                                    información desde tu cuenta de usuario o contactándonos directamente.
                                </p>

                                <h3>7.3 Derecho de Cancelación</h3>
                                <p>
                                    Puedes solicitar la eliminación de tus datos personales, sujeto a excepciones legales 
                                    (como obligaciones fiscales o contractuales pendientes).
                                </p>

                                <h3>7.4 Derecho de Oposición</h3>
                                <p>
                                    Puedes oponerte al tratamiento de tus datos personales en determinadas circunstancias, 
                                    especialmente para fines de marketing directo.
                                </p>

                                <h3>7.5 Derecho a la Portabilidad</h3>
                                <p>
                                    Puedes solicitar que te proporcionemos tus datos en un formato estructurado y de uso común 
                                    para transferirlos a otro proveedor de servicios.
                                </p>

                                <h3>7.6 Derecho a Retirar el Consentimiento</h3>
                                <p>
                                    Cuando el tratamiento se base en tu consentimiento, puedes retirarlo en cualquier momento. 
                                    Esto no afectará la legalidad del tratamiento previo al retiro.
                                </p>

                                <h3>7.7 Cómo Ejercer tus Derechos</h3>
                                <p>
                                    Para ejercer cualquiera de estos derechos, puedes:
                                </p>
                                <ul>
                                    <li>Acceder a la configuración de tu cuenta en el sitio web</li>
                                    <li>Enviarnos un correo a: <strong>bio.fibras.j@gmail.com</strong></li>
                                    <li>Llamarnos al: <strong>+51 910 881 837</strong></li>
                                    <li>Escribirnos a: Vichayal, La Arena, Piura, Perú</li>
                                </ul>
                                <p>
                                    Responderemos a tu solicitud dentro de los 10 días hábiles. Puede que necesitemos 
                                    verificar tu identidad antes de procesar tu solicitud.
                                </p>

                                <h3>7.8 Derecho a Presentar una Queja</h3>
                                <p>
                                    Si consideras que hemos vulnerado tus derechos de protección de datos, puedes presentar 
                                    una queja ante la Autoridad Nacional de Protección de Datos Personales del Perú.
                                </p>
                            </section>

                            <section id="menores" className="legal-section">
                                <div className="legal-section-header">
                                    <h2>8. Protección de Menores de Edad</h2>
                                </div>
                                <p>
                                    Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos 
                                    intencionalmente información personal de menores de edad.
                                </p>
                                <p>
                                    Si eres padre o tutor y crees que tu hijo nos ha proporcionado información personal, 
                                    contáctanos inmediatamente. Si descubrimos que hemos recopilado información de un menor 
                                    sin el consentimiento parental apropiado, tomaremos medidas para eliminar esa información 
                                    de nuestros servidores.
                                </p>
                            </section>

                            <section id="transferencias" className="legal-section">
                                <div className="legal-section-header">
                                    <h2>9. Transferencias Internacionales de Datos</h2>
                                </div>
                                <p>
                                    Algunos de nuestros proveedores de servicios pueden estar ubicados fuera de Perú. Cuando 
                                    transferimos tu información personal internacionalmente, nos aseguramos de que:
                                </p>
                                <ul>
                                    <li>El país de destino tenga un nivel adecuado de protección de datos</li>
                                    <li>Se implementen salvaguardias apropiadas (cláusulas contractuales estándar)</li>
                                    <li>Cumplamos con todas las regulaciones aplicables de transferencia de datos</li>
                                </ul>
                            </section>

                            <section id="cambios" className="legal-section">
                                <div className="legal-section-header">
                                    <h2>10. Cambios a esta Política de Privacidad</h2>
                                </div>
                                <p>
                                    Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en 
                                    nuestras prácticas o por razones legales, operativas o regulatorias.
                                </p>
                                <p>
                                    Cuando realicemos cambios significativos, te notificaremos mediante:
                                </p>
                                <ul>
                                    <li>Un aviso destacado en nuestro sitio web</li>
                                    <li>Un correo electrónico a la dirección registrada en tu cuenta</li>
                                    <li>Una notificación en la aplicación (si aplica)</li>
                                </ul>
                                <p>
                                    Te recomendamos revisar esta política periódicamente. La fecha de "Última actualización" 
                                    en la parte superior indica cuándo se modificó por última vez.
                                </p>
                                <p>
                                    El uso continuado de nuestros servicios después de la publicación de cambios constituye 
                                    tu aceptación de la política actualizada.
                                </p>
                            </section>

                            <section id="contacto" className="legal-section">
                                <div className="legal-section-header">
                                    <h2>11. Información de Contacto</h2>
                                </div>
                                <p>
                                    Si tienes preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad 
                                    o el tratamiento de tus datos personales, contáctanos:
                                </p>
                                <div className="legal-contact-box">
                                    <p><strong>Bio Fibras J</strong></p>
                                    <p><strong>Oficial de Protección de Datos</strong></p>
                                    <p>📍 Vichayal, La Arena, Piura, Perú</p>
                                    <p>📧 bio.fibras.j@gmail.com</p>
                                    <p>📧 Privacidad: privacidad@biofibrasj.com</p>
                                    <p>📱 +51 910 881 837</p>
                                    <p>⏰ Horario de Atención: Lunes a Viernes, 9:00 AM - 6:00 PM</p>
                                </div>
                                <p className="mt-3">
                                    <strong>Tiempo de respuesta:</strong> Nos comprometemos a responder todas las consultas 
                                    relacionadas con privacidad dentro de 10 días hábiles.
                                </p>
                            </section>

                            <div className="legal-footer-note">
                                <p>
                                    <strong>Última actualización:</strong> Octubre 2025<br/>
                                    <strong>Versión:</strong> 1.0<br/>
                                    <strong>Idioma:</strong> Español (Perú)
                                </p>
                                <p className="text-muted">
                                    Esta Política de Privacidad cumple con la Ley N° 29733 - Ley de Protección de Datos 
                                    Personales del Perú y su Reglamento. Al utilizar nuestros servicios, reconoces haber 
                                    leído y entendido esta política.
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PrivacyPolicy;
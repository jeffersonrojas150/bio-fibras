// src/pages/Legal/TermsConditions.jsx

import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFileContract, FaShieldAlt, FaGavel, FaStore, FaCreditCard, FaUndo } from 'react-icons/fa';
import './Legal.css';

const TermsConditions = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="legal-page">
            <div className="legal-hero">
                <Container>
                    <div className="legal-hero-content">
                        <FaFileContract className="legal-hero-icon" />
                        <h1 className="legal-hero-title">Términos y Condiciones</h1>
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
                                <a href="#uso-sitio">Uso del Sitio</a>
                                <a href="#productos">Productos y Servicios</a>
                                <a href="#pedidos">Pedidos y Pagos</a>
                                <a href="#envios">Envíos y Entregas</a>
                                <a href="#devoluciones">Devoluciones</a>
                                <a href="#propiedad">Propiedad Intelectual</a>
                                <a href="#limitaciones">Limitaciones</a>
                                <a href="#cambios">Modificaciones</a>
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
                                    Bienvenido a BIOFIBRAS. Estos Términos y Condiciones regulan el uso de nuestro sitio web 
                                    y la compra de productos elaborados con fibras naturales sostenibles.
                                </p>
                                <p>
                                    Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos y condiciones, 
                                    junto con todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de 
                                    estos términos, te recomendamos no utilizar nuestro sitio.
                                </p>
                                <div className="legal-highlight">
                                    <strong>Información de la Empresa:</strong>
                                    <ul>
                                        <li><strong>Razón Social:</strong> BIOFIBRAS</li>
                                        <li><strong>Ubicación:</strong> Vichayal, La Arena, Piura, Perú</li>
                                        <li><strong>Email:</strong> bio.fibras.j@gmail.com</li>
                                        <li><strong>Teléfono:</strong> +51 910 881 837</li>
                                    </ul>
                                </div>
                            </section>

                            <section id="uso-sitio" className="legal-section">
                                <div className="legal-section-header">
                                    <FaGavel className="legal-section-icon" />
                                    <h2>2. Uso del Sitio Web</h2>
                                </div>
                                <h3>2.1 Cuenta de Usuario</h3>
                                <p>
                                    Para realizar compras en nuestro sitio, debes crear una cuenta proporcionando información 
                                    precisa y completa. Eres responsable de mantener la confidencialidad de tu contraseña y 
                                    de todas las actividades que ocurran bajo tu cuenta.
                                </p>
                                
                                <h3>2.2 Uso Permitido</h3>
                                <p>Te comprometes a:</p>
                                <ul>
                                    <li>Utilizar el sitio únicamente con fines legales</li>
                                    <li>No intentar acceder a áreas restringidas del sitio</li>
                                    <li>No transmitir virus, malware o código malicioso</li>
                                    <li>No realizar actividades que puedan dañar, deshabilitar o sobrecargar el sitio</li>
                                    <li>Proporcionar información veraz y actualizada</li>
                                </ul>

                                <h3>2.3 Restricciones de Edad</h3>
                                <p>
                                    Debes ser mayor de 18 años para realizar compras en nuestro sitio. Al usar el sitio, 
                                    garantizas que cumples con este requisito de edad.
                                </p>
                            </section>

                            <section id="productos" className="legal-section">
                                <div className="legal-section-header">
                                    <FaStore className="legal-section-icon" />
                                    <h2>3. Productos y Servicios</h2>
                                </div>
                                <h3>3.1 Descripción de Productos</h3>
                                <p>
                                    Nos esforzamos por describir y mostrar nuestros productos con la mayor precisión posible. 
                                    Sin embargo, no garantizamos que las descripciones, colores, información u otro contenido 
                                    sean completamente precisos, completos, confiables o libres de errores.
                                </p>

                                <h3>3.2 Productos Artesanales</h3>
                                <p>
                                    Nuestros productos son elaborados artesanalmente con fibras naturales. Esto significa que:
                                </p>
                                <ul>
                                    <li>Pueden existir variaciones mínimas en tamaño, color y textura</li>
                                    <li>Cada producto es único y puede diferir ligeramente de las imágenes mostradas</li>
                                    <li>Las características naturales de las fibras se consideran parte del diseño</li>
                                </ul>

                                <h3>3.3 Disponibilidad</h3>
                                <p>
                                    Todos los productos están sujetos a disponibilidad. Nos reservamos el derecho de discontinuar 
                                    cualquier producto en cualquier momento. En caso de que un producto no esté disponible después 
                                    de realizar un pedido, te notificaremos y ofreceremos un reembolso completo.
                                </p>

                                <h3>3.4 Precios</h3>
                                <p>
                                    Todos los precios están expresados en Soles Peruanos (PEN) e incluyen IGV (Impuesto General a 
                                    las Ventas). Nos reservamos el derecho de modificar precios sin previo aviso, aunque los 
                                    pedidos confirmados mantendrán el precio acordado al momento de la compra.
                                </p>
                            </section>

                            <section id="pedidos" className="legal-section">
                                <div className="legal-section-header">
                                    <FaCreditCard className="legal-section-icon" />
                                    <h2>4. Pedidos y Pagos</h2>
                                </div>
                                <h3>4.1 Proceso de Pedido</h3>
                                <p>
                                    Al realizar un pedido, se generará automáticamente un código único de pedido y recibirás un 
                                    correo electrónico de confirmación. Este correo no representa la aceptación final del pedido, 
                                    sino la confirmación de que hemos recibido tu solicitud correctamente.
                                    </p>

                                    <p>
                                    Durante el proceso, podrás elegir tu método de pago: <strong>Yape</strong> o 
                                    <strong> transferencia bancaria</strong>. Deberás enviar el comprobante o 
                                    captura del pago por <strong>WhatsApp</strong> o <strong>correo electrónico</strong>, 
                                    indicando el código de tu pedido.
                                    </p>

                                    <p>
                                    Una vez verificado el pago, te enviaremos una notificación confirmando que tu pedido ha sido 
                                    aceptado y procederemos con el envío correspondiente.
                                    </p>


                                <h3>4.2 Métodos de Pago</h3>
                                <p>Por ahora estamos aceptando los siguientes métodos de pago:</p>
                                <ul>
                                    <li>Transferencias bancarias</li>
                                    <li>Yape</li>
                                    
                                </ul>
                                {/* 

                                <h3>4.3 Seguridad de Pagos</h3>
                                <p>
                                    Utilizamos tecnología de encriptación SSL para proteger tu información de pago. 
                                    No almacenamos datos completos de tarjetas de crédito en nuestros servidores.
                                </p>

                                <h3>4.4 Facturación</h3>
                                <p>
                                    Emitimos boletas o facturas electrónicas según lo solicitado. Para factura, debes 
                                    proporcionar tu RUC y razón social antes de completar la compra.
                                </p>
                                */}
                            </section>

                            <section id="envios" className="legal-section">
                                <div className="legal-section-header">
                                    <h2>5. Envíos y Entregas</h2>
                                </div>
                                <h3>5.1 Áreas de Envío</h3>
                                <p>
                                    Realizamos envíos a todo el Perú. Los tiempos de entrega varían según la ubicación:
                                </p>
                                <ul>
                                    <li><strong>Lima Metropolitana:</strong> 3-5 días hábiles</li>
                                    <li><strong>Provincias:</strong> 5-10 días hábiles</li>
                                    <li><strong>Zonas alejadas:</strong> Hasta 15 días hábiles</li>
                                </ul>

                                <h3>5.2 Costos de Envío</h3>
                                <p>
                                    El costo de envío es asumido por el cliente y deberá pagarse directamente al momento de recoger el pedido en la agencia de envío elegida. 
                                    El monto puede variar según el peso, tamaño y destino del paquete. 
                                    BIOFIBRAS no incluye el costo de envío en el precio del producto, salvo promociones específicas que lo indiquen expresamente.
                                </p>

                                <h3>5.3 Seguimiento</h3>
                                <p>
                                    Una vez que tu pedido haya sido entregado a la empresa o agencia de envío seleccionada, 
                                    se subirá el comprobante (voucher) de envío a nuestra página web para que puedas visualizarlo. 
                                    Además, recibirás una notificación por correo electrónico o WhatsApp con los detalles del envío. 
                                    En el voucher encontrarás el código de seguimiento para rastrear el estado de tu pedido en tiempo real.
                                </p>


                                <h3>5.4 Entrega</h3>
                                <p>
                                    Es responsabilidad del cliente proporcionar una dirección de entrega correcta y completa. 
                                    No nos hacemos responsables por retrasos o pérdidas ocasionadas por información incorrecta o incompleta. 
                                    Al momento de recoger el pedido en la agencia de envío seleccionada, se requerirá la presentación del 
                                    <strong> DNI</strong> y la firma de un adulto como constancia de recepción.
                                </p>
                            </section>

                            <section id="devoluciones" className="legal-section">
                                <div className="legal-section-header">
                                    <FaUndo className="legal-section-icon" />
                                    <h2>6. Devoluciones y Reembolsos</h2>
                                </div>
                               <h3>6.1 Política de Devolución</h3>
                                <p>
                                    Aceptamos devoluciones dentro de los 5 días posteriores a la recepción del producto, 
                                    siempre que se cumplan las siguientes condiciones:
                                </p>
                                <ul>
                                    <li>El producto se encuentre en su estado original y sin signos de uso.</li>
                                    <li>Incluya todas las etiquetas, accesorios y su embalaje original.</li>
                                    <li>No se trate de un producto personalizado o hecho a medida.</li>
                                    <li>Se presente el comprobante de compra correspondiente.</li>
                                </ul>


                                <h3>6.2 Productos Defectuosos</h3>
                                <p>
                                    Si recibes un producto defectuoso o dañado, te pedimos que nos contactes dentro de las 24 horas 
                                    posteriores a la recepción o lo antes posible, enviando fotografías claras del producto y su embalaje. 
                                    Evaluaremos el caso y procederemos con el reemplazo o reembolso sin costo adicional.
                                </p>


                                <h3>6.3 Proceso de Reembolso</h3>
                                <p>
                                    Los reembolsos se procesarán dentro de 10 días hábiles después de recibir y verificar 
                                    el producto devuelto. El reembolso se realizará al mismo método de pago original.
                                </p>

                                <h3>6.4 Costos de Devolución</h3>
                                <p>
                                    Los costos de envío de devolución corren por cuenta del cliente, excepto en casos de 
                                    productos defectuosos o errores de nuestra parte.
                                </p>
                            </section>

                            <section id="propiedad" className="legal-section">
                                <div className="legal-section-header">
                                    <h2>7. Propiedad Intelectual</h2>
                                </div>
                                <p>
                                    Todo el contenido de este sitio web, incluyendo texto, gráficos, logos, iconos, imágenes, 
                                    videos y software, es propiedad de BIOFIBRAS o de sus proveedores de contenido y está 
                                    protegido por leyes de propiedad intelectual peruanas e internacionales.
                                </p>
                                <p>
                                    No está permitido copiar, reproducir, distribuir, transmitir, mostrar, vender, licenciar 
                                    o explotar cualquier contenido del sitio sin nuestro consentimiento previo por escrito.
                                </p>
                            </section>

                            <section id="limitaciones" className="legal-section">
                                <div className="legal-section-header">
                                    <h2>8. Limitaciones de Responsabilidad</h2>
                                </div>
                                <p>
                                    En la máxima medida permitida por la ley, BIOFIBRAS no será responsable por:
                                </p>
                                <ul>
                                    <li>Daños indirectos, incidentales, especiales o consecuentes</li>
                                    <li>Pérdida de beneficios, datos o uso</li>
                                    <li>Interrupción del servicio o errores del sitio web</li>
                                    <li>Acciones de terceros, incluyendo servicios de mensajería</li>
                                </ul>
                                <p>
                                    Nuestra responsabilidad total no excederá el valor de los productos adquiridos.
                                </p>
                            </section>

                            <section id="cambios" className="legal-section">
                                <div className="legal-section-header">
                                    <h2>9. Modificaciones a los Términos</h2>
                                </div>
                                <p>
                                    Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. 
                                    Los cambios entrarán en vigencia inmediatamente después de su publicación en el sitio web. 
                                    Te recomendamos revisar periódicamente estos términos.
                                </p>
                                <p>
                                    El uso continuado del sitio después de la publicación de cambios constituye tu aceptación 
                                    de los nuevos términos.
                                </p>
                            </section>

                            <section id="contacto" className="legal-section">
                                <div className="legal-section-header">
                                    <h2>10. Información de Contacto</h2>
                                </div>
                                <p>
                                    Si tienes preguntas sobre estos Términos y Condiciones, por favor contáctanos:
                                </p>
                                <div className="legal-contact-box">
                                    <p><strong>BIOFIBRAS</strong></p>
                                    <p>📍 Vichayal, La Arena, Piura, Perú</p>
                                    <p>📧 bio.fibras.j@gmail.com</p>
                                    <p>📱 +51 910 881 837</p>
                                    <p>⏰ Lunes a Viernes, 9:00 AM - 6:00 PM</p>
                                </div>
                            </section>

                            <div className="legal-footer-note">
                                <p>
                                    <strong>Última actualización:</strong> Octubre 2025<br/>
                                    <strong>Versión:</strong> 1.0
                                </p>
                                <p className="text-muted">
                                    Al utilizar nuestro sitio web y servicios, reconoces haber leído, entendido y 
                                    aceptado estos Términos y Condiciones en su totalidad.
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default TermsConditions;
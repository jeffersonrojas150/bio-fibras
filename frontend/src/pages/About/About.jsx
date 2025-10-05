import React, { useState, useEffect } from 'react';
import { Leaf, Award, Heart, Users, MapPin, Sparkles } from 'lucide-react';
import './About.css';
import { useNavigate } from 'react-router-dom';


export default function About() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const materials = [
    { name: 'Junco', icon: '🌾' },
    { name: 'Paja Toquilla', icon: '🌿' },
    { name: 'Totora', icon: '🎋' },
    { name: 'Palma', icon: '🌴' }
  ];

  const products = [
    'Carteras ',
    'Llaveros ',
    'Canastas ',
    'Lámparas',
    'Tapetes',
    'Espejos Rústicos',
    'Decoraciones de interiores',
    'Decoraciones de exteriores'
  ];
const navigate = useNavigate();

  return (
    
    <div className="about-page-container">
      
      <section className="about__header">
        <div 
          className="about__header-background"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        
        <div className="about__header-content">
          <div className="about__award-badge">
            <Award className="about__badge-icon1" />
            Ganadores Somos Artesanía 2025 
            <img 
              src="https://images.emojiterra.com/google/android-10/512px/1f1f5-1f1ea.png" 
              alt="Bandera de Perú" 
              style={{ width: "24px", height: "24px", marginLeft: "8px", borderRadius: "2px" }} 
            />
          </div>
          
          <h1 className="about__title">
           <span className="about__title--highlight">Biofibras</span>
          </h1>
          
          <p className="about__subtitle">
            Creando productos artesanales únicos con materiales 100% naturales
          </p>
        </div>
      </section>

      {/* Sección Historia */}
      <section className="about__story">
        <div className="about__container">
          <div className="about__story-card">
            <div className="about__story-grid">
              <div className="about__story-image">
                <div className="about__story-image-content">
                  <Leaf className="about__leaf-icon-animated" />
                  <h3 className="about__story-image-title">100% Natural</h3>
                  <p className="about__story-image-subtitle">Fibras vegetales auténticas</p>
                </div>
              </div>

              <div className="about__story-content">
                <h2 className="about__section-title">Nuestra Historia</h2>
                <div className="about__story-text">
                  <p>En <strong className="about__text-highlight">Biofibras</strong>, nos dedicamos a crear productos artesanales únicos utilizando materiales 100% naturales como fibras de junco, paja toquilla, totora y palma.</p>
                  <p>Cada pieza es elaborada a mano con dedicación, cuidado y profundo respeto por la naturaleza y las tradiciones ancestrales.</p>
                  <p>Nuestro propósito es revalorizar el arte de trabajar con fibras vegetales, promoviendo prácticas sostenibles que conectan lo natural con lo funcional.</p>
                  <p className="about__story-highlight">Cada creación cuenta una historia de origen, identidad e innovación.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Materiales */}
      <section className="about__materials">
        <div className="about__container">
          <div className="about__section-header">
            <h2 className="about__section-title about__section-title--centered">Nuestros Materiales</h2>
            <p className="about__section-subtitle">Fibras naturales seleccionadas con cuidado</p>
          </div>

          <div className="about__materials-grid">
            {materials.map((material, index) => (
              <div key={index} className="about__material-card">
                <div className="about__material-icon">{material.icon}</div>
                <h3 className="about__material-name">{material.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Fundador */}
      <section className="about__founder">
        <div className="about__container">
          <div className="about__founder-card">
            <div className="about__founder-grid">
              <div className="about__founder-photo">
                <img 
                  src="/assets/images/jairo-fundador.jpg"
                  alt="Jairo Jhanpier Villegas Solano - Fundador de Biofibras"
                  className="about__founder-image"
                  onError={(e) => { e.target.src = "https://scontent.flim28-2.fna.fbcdn.net/v/t39.30808-6/536147577_4028248204158295_3973783032091909658_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHI5NGv-LBPxkvH9Eg8hqTU1sG1COKtm8zWwbUI4q2bzFLTPYpl0skb45YMIR0C7wmJ-UVMVFzKcujcEAcZHFvn&_nc_ohc=Gjhj8CO3W9UQ7kNvwFYEcf_&_nc_oc=Adnl8pNLHGCMOuoQSfJH51C_uPXr8fFDZ5p6gtGKzflw-wPCtRB-jzK21FzPa-mxqZ0&_nc_zt=23&_nc_ht=scontent.flim28-2.fna&_nc_gid=bx6uC9SqESrTxhXoxtFRSg&oh=00_AffQTkS0Km6lB1QSdg9er4jiKyTFheyNMd-L837-jNFeBQ&oe=68E87064"; }}
                />
              </div>
              <div className="about__founder-content">
                <div className="about__founder-badge"><Sparkles className="about__badge-icon" />Fundador</div>
                <h2 className="about__founder-name">Jairo Jhanpier Villegas Solano</h2>
                <div className="about__founder-info">
                  <div className="about__info-item"><MapPin className="about__info-icon" /><div><p className="about__info-title">Vichayal, La Arena</p><p className="about__info-subtitle">Piura, Perú</p></div></div>
                  <div className="about__info-item"><Heart className="about__info-icon" /><p>Especialista en fibras naturales, dedicado a preservar y modernizar técnicas artesanales.</p></div>
                </div>
                <div className="about__recognition-card">
                  <div className="about__recognition-header"><Award className="about__recognition-icon" /><h3 className="about__recognition-title">Reconocimiento 2025</h3></div>
                  <p className="about__recognition-text">Ganador del concurso <strong>"Somos Artesanía 2025"</strong> del MINCETUR<img 
                      src="https://images.emojiterra.com/google/android-10/512px/1f1f5-1f1ea.png" 
                      alt="Bandera de Perú" 
                      style={{ width: "24px", height: "24px", marginLeft: "8px", borderRadius: "2px" }} 
                    /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Productos */}
      <section className="about__products">
        <div className="about__container">
          <div className="about__section-header">
            <h2 className="about__section-title about__section-title--centered">Nuestros Productos</h2>
            <p className="about__section-subtitle">De la naturaleza a tus manos</p>
          </div>
          <div className="about__products-grid">
            {products.map((product, index) => (
              <div key={index} className="about__product-card">
                <div className="about__product-icon-wrapper"><Leaf className="about__product-icon" /></div>
                <h3 className="about__product-name">{product}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección Llamada a la Acción (CTA) */}
      <section className="about__cta">
        <div className="about__container about__container--small">
          <div className="about__cta-card">
            <h2 className="about__cta-title">Conecta con lo Natural</h2>
            <p className="about__cta-text">Descubre piezas únicas que cuentan historias de tradición, naturaleza e innovación.</p>
            <button 
                className="about__cta-button"
                onClick={() => navigate('/productos')}
              >
                Ver Productos
              </button>

          </div>
        </div>
      </section>
    </div>
  );
}
import "./LandingPage.css";

import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import FeatureCard from "../Components/FeatureCard";
import salaReunion from "../assets/image.png";

import {
  FaCalendarAlt,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";


function LandingPage() {

  return (

    <div className="landing">


      {/* ================= NAVBAR ================= */}

      <NavBar />


      {/* ================= HERO ================= */}

      <section className="hero" id="inicio">


        <div className="hero-content">


          {/* TEXTO */}

          <div className="hero-text">


            <span className="hero-badge">
              🚀 Plataforma Inteligente de Reservas
            </span>


            <h1>
              Gestiona tus salas de reuniones
            </h1>


            <h2>
              de forma rápida y segura
            </h2>


            <p>
              SmartReserve permite administrar reservas de salas,
              auditorios y espacios compartidos de manera organizada,
              moderna y eficiente para empresas, universidades e
              instituciones.
            </p>


            <div className="hero-buttons">


              <a
                href="/login"
                className="btn-primary"
              >
                Iniciar sesión
              </a>


              <a
                href="#features"
                className="btn-secondary"
              >
                Conocer más
              </a>


            </div>


          </div>



          {/* IMAGEN */}


          <div className="hero-image">
  <img
    src={salaReunion}
    alt="Sala de reuniones"
  />
</div>


        </div>


      </section>




      {/* ================= CARACTERÍSTICAS ================= */}


      <section
        className="features"
        id="features"
      >


        <h2 className="section-title">
          ¿Por qué elegir SmartReserve?
        </h2>


        <p className="section-subtitle">
          Una plataforma moderna para administrar espacios de forma
          inteligente, rápida y segura.
        </p>



        <div className="features-grid">


          <FeatureCard

            icon={<FaCalendarAlt />}

            title="Reservas Inteligentes"

            description="Programa y administra reservas de salas en pocos segundos desde cualquier dispositivo."

          />



          <FeatureCard

            icon={<FaUsers />}

            title="Gestión de Usuarios"

            description="Administra usuarios, permisos y roles de manera sencilla y segura."

          />



          <FeatureCard

            icon={<FaChartLine />}

            title="Reportes"

            description="Consulta estadísticas para optimizar el uso de los espacios."

          />


        </div>


      </section>




      {/* ================= BENEFICIOS ================= */}


      <section className="benefits">


        <h2 className="section-title">
          Beneficios
        </h2>


        <p className="section-subtitle">
          SmartReserve simplifica la administración de espacios
          compartidos mediante herramientas modernas.
        </p>



        <div className="benefits-grid">


          <div className="benefit-card">

            <div className="benefit-icon">
              ⏱️
            </div>

            <h3>
              Ahorra tiempo
            </h3>

            <p>
              Automatiza completamente el proceso de reservas.
            </p>

          </div>




          <div className="benefit-card">


            <div className="benefit-icon">
              ✅
            </div>


            <h3>
              Evita conflictos
            </h3>


            <p>
              El sistema controla automáticamente la disponibilidad.
            </p>


          </div>




          <div className="benefit-card">


            <div className="benefit-icon">
              📈
            </div>


            <h3>
              Mayor productividad
            </h3>


            <p>
              Aprovecha mejor todos los espacios de la organización.
            </p>


          </div>




          <div className="benefit-card">


            <div className="benefit-icon">
              🔒
            </div>


            <h3>
              Seguridad
            </h3>


            <p>
              Control de acceso mediante autenticación y permisos.
            </p>


          </div>



        </div>


      </section>




      {/* ================= ESTADÍSTICAS ================= */}


      <section className="stats">


        <h2 className="section-title">
          SmartReserve en números
        </h2>



        <div className="stats-grid">


          <div className="stat-item">

            <h3>
              500+
            </h3>

            <p>
              Reservas mensuales
            </p>

          </div>



          <div className="stat-item">

            <h3>
              120
            </h3>

            <p>
              Salas administradas
            </p>

          </div>



          <div className="stat-item">

            <h3>
              99%
            </h3>

            <p>
              Disponibilidad
            </p>

          </div>



          <div className="stat-item">

            <h3>
              24/7
            </h3>

            <p>
              Acceso al sistema
            </p>

          </div>



        </div>


      </section>




      {/* ================= COMO FUNCIONA ================= */}


      <section className="how-it-works">


        <h2>
          ¿Cómo funciona?
        </h2>


        <p className="section-subtitle">
          Gestiona tus reservas en cuatro sencillos pasos.
        </p>



        <div className="steps">


          <div className="step">

            <div className="step-icon">
              👤
            </div>

            <h3>
              Regístrate
            </h3>

            <p>
              Crea tu cuenta y accede al sistema.
            </p>

          </div>




          <div className="step">

            <div className="step-icon">
              📅
            </div>

            <h3>
              Reserva
            </h3>

            <p>
              Consulta la disponibilidad y reserva una sala.
            </p>

          </div>




          <div className="step">

            <div className="step-icon">
              🏢
            </div>

            <h3>
              Administra
            </h3>

            <p>
              Modifica o cancela tus reservas cuando sea necesario.
            </p>

          </div>




          <div className="step">

            <div className="step-icon">
              📊
            </div>

            <h3>
              Analiza
            </h3>

            <p>
              Consulta reportes y estadísticas del uso de las salas.
            </p>

          </div>



        </div>


      </section>




      {/* ================= FOOTER ================= */}


      <Footer />


    </div>

  );

}


export default LandingPage;
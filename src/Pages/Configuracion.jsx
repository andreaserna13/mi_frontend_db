import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaUser,
  FaBell,
  FaLock,
  FaCalendarAlt,
  FaClock,
  FaSignOutAlt,
  FaEdit,
  FaGlobe,
  FaEnvelope,
  FaShieldAlt,
  FaCheckCircle
} from "react-icons/fa";

import "./Configuracion.css";
import { obtenerReservas } from "../services/reservaService";

function Configuracion() {
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [horaActual, setHoraActual] = useState(new Date());

  /*
   * ============================================================
   * RELOJ EN TIEMPO REAL
   * ============================================================
   */
  useEffect(() => {
    const reloj = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);

    return () => clearInterval(reloj);
  }, []);

  /*
   * ============================================================
   * CARGAR RESERVAS DEL USUARIO
   * ============================================================
   */
  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      setCargando(true);

      const data = await obtenerReservas();

      const misReservas = data.filter(
        (reserva) =>
          reserva.usuario === usuario?.nombre &&
          reserva.estado !== "Cancelada"
      );

      setReservas(misReservas);
    } catch (error) {
      console.error("Error al cargar las reservas:", error);
      setReservas([]);
    } finally {
      setCargando(false);
    }
  };

  /*
   * ============================================================
   * CERRAR SESIÓN
   * ============================================================
   */
  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  /*
   * ============================================================
   * PRÓXIMA RESERVA
   * ============================================================
   */
  const proximaReserva = [...reservas]
    .filter(
      (reserva) =>
        new Date(`${reserva.fecha}T${reserva.horaInicio}`) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(`${a.fecha}T${a.horaInicio}`) -
        new Date(`${b.fecha}T${b.horaInicio}`)
    )[0];

  /*
   * ============================================================
   * FECHA FORMATEADA
   * ============================================================
   */
  const fechaFormateada = horaActual.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  /*
   * ============================================================
   * HORA FORMATEADA
   * ============================================================
   */
  const horaFormateada = horaActual.toLocaleTimeString("es-CO", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  /*
   * ============================================================
   * SI NO HAY USUARIO
   * ============================================================
   */
  if (!usuario) {
    return (
      <div className="config-container">
        <div className="config-login-message">
          <FaUser className="config-login-icon" />

          <h2>Sesión no encontrada</h2>

          <p>
            No encontramos información de usuario. Inicia sesión nuevamente
            para acceder a tu configuración.
          </p>

          <button
            className="config-primary-button"
            onClick={() => navigate("/login")}
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="config-container">

      {/* ======================================================
          BOTÓN VOLVER
      ======================================================= */}
      <button
        className="btn-volver-config"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft />
        <span>Volver</span>
      </button>

      {/* ======================================================
          ENCABEZADO
      ======================================================= */}
      <section className="config-banner">

        <div className="config-banner-left">

          <div className="config-main-avatar">
            {(usuario?.nombre || "U").charAt(0).toUpperCase()}
          </div>

          <div className="config-banner-text">

            <span className="config-small-title">
              SMARTRESERVE
            </span>

            <h1>Configuración</h1>

            <p>
              Administra tu cuenta, seguridad y preferencias de SmartReserve.
            </p>

          </div>

        </div>

        {/* ==================================================
            FECHA Y HORA
        =================================================== */}
        <div className="config-banner-right">

          <div className="config-date-time-card">

            <div className="config-date-item">
              <FaCalendarAlt />

              <div>
                <span>Fecha</span>

                <strong>
                  {fechaFormateada}
                </strong>
              </div>
            </div>

            <div className="config-time-item">
              <FaClock />

              <div>
                <span>Hora actual</span>

                <strong>
                  {horaFormateada}
                </strong>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ======================================================
          CONTENIDO PRINCIPAL
      ======================================================= */}
      <main className="config-content">

        {/* ==================================================
            MI CUENTA
        =================================================== */}
        <section className="config-card config-account-card">

          <div className="config-card-header">

            <div className="config-card-icon config-icon-user">
              <FaUser />
            </div>

            <div>
              <span className="config-section-label">
                MI CUENTA
              </span>

              <h2>Información personal</h2>

              <p>
                Consulta y administra la información de tu cuenta.
              </p>
            </div>

          </div>

          <div className="config-account-body">

            <div className="config-profile-summary">

              <div className="config-profile-avatar">
                {(usuario?.nombre || "U").charAt(0).toUpperCase()}
              </div>

              <div className="config-profile-summary-text">

                <h3>
                  {usuario?.nombre || "Usuario"}
                </h3>

                <span>
                  {usuario?.tipoUsuario || "Usuario"}
                </span>

              </div>

            </div>

            <div className="config-account-data">

              <div className="config-data-item">

                <div className="config-data-icon">
                  <FaUser />
                </div>

                <div>
                  <span>Nombre completo</span>

                  <strong>
                    {usuario?.nombre || "No registrado"}
                  </strong>
                </div>

              </div>

              <div className="config-data-item">

                <div className="config-data-icon">
                  <FaEnvelope />
                </div>

                <div>
                  <span>Correo electrónico</span>

                  <strong>
                    {usuario?.correo || "No registrado"}
                  </strong>
                </div>

              </div>

              <div className="config-data-item">

                <div className="config-data-icon">
                  <FaShieldAlt />
                </div>

                <div>
                  <span>Tipo de usuario</span>

                  <strong className="config-role">
                    {usuario?.tipoUsuario || "usuario"}
                  </strong>
                </div>

              </div>

              <div className="config-data-item">

                <div className="config-data-icon config-status-icon">
                  <FaCheckCircle />
                </div>

                <div>
                  <span>Estado de la cuenta</span>

                  <strong className="config-status">
                    Activo
                  </strong>
                </div>

              </div>

            </div>

          </div>

          <div className="config-card-footer">

            <button
              className="config-primary-button"
              onClick={() => navigate("/editar-perfil")}
            >
              <FaEdit />
              Editar información
            </button>

          </div>

        </section>

        {/* ==================================================
            ACTIVIDAD
        =================================================== */}
        <section className="config-card">

          <div className="config-card-header">

            <div className="config-card-icon config-icon-calendar">
              <FaCalendarAlt />
            </div>

            <div>
              <span className="config-section-label">
                ACTIVIDAD
              </span>

              <h2>Mis reservas</h2>

              <p>
                Consulta el estado de tus reservas actuales.
              </p>
            </div>

          </div>

          <div className="config-activity-content">

            <div className="config-reservation-count">

              <span>Reservas activas</span>

              <strong>
                {cargando ? "..." : reservas.length}
              </strong>

            </div>

            {proximaReserva ? (
              <div className="config-next-reservation">

                <div className="config-next-header">

                  <span>
                    <FaCalendarAlt />
                    Próxima reserva
                  </span>

                </div>

                <h3>
                  {proximaReserva.sala}
                </h3>

                <div className="config-next-details">

                  <div>
                    <FaCalendarAlt />

                    <span>
                      {proximaReserva.fecha}
                    </span>
                  </div>

                  <div>
                    <FaClock />

                    <span>
                      {proximaReserva.horaInicio} -{" "}
                      {proximaReserva.horaFin}
                    </span>
                  </div>

                </div>

              </div>
            ) : (
              <div className="config-empty-reservation">

                <FaCalendarAlt />

                <h3>No tienes reservas próximas</h3>

                <p>
                  Cuando realices una reserva aparecerá aquí.
                </p>

                <button
                  className="config-secondary-button"
                  onClick={() => navigate("/reservar")}
                >
                  Crear una reserva
                </button>

              </div>
            )}

          </div>

          <div className="config-card-footer">

            <button
              className="config-secondary-button"
              onClick={() => navigate("/misreservas")}
            >
              Ver mis reservas
            </button>

          </div>

        </section>

        {/* ==================================================
            PREFERENCIAS
        =================================================== */}
        <section className="config-card">

          <div className="config-card-header">

            <div className="config-card-icon config-icon-bell">
              <FaBell />
            </div>

            <div>
              <span className="config-section-label">
                PREFERENCIAS
              </span>

              <h2>Preferencias</h2>

              <p>
                Configuración general de tu experiencia.
              </p>
            </div>

          </div>

          <div className="config-preferences">

            <div className="config-preference-row">

              <div className="config-preference-left">

                <div className="config-preference-icon">
                  <FaBell />
                </div>

                <div>
                  <strong>Notificaciones</strong>

                  <span>
                    Recibir avisos sobre tus reservas.
                  </span>
                </div>

              </div>

              <div className="config-toggle active">
                <span></span>
              </div>

            </div>

            <div className="config-preference-row">

              <div className="config-preference-left">

                <div className="config-preference-icon">
                  <FaGlobe />
                </div>

                <div>
                  <strong>Idioma</strong>

                  <span>
                    Idioma de la plataforma.
                  </span>
                </div>

              </div>

              <strong className="config-language">
                Español
              </strong>

            </div>

          </div>

        </section>

        {/* ==================================================
            SEGURIDAD
        =================================================== */}
        <section className="config-card">

          <div className="config-card-header">

            <div className="config-card-icon config-icon-lock">
              <FaLock />
            </div>

            <div>
              <span className="config-section-label">
                SEGURIDAD
              </span>

              <h2>Seguridad de la cuenta</h2>

              <p>
                Protege y administra el acceso a tu cuenta.
              </p>
            </div>

          </div>

          <div className="config-security-content">

            <div className="config-security-info">

              <div className="config-security-icon">
                <FaLock />
              </div>

              <div>
                <strong>Contraseña</strong>

                <span>
                  Mantén tu contraseña actualizada para proteger tu cuenta.
                </span>
              </div>

            </div>

            <button
              className="config-secondary-button"
              onClick={() => navigate("/cambiar-password")}
            >
              Cambiar contraseña
            </button>

          </div>

          <div className="config-logout-section">

            <div>

              <strong>Cerrar sesión</strong>

              <span>
                Finaliza tu sesión actual en SmartReserve.
              </span>

            </div>

            <button
              className="config-logout-button"
              onClick={cerrarSesion}
            >
              <FaSignOutAlt />
              Cerrar sesión
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Configuracion;
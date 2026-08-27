import React, { useEffect, useState } from "react";
import {
  FaCog,
  FaBell,
  FaCalendarCheck,
  FaShieldAlt,
  FaSave,
  FaUserCircle,
  FaCheckCircle,
} from "react-icons/fa";

import AdminPerfil from "./AdminPerfil";

function AdminConfiguracion({
  usuario,
  agregarNotificacion,
}) {
  const [notificacionesActivas, setNotificacionesActivas] =
    useState(true);

  const [confirmarReservas, setConfirmarReservas] =
    useState(true);

  const [bloqueoHorarios, setBloqueoHorarios] =
    useState(true);

  const [guardado, setGuardado] = useState(false);

  // =========================================================
  // CARGAR CONFIGURACIÃ“N
  // =========================================================

  useEffect(() => {
    try {
      const configuracionGuardada =
        localStorage.getItem("adminConfiguracion");

      if (!configuracionGuardada) {
        return;
      }

      const datos = JSON.parse(configuracionGuardada);

      setNotificacionesActivas(
        datos.notificacionesActivas ?? true
      );

      setConfirmarReservas(
        datos.confirmarReservas ?? true
      );

      setBloqueoHorarios(
        datos.bloqueoHorarios ?? true
      );
    } catch (error) {
      console.error(
        "Error cargando configuración:",
        error
      );
    }
  }, []);

  // =========================================================
  // GUARDAR CONFIGURACIÃ“N
  // =========================================================

  const guardarConfiguracion = () => {
    const configuracion = {
      notificacionesActivas,
      confirmarReservas,
      bloqueoHorarios,
    };

    localStorage.setItem(
      "adminConfiguracion",
      JSON.stringify(configuracion)
    );

    setGuardado(true);

    if (typeof agregarNotificacion === "function") {
      agregarNotificacion({
        tipo: "success",
        titulo: "Configuración actualizada",
        mensaje:
          "La configuración de SmartReserve fue actualizada correctamente.",
      });
    }

    setTimeout(() => {
      setGuardado(false);
    }, 2500);
  };

  return (
    <section className="admin-section admin-configuracion-section">

      {/* =====================================================
          ENCABEZADO
      ===================================================== */}

      <div className="admin-section-header admin-config-header">

        <div>
          <span>SISTEMA</span>

          <h2>
            Configuración
          </h2>

          <p>
            Administra las preferencias del sistema
            y la información de tu cuenta.
          </p>
        </div>

      </div>

      {/* =====================================================
          PREFERENCIAS
      ===================================================== */}

      <div className="admin-settings-card admin-config-card">

        <div className="admin-card-heading">

          <div>
            <span>PREFERENCIAS</span>

            <h3>
              Configuración general
            </h3>
          </div>

          <div className="admin-config-heading-icon">
            <FaCog />
          </div>

        </div>

        <div className="admin-settings-grid">

          {/* =================================================
              NOTIFICACIONES
          ================================================= */}

          <div className="admin-settings-content">

            <div className="admin-settings-icon">
              <FaBell />
            </div>

            <div className="admin-settings-info">

              <strong>
                Notificaciones
              </strong>

              <p>
                Mostrar alertas y novedades
                importantes del sistema.
              </p>

            </div>

            <label className="admin-switch">

              <input
                type="checkbox"
                checked={notificacionesActivas}
                onChange={(e) =>
                  setNotificacionesActivas(
                    e.target.checked
                  )
                }
              />

              <span className="admin-slider" />

            </label>

          </div>

          {/* =================================================
              CONFIRMACIÃ“N DE RESERVAS
          ================================================= */}

          <div className="admin-settings-content">

            <div className="admin-settings-icon green">
              <FaCalendarCheck />
            </div>

            <div className="admin-settings-info">

              <strong>
                Confirmación de reservas
              </strong>

              <p>
                Mantener las reservas nuevas
                con estado activo.
              </p>

            </div>

            <label className="admin-switch">

              <input
                type="checkbox"
                checked={confirmarReservas}
                onChange={(e) =>
                  setConfirmarReservas(
                    e.target.checked
                  )
                }
              />

              <span className="admin-slider" />

            </label>

          </div>

          {/* =================================================
              CONTROL DE HORARIOS
          ================================================= */}

          <div className="admin-settings-content">

            <div className="admin-settings-icon purple">
              <FaShieldAlt />
            </div>

            <div className="admin-settings-info">

              <strong>
                Control de horarios
              </strong>

              <p>
                Evitar reservas que se crucen
                en el mismo horario.
              </p>

            </div>

            <label className="admin-switch">

              <input
                type="checkbox"
                checked={bloqueoHorarios}
                onChange={(e) =>
                  setBloqueoHorarios(
                    e.target.checked
                  )
                }
              />

              <span className="admin-slider" />

            </label>

          </div>

        </div>

      </div>

      {/* =====================================================
          ESTADO DE CONFIGURACIÃ“N
      ===================================================== */}

      <div className="admin-settings-info admin-config-status">

        <div className="settings-info-icon">
          <FaCheckCircle />
        </div>

        <div>

          <strong>
            Configuración del sistema
          </strong>

          <p>
            Las preferencias administrativas
            se guardan localmente en SmartReserve.
          </p>

        </div>

      </div>

      {/* =====================================================
          BOTÃ“N GUARDAR CONFIGURACIÃ“N
      ===================================================== */}

      <div className="admin-save-container admin-config-save">

        <button
          type="button"
          className="primary-button"
          onClick={guardarConfiguracion}
        >

          {guardado ? (
            <>
              <FaCheckCircle />
              Configuración guardada
            </>
          ) : (
            <>
              <FaSave />
              Guardar configuración
            </>
          )}

        </button>

      </div>

      {/* =====================================================
          MI CUENTA
      ===================================================== */}

      <div className="admin-profile-container admin-account-section">

        <div className="admin-card-heading">

          <div>

            <span>MI CUENTA</span>

            <h3>
              Información personal y seguridad
            </h3>

          </div>

          <div className="admin-account-heading-icon">
            <FaUserCircle />
          </div>

        </div>

        <AdminPerfil
          usuario={usuario}
        />

      </div>

    </section>
  );
}

export default AdminConfiguracion;
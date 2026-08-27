import React, { useEffect, useState } from "react";
import {
  FaBars,
  FaBell,
  FaChevronDown,
} from "react-icons/fa";

function AdminTopbar({
  usuario,
  activeSection,
  notificaciones = [],
  cambiarSeccion,
  setSidebarOpen,
}) {
  const [mostrarNotificaciones, setMostrarNotificaciones] =
    useState(false);

  const [fechaHora, setFechaHora] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFechaHora(new Date());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const nombresSecciones = {
    dashboard: "Panel principal",
    usuarios: "Gestión de usuarios",
    reservas: "Gestión de reservas",
    notificaciones: "Centro de notificaciones",
    configuracion: "Configuración",
  };

  const cantidadNotificaciones = notificaciones.length;

  const inicial =
    usuario?.nombre?.trim()?.charAt(0)?.toUpperCase() || "A";

  return (
    <header className="admin-topbar">

      {/* =====================================================
          PARTE IZQUIERDA
          ===================================================== */}

      <div className="admin-topbar-left">

        <button
          type="button"
          className="admin-menu-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <FaBars />
        </button>

        <div className="admin-topbar-title">

          <span>
            Sistema de gestión
          </span>

          <h1>
            SmartReserve
          </h1>

        </div>

      </div>


      {/* =====================================================
          PARTE DERECHA
          CAMPANA + USUARIO
          ===================================================== */}

      <div className="admin-topbar-actions">

        {/* ===================================================
            NOTIFICACIONES
            =================================================== */}

        <div className="admin-notification-wrapper">

          <button
            type="button"
            className="admin-notification-button"
            onClick={() =>
              setMostrarNotificaciones(
                (valor) => !valor
              )
            }
            aria-label="Notificaciones"
            aria-expanded={mostrarNotificaciones}
          >

            <FaBell />

            {cantidadNotificaciones > 0 && (
              <span className="admin-notification-count">
                {cantidadNotificaciones > 9
                  ? "9+"
                  : cantidadNotificaciones}
              </span>
            )}

          </button>


          {/* =================================================
              DROPDOWN DE NOTIFICACIONES
              ================================================= */}

          {mostrarNotificaciones && (

            <div className="admin-notification-dropdown">

              <div className="admin-notification-dropdown-header">

                <div>

                  <strong>
                    Notificaciones
                  </strong>

                  <span>
                    {cantidadNotificaciones > 0
                      ? `${cantidadNotificaciones} pendientes`
                      : "No tienes pendientes"}
                  </span>

                </div>


                <button
                  type="button"
                  onClick={() => {
                    cambiarSeccion("notificaciones");
                    setMostrarNotificaciones(false);
                  }}
                >
                  Ver todas
                </button>

              </div>


              <div className="admin-dropdown-notifications">

                {notificaciones.length === 0 ? (

                  <div className="admin-dropdown-empty">
                    No tienes notificaciones nuevas.
                  </div>

                ) : (

                  notificaciones
                    .slice(0, 5)
                    .map((item) => (

                      <div
                        key={item.id}
                        className={`admin-dropdown-notification ${
                          item.leida === false
                            ? "unread"
                            : ""
                        }`}
                        onClick={() => {
                          cambiarSeccion("notificaciones");
                          setMostrarNotificaciones(false);
                        }}
                      >

                        <div className="dropdown-notification-icon">
                          <FaBell />
                        </div>


                        <div>

                          <strong>
                            {item.titulo ||
                              "Notificación"}
                          </strong>

                          <p>
                            {item.mensaje || ""}
                          </p>

                          <small>
                            {item.fecha
                              ? new Date(
                                  item.fecha
                                ).toLocaleString("es-CO")
                              : ""}
                          </small>

                        </div>

                      </div>

                    ))

                )}

              </div>


              {notificaciones.length > 0 && (

                <button
                  type="button"
                  className="view-all-notifications"
                  onClick={() => {
                    cambiarSeccion("notificaciones");
                    setMostrarNotificaciones(false);
                  }}
                >
                  Ver todas las notificaciones
                </button>

              )}

            </div>

          )}

        </div>


        {/* ===================================================
            USUARIO
            =================================================== */}

        <div className="admin-user-profile">

          <div className="admin-user-avatar">
            {inicial}
          </div>


          <div className="admin-user-info">

            <strong>
              {usuario?.nombre || "Administrador"}
            </strong>

            <span>
              Administrador
            </span>

          </div>


          <FaChevronDown
            className="admin-user-chevron"
          />

        </div>

      </div>

    </header>
  );
}

export default AdminTopbar;
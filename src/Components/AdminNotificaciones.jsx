import React from "react";
import {
  FaBell,
  FaTrash,
  FaBroom,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

function AdminNotificaciones({
  notificaciones,
  eliminarNotificacion,
  limpiarNotificaciones,
}) {
  const obtenerIcono = (tipo) => {
    if (tipo === "error") {
      return <FaExclamationTriangle />;
    }

    if (
      tipo === "success" ||
      tipo === "reserva"
    ) {
      return <FaCheckCircle />;
    }

    return <FaInfoCircle />;
  };

  return (
    <section className="admin-section">

      <div className="admin-section-header">

        <div>
          <span>ACTIVIDAD</span>

          <h2>Notificaciones</h2>

          <p>
            Consulta las novedades y actividades
            recientes del sistema.
          </p>
        </div>

        {notificaciones.length > 0 && (
          <button
            className="secondary-button"
            onClick={limpiarNotificaciones}
          >
            <FaBroom />
            Limpiar todo
          </button>
        )}

      </div>

      {notificaciones.length === 0 ? (
        <div className="admin-empty-card">

          <FaBell />

          <h3>
            Todo está al día
          </h3>

          <p>
            No tienes notificaciones pendientes.
          </p>

        </div>
      ) : (
        <div className="admin-full-notifications">

          {notificaciones.map(
            (notificacion) => (
              <article
                key={notificacion.id}
                className="admin-full-notification"
              >

                <div className="admin-notification-icon">
                  {obtenerIcono(
                    notificacion.tipo
                  )}
                </div>

                <div className="admin-full-notification-body">

                  <div className="admin-full-notification-header">

                    <strong>
                      {notificacion.titulo}
                    </strong>

                    <small>
                      {notificacion.fecha
                        ? new Date(
                            notificacion.fecha
                          ).toLocaleString(
                            "es-CO"
                          )
                        : ""}
                    </small>

                  </div>

                  <p>
                    {notificacion.mensaje}
                  </p>

                </div>

                <button
                  className="notification-delete-button"
                  onClick={() =>
                    eliminarNotificacion(
                      notificacion.id
                    )
                  }
                >
                  <FaTrash />
                </button>

              </article>
            )
          )}

        </div>
      )}

    </section>
  );
}

export default AdminNotificaciones;
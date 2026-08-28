import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerReservas } from "../services/reservaService";
import Sidebar from "../Components/Sidebar";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [reservas, setReservas] = useState([]);
  const claveNotificaciones = `notificacionesVistas_${usuario?.nombre}`;

const [notificacionesVistas, setNotificacionesVistas] = useState(
  JSON.parse(localStorage.getItem(claveNotificaciones)) || []
);
  const [horaActual, setHoraActual] = useState(new Date());

  useEffect(() => {
    cargarReservas();
  }, []);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const cargarReservas = async () => {
    try {
      const data = await obtenerReservas();

    const misReservas = data.filter(
  (reserva) =>
    reserva.usuario === usuario?.nombre &&
    reserva.estado !== "Cancelada"
    );

setReservas(misReservas);

      localStorage.setItem(
        "reservasSmartReserve",
        JSON.stringify(misReservas)
      );
    } catch (error) {
      console.log("Error cargando reservas:", error);
    }
  };

  const ahora = new Date();

const reservasFuturas = reservas
  .filter((reserva) => {
    const fechaHoraReserva = new Date(
      `${reserva.fecha}T${reserva.horaInicio}`
    );

    return fechaHoraReserva >= ahora;
  })
  .sort((a, b) => {
    const fechaA = new Date(
      `${a.fecha}T${a.horaInicio}`
    );

    const fechaB = new Date(
      `${b.fecha}T${b.horaInicio}`
    );

    return fechaA - fechaB;
  });

const proximaReserva = reservasFuturas[0] || null;

const salasDisponibles = 3;

const fechaHoy = horaActual.toISOString().split("T")[0];

const salasOcupadasHoy = new Set(
  reservas
    .filter(
      (reserva) =>
        reserva.fecha === fechaHoy &&
        reserva.estado !== "Cancelada"
    )
    .map((reserva) => reserva.sala)
);

const cantidadSalasDisponibles =
  Math.max(
    0,
    salasDisponibles - salasOcupadasHoy.size
  );

  const fechaActual = horaActual.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const notificacionesPendientes = reservas.filter(
  (reserva) =>
    !notificacionesVistas.includes(Number(reserva.id))
).length;

  const abrirNotificaciones = () => {
    const ids = reservas.map(
  (reserva) => Number(reserva.id)
);

   localStorage.setItem(
  claveNotificaciones,
  JSON.stringify(ids)
);

    setNotificacionesVistas(ids);

    navigate("/notificaciones");
  };

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <main className="dashboard-main">

        {/* ENCABEZADO */}

        <header className="dashboard-topbar">

          <div className="dashboard-heading">

            <span className="dashboard-date">
              {fechaActual}
            </span>

            <h1>
              Bienvenido, {usuario?.nombre || "Usuario"} 👋
            </h1>

            <p>
              Aquí tienes un resumen de tu actividad en SmartReserve.
            </p>

          </div>

          <div className="dashboard-tools">

            <button
              className="notification-button"
              onClick={abrirNotificaciones}
              title="Notificaciones"
            >
              🔔

              {notificacionesPendientes > 0 && (
                <span className="notification-badge">
                  {notificacionesPendientes}
                </span>
              )}
            </button>

            <div className="clock-box">

              <span>Hora actual</span>

              <strong>
                {horaActual.toLocaleTimeString("es-CO")}
              </strong>

            </div>

          </div>

        </header>

        {/* PRÓXIMA RESERVA */}

        <section className="main-reservation">

          <div className="reservation-header">

            <div>
              <span className="section-label">
                AGENDA
              </span>

              <h2>
                Próxima reserva
              </h2>
            </div>

            <div className="reservation-icon">
              📅
            </div>

          </div>

          {proximaReserva ? (

            <div className="reservation-body">

              <div className="reservation-main">

                <span className="reservation-label">
                  SALA
                </span>

                <h3>
                  {proximaReserva.sala}
                </h3>

              </div>

              <div className="reservation-details">

                <div>
                  <span>📅</span>

                  <div>
                    <small>Fecha</small>
                    <strong>
                      {proximaReserva.fecha}
                    </strong>
                  </div>
                </div>

                <div>
                  <span>🕐</span>

                  <div>
                    <small>Horario</small>
                    <strong>
                      {proximaReserva.horaInicio} -{" "}
                      {proximaReserva.horaFin}
                    </strong>
                  </div>
                </div>

                <span className="active-status">
                  {proximaReserva.estado || "Activa"}
                </span>

              </div>

            </div>

          ) : (

            <div className="empty-reservation">

              <div className="empty-reservation-icon">
                📭
              </div>

              <div>

                <h3>
                  No tienes reservas próximas
                </h3>

                <p>
                  Cuando realices una reserva aparecerá aquí.
                </p>

              </div>

              <button
                onClick={() => navigate("/reservar")}
              >
                + Crear una reserva
              </button>

            </div>

          )}

        </section>

        {/* ESTADÍSTICAS */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-card-icon blue">
              📅
            </div>

            <div>
              <span>Reservas activas</span>
              <strong>{reservas.length}</strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-card-icon green">
              🏢
            </div>

            <div>
              <span>Salas disponibles</span>
              <strong>{cantidadSalasDisponibles}</strong>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-card-icon orange">
              🔔
            </div>

            <div>
              <span>Notificaciones</span>
              <strong>{notificacionesPendientes}</strong>
            </div>

          </div>

        </section>

        {/* ACTIVIDAD */}

        <section className="activity-section">

          <div className="activity-heading">

            <div>
              <span className="section-label">
                ACTIVIDAD
              </span>

              <h2>
                Actividad reciente
              </h2>
            </div>

          </div>

          {reservas.length > 0 ? (

            <div className="activity-list">

              {reservas.slice(0, 4).map((reserva) => (

                <div
                  className="activity-item"
                  key={reserva.id}
                >

                  <div className="activity-icon">
                    ✓
                  </div>

                  <div className="activity-info">

                    <strong>
                      Reserva realizada
                    </strong>

                    <span>
                      {reserva.sala} · {reserva.fecha}
                    </span>

                  </div>

                  <span className="activity-status">
                    {reserva.estado || "Activa"}
                  </span>

                </div>

              ))}

            </div>

          ) : (

            <div className="no-activity">

              <span>📋</span>

              <p>
                Todavía no tienes actividad reciente.
              </p>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;
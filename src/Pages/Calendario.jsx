import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import "./Calendario.css";

import { obtenerReservas } from "../services/reservaService";

function Calendario() {

    const navigate = useNavigate();

    const [fecha, setFecha] = useState(new Date());
    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarReservas();
    }, []);

    const cargarReservas = async () => {

        try {

            setCargando(true);
            setError("");

            const data = await obtenerReservas();

            console.log(
                "Reservas cargadas en calendario:",
                data
            );

            // Mostrar únicamente reservas activas
            const reservasActivas = data.filter(
                (reserva) =>
                    reserva.estado !== "Cancelada"
            );

            setReservas(reservasActivas);

        } catch (error) {

            console.error(
                "Error cargando reservas:",
                error
            );

            setError(
                "No fue posible cargar las reservas."
            );

        } finally {

            setCargando(false);

        }
    };

    const fechaSeleccionada = fecha.toLocaleDateString("en-CA");

    const reservasDelDia = reservas.filter(
        (reserva) =>
            reserva.fecha === fechaSeleccionada
    );

    return (

        <div className="page-container">

            <div className="page-header">

                <button
                    className="btn-volver"
                    onClick={() => navigate(-1)}
                >
                    ← Volver
                </button>

                <h1>
                    📅 Calendario de Reservas
                </h1>

                <p>
                    Consulta la disponibilidad de salas
                    y reservas programadas.
                </p>

            </div>

            <div className="page-card">

                {cargando ? (

                    <div className="fecha-info">
                        <p>
                            Consultando reservas...
                        </p>
                    </div>

                ) : error ? (

                    <div className="error-message">
                        {error}
                    </div>

                ) : (

                    <>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center"
                            }}
                        >

                            <Calendar
                                onChange={setFecha}
                                value={fecha}

                                tileClassName={({ date }) => {

                                    const fechaCalendario = date.toLocaleDateString("en-CA");

                                    const existeReserva =
                                        reservas.some(
                                            (reserva) =>
                                                reserva.fecha ===
                                                fechaCalendario
                                        );

                                    return existeReserva
                                        ? "dia-con-reserva"
                                        : null;
                                }}
                            />

                        </div>

                        <div className="fecha-info">

                            <h2>
                                📌 Fecha seleccionada
                            </h2>

                            <p>
                                {fecha.toLocaleDateString()}
                            </p>

                        </div>

                        <hr />

                        <h2>
                            🏢 Reservas del día
                        </h2>

                        {reservasDelDia.length === 0 ? (

                            <div className="disponible">
                                🟢 No existen reservas para esta fecha.
                                Las salas están disponibles según las
                                reservas registradas.
                            </div>

                        ) : (

                            <div className="reservas-calendario">

                                {reservasDelDia.map(
                                    (reserva) => (

                                        <div
                                            key={reserva.id}
                                            className="dashboard-card"
                                        >

                                            <h3>
                                                🏢 {reserva.sala}
                                            </h3>

                                            <p>
                                                👤 Usuario:
                                                <strong>
                                                    {" "}
                                                    {reserva.usuario}
                                                </strong>
                                            </p>

                                            <p>
                                                🕘 Horario:
                                                <strong>
                                                    {" "}
                                                    {reserva.horaInicio}
                                                    {" - "}
                                                    {reserva.horaFin}
                                                </strong>
                                            </p>

                                            <p>
                                                Estado:
                                                <strong>
                                                    {" "}
                                                    {reserva.estado}
                                                </strong>
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </>

                )}

            </div>

        </div>

    );
}

export default Calendario;




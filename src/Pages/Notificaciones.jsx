import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Notificaciones.css";

import { obtenerReservas } from "../services/reservaService";

function Notificaciones() {
    const [notificaciones, setNotificaciones] = useState([]);

     const [todasLeidas, setTodasLeidas] = useState(false);
useEffect(() => {

    cargarNotificaciones();

}, []);


useEffect(() => {

    if(notificaciones.length > 0){

        const ids = notificaciones.map(
            n => n.id
        );

        localStorage.setItem(
            "notificacionesVistas",
            JSON.stringify(ids)
        );

    }

}, [notificaciones]);
    const navigate = useNavigate();
    localStorage.setItem(
    "notificacionesVistas",
    localStorage.getItem("reservasVistas") || 0
);

    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );

    

    const cargarNotificaciones = async () => {

        try {

            const reservas = await obtenerReservas();

            const misReservas = reservas.filter(

                (reserva) =>

                    reserva.usuario === usuario?.nombre

            );

            const lista = misReservas.map((reserva) => ({

                id: reserva.id,

                tipo: "Reserva",

                mensaje:
                    `Tu reserva de la sala ${reserva.sala} fue registrada correctamente.`,

                fecha: reserva.fecha,

                horaInicio: reserva.horaInicio,

                horaFin: reserva.horaFin,

                sala: reserva.sala,

                estado: reserva.estado

            }));

            setNotificaciones(lista);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        cargarNotificaciones();

    }, []);

       return (

    <div className="notificaciones-page">

        <div className="notificaciones-header">

            <button
                className="btn-volver"
                onClick={() => navigate(-1)}
            >
                ← Volver
            </button>


            <h1>
                🔔 Notificaciones
            </h1>


            <p>
                Aquí puedes consultar las notificaciones relacionadas con tus reservas.
            </p>


        </div>



        <div className="notificaciones-container">


            {
                notificaciones.length === 0 ? (

                    <div className="notificacion-card">

                        <div className="icono-notificacion">
                            ℹ️
                        </div>


                        <div>

                            <h3>
                                Sin notificaciones
                            </h3>


                            <p>
                                No tienes reservas registradas por el momento.
                            </p>

                        </div>


                    </div>


                ) : (


                    notificaciones.map((n) => (

                        <div
                            className="notificacion-card"
                            key={n.id}
                        >


                            <div className="notificacion-top">


                                <div className="icono-notificacion">

                                    🔔

                                </div>



                                <div className="notificacion-title">


                                    <h3>

                                        {n.tipo}

                                    </h3>


                                    <span className="estado-notificacion">

                                        {n.estado}

                                    </span>


                                </div>


                            </div>



                            <p className="mensaje-notificacion">

                                {n.mensaje}

                            </p>



                            <div className="datos-reserva">


                                <p>
                                    🏢 <strong>Sala:</strong> {n.sala}
                                </p>


                                <p>
                                    📅 <strong>Fecha:</strong> {n.fecha}
                                </p>


                                <p>
                                    🕒 <strong>Horario:</strong> {n.horaInicio} - {n.horaFin}
                                </p>


                            </div>



                        </div>


                    ))

                )

            }


        </div>


    </div>

);

}

export default Notificaciones;
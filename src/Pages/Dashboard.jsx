import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { obtenerReservas } from "../services/reservaService";

import "./Dashboard.css";


function Dashboard() {


    const navigate = useNavigate();


    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );



    const [reservas, setReservas] = useState([]);

  const [notificacionesVistas, setNotificacionesVistas] = useState(
    JSON.parse(localStorage.getItem("notificacionesVistas")) || []
);
    const [horaActual, setHoraActual] = useState(
        new Date()
    );



    const cargarReservas = async () => {


        try {


            const data = await obtenerReservas();



            const misReservas = data.filter(

                (reserva) =>

                    reserva.usuario === usuario?.nombre

            );



            setReservas(misReservas);

             localStorage.setItem(
             "reservasSmartReserve",
            JSON.stringify(misReservas)
           );


        } catch(error) {


            console.log(error);


        }


    };




    useEffect(() => {


        cargarReservas();


    }, []);




    useEffect(() => {


        const intervalo = setInterval(() => {


            setHoraActual(
                new Date()
            );


        },1000);



        return () => clearInterval(intervalo);



    }, []);




    const proximaReserva = reservas[0];




    const fechaActual = horaActual.toLocaleDateString(

        "es-CO",

        {

            weekday:"long",

            year:"numeric",

            month:"long",

            day:"numeric"

        }

    );




    const cerrarSesion = () => {


        localStorage.clear();


        navigate("/login");


    };
        return (

        <div className="dashboard-page">


            <header className="dashboard-header">


                <div className="logo-area">


                    <div className="logo-circle">

                        SR

                    </div>


                    <h2>

                        SmartReserve

                    </h2>


                </div>




               <div className="user-area">


    <div className="notificacion-icon">


        <button
            className="btn-notificacion"

            onClick={() => {


                const idsReservas = reservas.map(

                    reserva => reserva.id

                );


                localStorage.setItem(

                    "notificacionesVistas",

                    JSON.stringify(idsReservas)

                );


                setNotificacionesVistas(idsReservas);


                navigate("/notificaciones");


            }}
        >

            🔔


            {

                reservas.filter(

                    reserva => !notificacionesVistas.includes(reserva.id)

                ).length > 0 && (


                    <span className="contador-notificacion">


                        {

                            reservas.filter(

                                reserva => !notificacionesVistas.includes(reserva.id)

                            ).length


                        }


                    </span>


                )

            }


        </button>


    </div>
                    <span>

                        👤 {usuario?.nombre || "Usuario"}

                    </span>

                    <button

                        onClick={cerrarSesion}

                    >
                        Cerrar sesión

                    </button>

                </div>

            </header>

            <main className="dashboard-content">

                <h1>

                    Bienvenido a SmartReserve

                </h1>

                <p className="subtitle">

                    Gestiona tus espacios de reuniones de forma rápida y organizada.

                </p>

                <div className="welcome-info">

                    <div>

                        <h3>

                            👋 Hola, {usuario?.nombre}

                        </h3>


                        <p>

                            Nos alegra verte nuevamente.

                        </p>

                    </div>

                    <div className="fecha-box">

                        <p>

                            📅 {fechaActual}

                        </p>

                        <p>

                            🕒 {horaActual.toLocaleTimeString("es-CO")}

                        </p>

                    </div>

                </div>

                <section className="cards-container">

                    <div className="dashboard-card">


                        <div className="card-icon">

                            📅

                        </div>

                        <h3>

                            Reservar sala

                        </h3>

                        <p>

                            Encuentra espacios disponibles para tus reuniones.

                        </p>

                        <button

                            onClick={() => navigate("/reservar")}

                        >
                            Buscar salas

                        </button>

                    </div>

                    <div className="dashboard-card">


                        <div className="card-icon">

                            🏢

                        </div>

                        <h3>

                            Mis reservas

                        </h3>

                        <p>

                            Consulta y administra tus próximas reuniones.

                        </p>

                        <button

                            onClick={() => navigate("/misreservas")}

                        >
                            Ver reservas

                        </button>

                    </div>

                    <div className="dashboard-card">


                        <div className="card-icon">

                            ⚙️

                        </div>


                        <h3>

                            Configuración

                        </h3>

                        <p>

                            Gestiona tu información personal.

                        </p>


                        <button

                            onClick={() => navigate("/configuracion")}

                        >
                            Configurar

                        </button>


                    </div>


                    <div className="dashboard-card">


                        <div className="card-icon">

                            🗓️

                        </div>



                        <h3>

                            Calendario

                        </h3>


                        <p>

                            Consulta las reservas organizadas por fecha.

                        </p>


                        <button

                            onClick={() => navigate("/calendario")}

                        >

                            Abrir calendario

                        </button>



                    </div>


                </section>


                <section className="summary-container">


    <div className="summary-card principal">


        <div className="summary-header">

            <h2>
                📌 Próxima reserva
            </h2>

        </div>



        {
            proximaReserva ? (


                <div className="reserva-info">


                    <h3>
                        🏢 {proximaReserva.sala}
                    </h3>


                    <p>

                        📅 Fecha:

                        <strong>
                            {" "}{proximaReserva.fecha}
                        </strong>

                    </p>


                    <p>

                        🕒 Horario:

                        <strong>
                            {" "}{proximaReserva.horaInicio} - {proximaReserva.horaFin}
                        </strong>

                    </p>


                    <span className="estado-activa">

                        {proximaReserva.estado}

                    </span>


                </div>


            ) : (


                <p>
                    No tienes reservas próximas.
                </p>


            )

        }
        
             


                       </div>



    <div className="summary-card estadisticas">


        <div className="summary-header">

            <h2>
                📊 Resumen
            </h2>

        </div>



        <div className="estadistica-item">


            <span>
                ✔ Reservas activas
            </span>


            <strong>
                {reservas.length}
            </strong>


        </div>



        <div className="estadistica-item">


            <span>
                🏢 Salas disponibles
            </span>


            <strong>
                5
            </strong>


        </div>



        <div className="estadistica-item">


            <span>
                🔔 Notificaciones
            </span>


            <strong>
                {
                    reservas.filter(

                        reserva => 
                        !notificacionesVistas.includes(reserva.id)

                    ).length
                }
            </strong>


        </div>


    </div>


</section>


            </main>




        </div>


    );


}



export default Dashboard;
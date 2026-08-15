import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import "./Page.css";

import { obtenerReservas } from "../services/reservaService";


function Calendario() {


    const navigate = useNavigate();


    const [fecha, setFecha] = useState(new Date());

    const [reservas, setReservas] = useState([]);
    const usuario = JSON.parse(
    localStorage.getItem("usuario")
);



    useEffect(() => {

        cargarReservas();

    }, []);




    const cargarReservas = async () => {

        try {


           const data = await obtenerReservas();


const misReservas = data.filter(

    (reserva) =>
        reserva.usuario === usuario?.nombre

);


setReservas(misReservas);


        } catch(error) {


            console.log(error);


        }

    };





    const fechaSeleccionada = fecha
        .toISOString()
        .split("T")[0];




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


                <div style={{display:"flex", justifyContent:"center"}}>

              <Calendar

                onChange={setFecha}

                     value={fecha}


                     tileClassName={({date}) => {


        const fechaCalendario = date
            .toISOString()
            .split("T")[0];


        const existeReserva = reservas.some(

            reserva =>
                reserva.fecha === fechaCalendario

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





                {

                    reservasDelDia.length === 0 ?


                    (


                        <p>

                            No existen reservas para esta fecha.

                        </p>


                    )


                    :



                    (


                        <div className="reservas-calendario">


                            {

                                reservasDelDia.map((reserva)=>(


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
                                                {" "}{reserva.usuario}
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


                                ))


                            }


                        </div>


                    )


                }




            </div>




        </div>


    );

}


export default Calendario;
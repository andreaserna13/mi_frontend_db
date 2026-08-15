import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    obtenerReservas,
    eliminarReserva
} from "../services/reservaService";

import "./Page.css";


function MisReservas() {


    const navigate = useNavigate();


    const [reservas, setReservas] = useState([]);

    const usuario = JSON.parse(
    localStorage.getItem("usuario")
);



    const cargarReservas = async () => {

        try {

            const data = await obtenerReservas();


const misReservas = data.filter(

    (reserva) =>

        reserva.usuario === usuario?.nombre

);


setReservas(misReservas);


        } catch (error) {

            console.log(error);

        }

    };





    useEffect(() => {

        cargarReservas();

    }, []);







    const cancelarReserva = async (id) => {


        const confirmar = window.confirm(
            "¿Deseas cancelar esta reserva?"
        );



        if (!confirmar) return;



        try {


            await eliminarReserva(id);


            cargarReservas();



        } catch (error) {


            console.log(error);


            alert(
                "No fue posible eliminar la reserva"
            );


        }


    };







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
                    📋 Mis Reservas
                </h1>





                <p>

                    Aquí puedes consultar y cancelar tus reservas.

                </p>





            </div>









            <div className="page-card">






                {

                    reservas.length === 0 ?





                    (


                        <p>

                            No existen reservas registradas.

                        </p>


                    )





                    :





                    (



                    <table className="tabla-reservas">






                        <thead>



                            <tr>


                                <th>
                                    Usuario
                                </th>


                                <th>
                                    Sala
                                </th>


                                <th>
                                    Fecha
                                </th>


                                <th>
                                    Inicio
                                </th>


                                <th>
                                    Fin
                                </th>


                                <th>
                                    Estado
                                </th>


                                <th>
                                    Acción
                                </th>



                            </tr>



                        </thead>









                        <tbody>





                            {

                            reservas.map((reserva) => (



                                <tr key={reserva.id}>


                                    <td>

                                        {reserva.usuario}

                                    </td>





                                    <td>

                                        {reserva.sala}

                                    </td>





                                    <td>

                                        {reserva.fecha}

                                    </td>





                                    <td>

                                        {reserva.horaInicio}

                                    </td>





                                    <td>

                                        {reserva.horaFin}

                                    </td>





                                    <td>

                                        {reserva.estado}

                                    </td>





                                    <td>

                                        <button

                                            className="btn-cancelar"

                                            onClick={() =>
                                                cancelarReserva(reserva.id)
                                            }

                                        >

                                            Cancelar

                                        </button>


                                    </td>





                                </tr>



                            ))


                            }





                        </tbody>







                    </table>



                    )

                }





            </div>






        </div>


    );

}



export default MisReservas;
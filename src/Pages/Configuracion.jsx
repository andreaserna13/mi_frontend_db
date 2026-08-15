import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Configuracion.css";


function Configuracion() {


    const navigate = useNavigate();


    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );


    const [reservas, setReservas] = useState([]);



    useEffect(() => {


        const reservasGuardadas = JSON.parse(
            localStorage.getItem("reservasSmartReserve")
        ) || [];



        const misReservas = reservasGuardadas.filter(

            (reserva) =>

                reserva.usuario === usuario?.nombre

        );



        setReservas(misReservas);



    }, []);



    const cerrarSesion = () => {


        localStorage.clear();

        navigate("/login");


    };





    return (


        <div className="config-container">



            <div className="config-header">



                <button

                    className="btn-volver"

                    onClick={() => navigate(-1)}

                >

                    ← Volver

                </button>



                <h1>

                    ⚙️ Configuración

                </h1>



                <p>

                    Administra tu cuenta y preferencias de SmartReserve.

                </p>



            </div>







            <div className="config-grid">





                <div className="config-card">


                    <h2>

                        👤 Información del perfil

                    </h2>



                    <div className="dato">

                        <span>
                            Nombre
                        </span>


                        <strong>

                            {usuario?.nombre || "Usuario"}

                        </strong>


                    </div>





                    <div className="dato">

                        <span>
                            Tipo de usuario
                        </span>


                        <strong>

                            {usuario?.tipoUsuario || "Usuario"}

                        </strong>


                    </div>





                    <div className="dato">

                        <span>
                            Estado
                        </span>


                        <strong className="activo">

                            Activo

                        </strong>


                    </div>



                    <button

                        className="btn-config"

                        onClick={() => navigate("/editar-perfil")}

                    >

                        ✏️ Editar información

                    </button>



                </div>









                <div className="config-card">


                    <h2>

                        📊 Actividad

                    </h2>



                    <div className="dato">


                        <span>

                            Reservas realizadas

                        </span>



                        <strong>

                            {reservas.length}

                        </strong>


                    </div>





                    {

                        reservas.length > 0 && (


                            <div className="dato">


                                <span>

                                    Próxima sala

                                </span>



                                <strong>

                                    {reservas[0].sala}

                                </strong>



                            </div>


                        )

                    }



                </div>









                <div className="config-card">



                    <h2>

                        🔔 Preferencias

                    </h2>




                    <div className="preferencia">


                        <span>

                            Notificaciones de reservas

                        </span>



                        <b>

                            Activadas

                        </b>



                    </div>





                    <div className="preferencia">


                        <span>

                            Idioma

                        </span>



                        <b>

                            Español

                        </b>



                    </div>




                </div>









                <div className="config-card">



                    <h2>

                        🔐 Seguridad

                    </h2>




                    <button

                        className="btn-config"

                        onClick={() => navigate("/cambiar-password")}

                    >

                        Cambiar contraseña

                    </button>







                    <button

                        className="btn-config cerrar"

                        onClick={cerrarSesion}

                    >

                        🚪 Cerrar sesión

                    </button>



                </div>





            </div>






        </div>


    );


}


export default Configuracion;
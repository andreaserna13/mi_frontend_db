import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./EditarPerfil.css";


function EditarPerfil() {


    const navigate = useNavigate();


    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );



    const [nombre, setNombre] = useState(
        usuario?.nombre || ""
    );


    const [correo, setCorreo] = useState(
        usuario?.correo || ""
    );





    const guardarCambios = () => {


        const usuarioActualizado = {

            ...usuario,

            nombre: nombre,

            correo: correo

        };



        localStorage.setItem(

            "usuario",

            JSON.stringify(usuarioActualizado)

        );



        alert("Información actualizada correctamente");


        navigate("/configuracion");


    };





    return (


        <div className="editar-container">



            <div className="editar-header">


                <button

                    className="btn-volver"

                    onClick={() => navigate(-1)}

                >

                    ← Volver

                </button>



                <h1>

                    ✏️ Editar información personal

                </h1>



                <p>

                    Actualiza tus datos personales en SmartReserve.

                </p>


            </div>







            <div className="editar-card">


                <h2>

                    👤 Datos personales

                </h2>



                <label>

                    Nombre completo

                </label>


                <input

                    type="text"

                    value={nombre}

                    onChange={(e) => setNombre(e.target.value)}

                />





                <label>

                    Correo electrónico

                </label>


                <input

                    type="email"

                    value={correo}

                    onChange={(e) => setCorreo(e.target.value)}

                />





                <button

                    className="btn-guardar"

                    onClick={guardarCambios}

                >

                    💾 Guardar cambios

                </button>




            </div>




        </div>


    );


}


export default EditarPerfil;
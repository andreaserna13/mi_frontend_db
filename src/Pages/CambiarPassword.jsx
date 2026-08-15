import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CambiarPassword.css";


function CambiarPassword() {


    const navigate = useNavigate();


    const usuario = JSON.parse(
        localStorage.getItem("usuario")
    );


    const [claveActual, setClaveActual] = useState("");
    const [nuevaClave, setNuevaClave] = useState("");
    const [confirmarClave, setConfirmarClave] = useState("");

    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");



    const cambiarPassword = async (e) => {

        e.preventDefault();


        setMensaje("");
        setError("");



        if(nuevaClave !== confirmarClave){

            setError(
                "Las contraseñas nuevas no coinciden"
            );

            return;

        }



        try {


            const respuesta = await fetch(

                `${import.meta.env.VITE_API_BASE_URL}/api/usuario/cambiar-password`,

                {

                    method:"PUT",

                    headers:{
                        "Content-Type":"application/json"
                    },


                    body:JSON.stringify({

                        nombre: usuario.nombre,

                        claveActual,

                        nuevaClave

                    })

                }

            );



            const data = await respuesta.json();



            if(respuesta.ok){


                setMensaje(
                    "Contraseña actualizada correctamente"
                );


                setTimeout(()=>{

                    navigate("/configuracion");

                },1500);



            }else{


                setError(
                    data.mensaje || 
                    "No fue posible cambiar la contraseña"
                );


            }



        }catch(error){


            console.log(error);

            setError(
                "Error de conexión con el servidor"
            );


        }



    };




    return (

        <div className="password-container">


            <div className="password-card">


                <button
                    className="btn-volver"
                    onClick={()=>navigate(-1)}
                >

                    ← Volver

                </button>



                <h1>
                    🔐 Cambiar contraseña
                </h1>


                <p>
                    Actualiza la contraseña de tu cuenta SmartReserve.
                </p>




                <form onSubmit={cambiarPassword}>


                    <label>
                        Contraseña actual
                    </label>


                    <input

                        type="password"

                        value={claveActual}

                        onChange={(e)=>setClaveActual(e.target.value)}

                        required

                    />




                    <label>
                        Nueva contraseña
                    </label>


                    <input

                        type="password"

                        value={nuevaClave}

                        onChange={(e)=>setNuevaClave(e.target.value)}

                        required

                    />





                    <label>
                        Confirmar nueva contraseña
                    </label>


                    <input

                        type="password"

                        value={confirmarClave}

                        onChange={(e)=>setConfirmarClave(e.target.value)}

                        required

                    />





                    {
                        error &&

                        <p className="error">
                            {error}
                        </p>

                    }




                    {
                        mensaje &&

                        <p className="mensaje">
                            {mensaje}
                        </p>

                    }





                    <button type="submit">

                        Guardar cambios

                    </button>



                </form>


            </div>


        </div>


    );

}


export default CambiarPassword;
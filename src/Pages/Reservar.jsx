import React from "react";
import { useNavigate } from "react-router-dom";
import ReservaForm from "../Components/ReservaForm";
import "./Page.css";

function Reservar() {

    const navigate = useNavigate();

    return (

        <div className="page-container">

            <div className="page-header">

                <button
                    className="btn-volver"
                    onClick={() => navigate(-1)}
                >
                    ← Volver
                </button>

                <h1>📅 Reservar sala</h1>

                <p>
                    Selecciona la información de tu reserva y confirma la disponibilidad.
                </p>

            </div>

            <div className="page-card">

                <ReservaForm />

            </div>

        </div>

    );

}

export default Reservar;
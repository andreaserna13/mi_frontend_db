import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import "./CambiarPassword.css";

function CambiarPassword() {
  const navigate = useNavigate();

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "null"
  );

  const [claveActual, setClaveActual] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");

  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] =
    useState(false);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  // =====================================
  // CAMBIAR CONTRASEÑA
  // =====================================

  const cambiarPassword = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (!usuario) {
      setError(
        "No se encontró la sesión del usuario."
      );
      return;
    }

    if (!claveActual || !nuevaClave || !confirmarClave) {
      setError(
        "Todos los campos son obligatorios."
      );
      return;
    }

    if (nuevaClave.length < 6) {
      setError(
        "La nueva contraseña debe tener mínimo 6 caracteres."
      );
      return;
    }

    if (nuevaClave !== confirmarClave) {
      setError(
        "Las contraseñas nuevas no coinciden."
      );
      return;
    }

    if (claveActual === nuevaClave) {
      setError(
        "La nueva contraseña debe ser diferente a la actual."
      );
      return;
    }

    try {
      setGuardando(true);

      const respuesta = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/usuario/cambiar-password`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: usuario.id,
            nombre: usuario.nombre,
            claveActual,
            nuevaClave,
          }),
        }
      );

      const data = await respuesta.json();

      if (respuesta.ok) {
        setMensaje(
          "Contraseña actualizada correctamente."
        );

        setClaveActual("");
        setNuevaClave("");
        setConfirmarClave("");

        setTimeout(() => {
          navigate("/configuracion");
        }, 1500);
      } else {
        setError(
          data.mensaje ||
            "No fue posible cambiar la contraseña."
        );
      }
    } catch (error) {
      console.error(
        "Error cambiando contraseña:",
        error
      );

      setError(
        "Error de conexión con el servidor."
      );
    } finally {
      setGuardando(false);
    }
  };

  // =====================================
  // SI NO EXISTE USUARIO
  // =====================================

  if (!usuario) {
    return (
      <div className="password-container">
        <div className="password-card">
          <h1>Sesión no encontrada</h1>

          <p>
            No se encontró la información del usuario.
          </p>

          <button
            type="button"
            className="password-btn"
            onClick={() => navigate("/login")}
          >
            Ir al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  // =====================================
  // INPUT CON OJO
  // =====================================

  const CampoPassword = ({
    label,
    value,
    setValue,
    mostrar,
    setMostrar,
    placeholder,
  }) => {
    return (
      <div className="password-field">
        <label>{label}</label>

        <div className="password-input-wrapper">
          <FaLock className="password-lock-icon" />

          <input
            type={mostrar ? "text" : "password"}
            value={value}
            onChange={(e) =>
              setValue(e.target.value)
            }
            placeholder={placeholder}
            autoComplete="new-password"
            required
          />

          <button
            type="button"
            className="password-eye"
            onClick={() =>
              setMostrar(!mostrar)
            }
            aria-label={
              mostrar
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
            title={
              mostrar
                ? "Ocultar contraseña"
                : "Mostrar contraseña"
            }
          >
            {mostrar ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="password-container">
      <div className="password-card">

        {/* =====================================
            VOLVER
        ===================================== */}

        <button
          type="button"
          className="btn-volver"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          Volver
        </button>

        {/* =====================================
            ENCABEZADO
        ===================================== */}

        <div className="password-header">
          <div className="password-icon">
            <FaLock />
          </div>

          <div>
            <h1>
              Cambiar contraseña
            </h1>

            <p>
              Actualiza la contraseña de tu
              cuenta SmartReserve.
            </p>
          </div>
        </div>

        {/* =====================================
            INFORMACIÓN USUARIO
        ===================================== */}

        <div className="password-user-info">
          <strong>
            Usuario:
          </strong>

          <span>
            {usuario.nombre}
          </span>
        </div>

        {/* =====================================
            FORMULARIO
        ===================================== */}

        <form
          onSubmit={cambiarPassword}
          className="password-form"
        >

          <CampoPassword
            label="Contraseña actual"
            value={claveActual}
            setValue={setClaveActual}
            mostrar={mostrarActual}
            setMostrar={setMostrarActual}
            placeholder="Ingresa tu contraseña actual"
          />

          <CampoPassword
            label="Nueva contraseña"
            value={nuevaClave}
            setValue={setNuevaClave}
            mostrar={mostrarNueva}
            setMostrar={setMostrarNueva}
            placeholder="Ingresa tu nueva contraseña"
          />

          <CampoPassword
            label="Confirmar nueva contraseña"
            value={confirmarClave}
            setValue={setConfirmarClave}
            mostrar={mostrarConfirmar}
            setMostrar={setMostrarConfirmar}
            placeholder="Repite la nueva contraseña"
          />

          {/* =====================================
              AYUDA
          ===================================== */}

          <div className="password-help">
            <FaLock />

            <span>
              La nueva contraseña debe tener
              mínimo 6 caracteres.
            </span>
          </div>

          {/* =====================================
              ERROR
          ===================================== */}

          {error && (
            <div className="password-message error">
              {error}
            </div>
          )}

          {/* =====================================
              ÉXITO
          ===================================== */}

          {mensaje && (
            <div className="password-message success">
              <FaCheckCircle />
              {mensaje}
            </div>
          )}

          {/* =====================================
              BOTÓN
          ===================================== */}

          <button
            type="submit"
            className="password-btn"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "Guardar cambios"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CambiarPassword;
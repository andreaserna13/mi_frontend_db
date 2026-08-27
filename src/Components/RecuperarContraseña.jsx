import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RecuperarContraseña.css";

function RecuperarContrasena() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [respuestaSeguridad, setRespuestaSeguridad] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [mensaje, setMensaje] = useState("");

  const URL_BACKEND = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");

    try {
      const response = await fetch(`${URL_BACKEND}/api/auth/recuperar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          respuestaSeguridad,
          nuevaClave,
        }),
      });

      const data = await response.json();
      setMensaje(data.mensaje);
    } catch (error) {
      console.error(error);
      setMensaje("Error de conexión con el servidor");
    }
  };

  return (
    <div className="recuperar-container">

      <div className="recuperar-card">

        <div className="recuperar-icono">
          🔐
        </div>

        <h1>SmartReserve</h1>

        <h2>Recuperar Contraseña</h2>

        <p className="recuperar-descripcion">
          Recupera el acceso a tu cuenta de forma segura respondiendo tu
          pregunta de seguridad.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Nombre de usuario</label>

            <input
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Respuesta de seguridad</label>

            <input
              type="text"
              placeholder="Escribe tu respuesta"
              value={respuestaSeguridad}
              onChange={(e) => setRespuestaSeguridad(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Nueva contraseña</label>

            <input
              type="password"
              placeholder="Ingresa tu nueva contraseña"
              value={nuevaClave}
              onChange={(e) => setNuevaClave(e.target.value)}
              required
            />
          </div>

          {mensaje && (
            <div className="mensaje">
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            className="btn-recuperar"
          >
            Cambiar contraseña
          </button>

          <button
            type="button"
            className="btn-volver"
            onClick={() => navigate("/login")}
          >
            ← Volver al Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default RecuperarContrasena;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import "./Registro.css";

const Registro = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [tipoUsuario] = useState("usuario");
  const [preguntaSeguridad, setPreguntaSeguridad] = useState("");
  const [respuestaSeguridad, setRespuestaSeguridad] = useState("");
  const [error, setError] = useState("");

  const URL_BACKEND =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (contrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!preguntaSeguridad) {
      setError("Debes seleccionar una pregunta de seguridad");
      return;
    }

    if (!respuestaSeguridad.trim()) {
      setError("Debes escribir una respuesta de seguridad");
      return;
    }

    try {
      const res = await fetch(`${URL_BACKEND}/auth/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: usuario,
          clave: contrasena,
          tipoUsuario,
          preguntaSeguridad,
          respuestaSeguridad,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.mensaje || "Usuario creado correctamente");
        navigate("/login");
      } else {
        setError(
          data.mensaje ||
            data.error ||
            "No fue posible registrar el usuario"
        );
      }
    } catch (err) {
      console.error("Error de registro:", err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-box">

        <div className="registro-icono">
          <FaUserPlus />
        </div>

        <h1>SmartReserve</h1>

        <h2>Formulario de Registro</h2>

        <p className="registro-descripcion">
          Crea tu cuenta para comenzar a gestionar reservas de forma segura.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              placeholder="Confirma tu contraseña"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Pregunta de seguridad</label>
            <select
              value={preguntaSeguridad}
              onChange={(e) => setPreguntaSeguridad(e.target.value)}
              required
            >
              <option value="">Selecciona una pregunta de seguridad</option>
              <option value="¿Cuál es el nombre de tu mascota?">
                ¿Cuál es el nombre de tu mascota?
              </option>
              <option value="¿Cuál es tu ciudad de nacimiento?">
                ¿Cuál es tu ciudad de nacimiento?
              </option>
              <option value="¿Cuál era el nombre de tu colegio?">
                ¿Cuál era el nombre de tu colegio?
              </option>
              <option value="¿Cuál es tu comida favorita?">
                ¿Cuál es tu comida favorita?
              </option>
            </select>
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

          {error && (
            <div className="mensaje-error">
              {error}
            </div>
          )}

          <button type="submit" className="btn-registrar">
            Registrar
          </button>

        </form>

        <button
          type="button"
          className="btn-volver"
          onClick={() => navigate("/")}
        >
          ← Volver al inicio
        </button>

      </div>
    </div>
  );
};

export default Registro;

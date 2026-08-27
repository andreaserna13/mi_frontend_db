
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [tipoUsuario, setTipoUsuario] = useState("usuario");
  const [nombre, setNombre] = useState("");
  const [clave, setClave] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [error, setError] = useState("");

  const URL_BACKEND = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const respuesta = await fetch(
        `${URL_BACKEND}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nombre,
            clave,
            tipoUsuario
          })
        }
      );

      const data = await respuesta.json();

      if (respuesta.ok) {
        localStorage.setItem(
          "usuario",
          JSON.stringify(data.usuario)
        );

        if (data.usuario.tipoUsuario === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(
          data.mensaje || "Credenciales incorrectas"
        );
      }
    } catch (error) {
      console.error(error);
      setError("No hay conexión con el servidor");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">

        <h1>SmartReserve</h1>

        <h2>Iniciar sesión</h2>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="login-field">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="password-container">
            <input
              type={mostrarClave ? "text" : "password"}
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
            />

            <span
              className="toggle-password"
              onClick={() =>
                setMostrarClave(!mostrarClave)
              }
              title={
                mostrarClave
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setMostrarClave(!mostrarClave);
                }
              }}
            >
              {mostrarClave ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="login-field">
            <select
              className="login-select"
              value={tipoUsuario}
              onChange={(e) =>
                setTipoUsuario(e.target.value)
              }
            >
              <option value="usuario">
                Usuario
              </option>

              <option value="admin">
                Administrador
              </option>
            </select>
          </div>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button
            className="login-button"
            type="submit"
          >
            Ingresar
          </button>

        </form>

        <p className="forgot-password">
          <Link to="/recuperar-password">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>

        <p className="register-text">
          ¿No tienes cuenta?{" "}
          <Link to="/registro">
            Registrarse
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;

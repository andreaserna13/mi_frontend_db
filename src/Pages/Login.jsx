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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre,
            clave,
            tipoUsuario,
          }),
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
    <div
      className="login-page"
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="login-box"
        style={{
          width: "380px",
          maxWidth: "100%",
          padding: "20px 34px 18px",
          boxSizing: "border-box",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "22px",
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.25)",
        }}
      >
        {/* TITULO */}
        <h1
          style={{
            margin: "0",
            padding: "0",
            color: "#2563eb",
            fontSize: "34px",
            lineHeight: "1.1",
          }}
        >
          SmartReserve
        </h1>

        {/* SUBTITULO */}
        <h2
          style={{
            margin: "4px 0 9px",
            padding: "0",
            color: "#1e293b",
            fontSize: "22px",
            lineHeight: "1.1",
          }}
        >
          Iniciar sesión
        </h2>

        {/* FORMULARIO */}
        <form
          onSubmit={handleLogin}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            margin: "0",
            padding: "0",
          }}
        >
          {/* NOMBRE DE USUARIO */}
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{
              width: "100%",
              height: "42px",
              margin: "0",
              padding: "8px 12px",
              boxSizing: "border-box",
              border: "1px solid #cbd5e1",
              borderRadius: "9px",
              outline: "none",
              background: "#ffffff",
              color: "#1e293b",
              fontSize: "15px",
            }}
          />

          {/* CONTRASEÑA */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "42px",
              margin: "0",
              padding: "0",
              boxSizing: "border-box",
            }}
          >
            <input
              type={mostrarClave ? "text" : "password"}
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
              style={{
                width: "100%",
                height: "42px",
                margin: "0",
                padding: "8px 43px 8px 12px",
                boxSizing: "border-box",
                border: "1px solid #cbd5e1",
                borderRadius: "9px",
                outline: "none",
                background: "#ffffff",
                color: "#1e293b",
                fontSize: "15px",
              }}
            />

            {/* OJO */}
            <span
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
              style={{
                position: "absolute",
                right: "9px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "25px",
                height: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                cursor: "pointer",
                zIndex: 5,
              }}
            >
              {mostrarClave ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* TIPO DE USUARIO */}
          <select
            value={tipoUsuario}
            onChange={(e) =>
              setTipoUsuario(e.target.value)
            }
            style={{
              width: "100%",
              height: "42px",
              margin: "0",
              padding: "8px 12px",
              boxSizing: "border-box",
              border: "1px solid #cbd5e1",
              borderRadius: "9px",
              outline: "none",
              background: "#ffffff",
              color: "#1e293b",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            <option value="usuario">
              Usuario
            </option>

            <option value="admin">
              Administrador
            </option>
          </select>

          {/* ERROR */}
          {error && (
            <p
              style={{
                margin: "2px 0",
                padding: "5px 8px",
                color: "#b91c1c",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "7px",
                fontSize: "12px",
                lineHeight: "1.2",
              }}
            >
              {error}
            </p>
          )}

          {/* BOTON */}
          <button
            type="submit"
            style={{
              width: "100%",
              height: "42px",
              margin: "3px 0 0",
              padding: "8px",
              boxSizing: "border-box",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "9px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Ingresar
          </button>
        </form>

        {/* RECUPERAR CONTRASEÑA */}
        <p
          style={{
            margin: "8px 0 0",
            padding: "0",
            lineHeight: "1.2",
          }}
        >
          <Link
            to="/recuperar-password"
            style={{
              color: "#2563eb",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </p>

        {/* REGISTRO */}
        <p
          style={{
            margin: "5px 0 0",
            padding: "0",
            color: "#64748b",
            fontSize: "14px",
            lineHeight: "1.2",
          }}
        >
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            style={{
              color: "#2563eb",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
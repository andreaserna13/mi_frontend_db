import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

// Páginas
import LandingPage from "./Pages/LandingPage";

// Componentes
import Login from "./Components/Login";
import Reservas from "./Components/Reservas";
import AdminPanel from "./Components/AdminPanel";
import RecuperarContraseña from "./Components/RecuperarContraseña";
import Registro from "./Components/Registro";
import PermisosForm from "./Components/PermisosForm";

function App() {
  const [logueado, setLogueado] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tipo = localStorage.getItem("tipoUsuario");

    if (token && tipo) {
      setLogueado(true);
      setTipoUsuario(tipo);
    }
  }, []);

  return (
    <Router>
      <Routes>

        {/* Página principal */}
        <Route path="/" element={<LandingPage />} />

        {/* Login */}
        <Route
          path="/login"
          element={
            <Login
              logueado={logueado}
              tipoUsuario={tipoUsuario}
              setLogueado={(valor) => {
                setLogueado(valor);

                if (!valor) {
                  localStorage.removeItem("token");
                  localStorage.removeItem("tipoUsuario");
                }
              }}
              setTipoUsuario={(tipo) => {
                setTipoUsuario(tipo);

                if (tipo) {
                  localStorage.setItem("tipoUsuario", tipo);
                } else {
                  localStorage.removeItem("tipoUsuario");
                }
              }}
            />
          }
        />

        {/* Reservas */}
        <Route
          path="/reservas"
          element={
            logueado ? (
              <Reservas
                tipoUsuario={tipoUsuario}
                setLogueado={setLogueado}
                setTipoUsuario={setTipoUsuario}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Administrador */}
        <Route
          path="/admin"
          element={
            logueado && tipoUsuario === "admin" ? (
              <AdminPanel
                tipoUsuario={tipoUsuario}
                setLogueado={setLogueado}
                setTipoUsuario={setTipoUsuario}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Recuperar contraseña */}
        <Route
          path="/recuperar-contraseña"
          element={<RecuperarContraseña />}
        />

        {/* Registro */}
        <Route path="/registro" element={<Registro />} />

        {/* Formulario de permisos */}
        <Route path="/permisos" element={<PermisosForm />} />

      </Routes>
    </Router>
  );
}

export default App;
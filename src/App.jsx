import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Registro from "./Components/Registro";
import Dashboard from "./Pages/Dashboard";

import AdminPanel from "./Components/AdminPanel";

import Reservar from "./Pages/Reservar";
import Calendario from "./Pages/Calendario";
import MisReservas from "./Pages/MisReservas";
import Configuracion from "./Pages/Configuracion";
import Notificaciones from "./Pages/Notificaciones";

import EditarPerfil from "./Pages/EditarPerfil";
import CambiarPassword from "./Pages/CambiarPassword";
import RecuperarContrasena from "./Components/RecuperarContraseña";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route path="/registro" element={<Registro />} />

        <Route
          path="/recuperar-password"
          element={<RecuperarContrasena />}
        />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/admin" element={<AdminPanel />} />

        <Route path="/reservar" element={<Reservar />} />

        <Route path="/calendario" element={<Calendario />} />

        <Route path="/misreservas" element={<MisReservas />} />

        <Route path="/configuracion" element={<Configuracion />} />

        <Route path="/editar-perfil" element={<EditarPerfil />} />

        <Route
          path="/cambiar-password"
          element={<CambiarPassword />}
        />

        <Route
          path="/notificaciones"
          element={<Notificaciones />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
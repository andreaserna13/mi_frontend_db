import { useState } from "react";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaShieldAlt,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

import DashboardAdmin from "./DashboardAdmin";
import UsuariosAdmin from "./UsuariosAdmin";
import ReservasAdmin from "./ReservasAdmin";
import NotificacionesAdmin from "./NotificacionesAdmin";
import ConfiguracionAdmin from "./ConfiguracionAdmin";

import "../AdminPanel.css";

export default function AdminPanel() {
  const usuarioActual =
    JSON.parse(localStorage.getItem("usuario")) || {
      nombre: "Administrador",
      tipoUsuario: "admin",
    };

  const [section, setSection] = useState("inicio");
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarSesion = () => {
    if (!window.confirm("¿Deseas cerrar sesión?")) return;

    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  const renderContenido = () => {
    switch (section) {
      case "usuarios":
        return <UsuariosAdmin usuarioActual={usuarioActual} />;

      case "reservas":
        return <ReservasAdmin usuarioActual={usuarioActual} />;

      case "notificaciones":
        return <NotificacionesAdmin />;

      case "configuracion":
        return <ConfiguracionAdmin />;

      default:
        return <DashboardAdmin usuarioActual={usuarioActual} />;
    }
  };

  return (
    <div className="admin-panel">
      <aside className={`admin-sidebar ${menuAbierto ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <FaShieldAlt />
          </div>

          <div>
            <h2>SmartReserve</h2>
            <span>Administrador</span>
          </div>
        </div>

        <nav className="admin-navigation">
          <button
            className={section === "inicio" ? "active" : ""}
            onClick={() => setSection("inicio")}
          >
            <FaHome />
            Inicio
          </button>

          <button
            className={section === "usuarios" ? "active" : ""}
            onClick={() => setSection("usuarios")}
          >
            <FaUsers />
            Usuarios
          </button>

          <button
            className={section === "reservas" ? "active" : ""}
            onClick={() => setSection("reservas")}
          >
            <FaCalendarAlt />
            Reservas
          </button>

          <button
            className={section === "notificaciones" ? "active" : ""}
            onClick={() => setSection("notificaciones")}
          >
            <FaBell />
            Notificaciones
          </button>

          <button
            className={section === "configuracion" ? "active" : ""}
            onClick={() => setSection("configuracion")}
          >
            <FaCog />
            Configuración
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={cerrarSesion}>
            <FaSignOutAlt />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-button"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <FaBars />
          </button>

          <div className="admin-topbar-title">
            <span>Panel administrativo</span>
            <h1>SmartReserve</h1>
          </div>

          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {usuarioActual.nombre.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{usuarioActual.nombre}</strong>
              <span>Administrador</span>
            </div>
          </div>
        </header>

        <div className="admin-content">{renderContenido()}</div>
      </main>
    </div>
  );
}
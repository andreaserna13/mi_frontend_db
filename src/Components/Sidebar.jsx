import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

const cerrarSesion = () => {
  const claveNotificaciones =
    `notificacionesVistas_${usuario?.nombre}`;

  const notificacionesVistas =
    localStorage.getItem(claveNotificaciones);

  localStorage.clear();

  if (notificacionesVistas) {
    localStorage.setItem(
      claveNotificaciones,
      notificacionesVistas
    );
  }

  navigate("/");
};

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">

        <div className="logo-box">
          SR
        </div>

        <div>
          <h2>SmartReserve</h2>
          <span>Sistema Inteligente de Reservas</span>
        </div>

      </div>

      <div className="sidebar-user">

        <p>Bienvenido</p>

        <strong>
          {usuario?.nombre || "Usuario"}
        </strong>

      </div>

      <nav className="sidebar-menu">

        <NavLink
          to="/dashboard"
          className="menu-item"
        >
          <span>⌂</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/reservar"
          className="menu-item"
        >
          <span>📅</span>
          Reservar
        </NavLink>

        <NavLink
          to="/calendario"
          className="menu-item"
        >
          <span>🗓️</span>
          Calendario
        </NavLink>

        <NavLink
          to="/misreservas"
          className="menu-item"
        >
          <span>📋</span>
          Mis Reservas
        </NavLink>

        <NavLink
          to="/notificaciones"
          className="menu-item"
        >
          <span>🔔</span>
          Notificaciones
        </NavLink>

        <NavLink
          to="/configuracion"
          className="menu-item"
        >
          <span>⚙️</span>
          Configuración
        </NavLink>

      </nav>

      <button
        className="logout-btn"
        onClick={cerrarSesion}
      >
        <span>🚪</span>
        Cerrar sesión
      </button>

    </aside>
  );
}

export default Sidebar;

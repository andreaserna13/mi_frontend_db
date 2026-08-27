import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="logo">SmartReserve</div>

      <ul className="menu">
        <li><a href="#inicio">Inicio</a></li>
        <li><a href="#caracteristicas">Características</a></li>
        <li><a href="#nosotros">Nosotros</a></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>

      <Link to="/login" className="login-btn">
        Iniciar sesión
      </Link>
    </nav>
  );
}

export default NavBar;
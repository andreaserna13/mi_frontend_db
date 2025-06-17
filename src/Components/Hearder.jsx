import React from "react";

const Header = () => {
  return (
    <header>
      <div className="header-container">
        <a href="principal.html">
          <img src="/src/assets/Imagenes/UML.png" alt="Logo UML" className="logo-header" />
        </a>
        <h3>Sistema de Gestión de Reservas</h3>
      </div>
    </header>
  );
};

export default Header;

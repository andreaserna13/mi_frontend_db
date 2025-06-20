import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './reservas.css';


const AdminPanel = ({ setLogueado, setTipoUsuario }) => {
  const [section, setSection] = useState(null);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('adminToken');
    setLogueado(false);           
    setTipoUsuario('');           
    navigate('/');
  };

  const renderSection = () => {
    switch (section) {
      case 'verUsuarios':
        return <p>Aquí se mostrarán los usuarios registrados.</p>;
      case 'agregarUsuario':
        return (
          <form>
            <h3>Agregar Usuario</h3>
            <input type="text" placeholder="Nombre" />
            <input type="email" placeholder="Correo" />
            <button className="action-button" type="submit">Guardar</button>
          </form>
        );
      case 'verPermisos':
        return <p>Aquí se mostrarán los permisos asignados.</p>;
      case 'modificarPermisos':
        return (
          <form>
            <h3>Modificar Permisos</h3>
            <input type="text" placeholder="ID Usuario" />
            <select>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
            <button className="action-button" type="submit">Actualizar</button>
          </form>
        );
      case 'crearReserva':
        return (
          <form>
            <h3>Crear Reserva</h3>
            <input type="text" placeholder="Sala" />
            <input type="datetime-local" />
            <button className="action-button" type="submit">Reservar</button>
          </form>
        );
      case 'cancelarReserva':
        return (
          <form onSubmit={(e) => {
            e.preventDefault();
            alert('Reserva cancelada');
          }}>
            <h3>Cancelar Reserva</h3>
            <input type="text" placeholder="ID de la reserva" />
            <input type="datetime-local" placeholder="Fecha y hora de la reserva" />
            <button className="cancel-button" type="submit">Cancelar</button>
          </form>
        );
      default:
        return <p>Selecciona una opción para administrar.</p>;
    }
  };

  return (
    <div className="reservas-container" style={{ backgroundImage: 'url(/sala-de-reunio.jpeg)' }}>
      <div className="reservas-header">
        <h1 className="titulo-principal">Panel de Administración</h1>
        <div className="header-right">
          <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </div>

      <div className="form-container">
        <div className="form-section">
          <h2>Gestión de Usuarios</h2>
          <button className="action-button" onClick={() => setSection('verUsuarios')}>Ver Usuarios</button>
          <button className="action-button" onClick={() => setSection('agregarUsuario')}>Agregar Usuario</button>
        </div>

        <div className="form-section">
          <h2>Gestión de Permisos</h2>
          <button className="action-button" onClick={() => setSection('verPermisos')}>Ver Permisos</button>
          <button className="action-button" onClick={() => setSection('modificarPermisos')}>Modificar Permisos</button>
        </div>

        <div className="form-section">
          <h2>Reservas del Administrador</h2>
          <button className="action-button" onClick={() => setSection('crearReserva')}>Crear Reserva</button>
          <button className="action-button cancel-button" onClick={() => setSection('cancelarReserva')}>Cancelar Reserva</button>
        </div>

        <div className="form-section">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;







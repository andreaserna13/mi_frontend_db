import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './reservas.css';


const Reservas = ({ tipoUsuario, setLogueado, setTipoUsuario }) => { // recibimos setLogueado y setTipoUsuario
  const [showNotifications, setShowNotifications] = useState(false);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [sala, setSala] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [reservas, setReservas] = useState({
    conferencia: [
      { id: 1, fecha: "2025-04-10", hora: "10:00", usuario: 'admin' },
      { id: 2, fecha: "2025-04-12", hora: "14:00", usuario: 'usuario1' },
    ],
    reunion: [
      { id: 3, fecha: "2025-04-11", hora: "09:00", usuario: 'usuario2' },
    ],
    evento: [
      { id: 4, fecha: "2025-04-10", hora: "16:00", usuario: 'admin' },
    ],
  });
  const navigate = useNavigate(); 

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const verificarDisponibilidad = (event) => {
    event.preventDefault();
    const reserva = reservas[sala]?.find(
      (r) => r.fecha === fecha && r.hora === hora
    );
    if (reserva) {
      setErrorMessage(`La sala ${sala} está ocupada en la fecha ${fecha} a las ${hora}.`);
    } else {
      setErrorMessage('');
      alert("Reserva confirmada.");
      const nuevaReserva = { id: Date.now(), fecha, hora, usuario: tipoUsuario };
      setReservas({
        ...reservas,
        [sala]: [...reservas[sala], nuevaReserva],
      });
    }
  };

  const eliminarReserva = (id, sala) => {
    const nuevasReservas = reservas[sala].filter(reserva => reserva.id !== id);
    setReservas({
      ...reservas,
      [sala]: nuevasReservas,
    });
  };

  // --- FUNCION MEJORADA DE CERRAR SESION ---
  const cerrarSesion = () => {
    localStorage.removeItem('token');  // Limpiar token guardado
    setLogueado(false);                 // Cambiar estado a no logueado
    setTipoUsuario('');                 // Limpiar tipoUsuario
    navigate('/');                     // Volver a la página de login
  };

  return (
    <div className="reservas-container">
      <header className="reservas-header">
        <h1 className="titulo-principal">Sistema de Gestión de Reservas</h1>
        <div className="header-right">
          <button className="notifications-button" onClick={toggleNotifications}>
            🔔
          </button>
          <button className="logout-button" onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
        {showNotifications && (
          <div className="notifications-list">
            <p>1. Reserva aprobada</p>
            <p>2. Cambios en horario de sala</p>
          </div>
        )}
      </header>

      <main className="form-container">
        <section className="form-section">
          <h2>Reserva de Sala</h2>
          <form onSubmit={verificarDisponibilidad}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              required
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            />
            <input
              type="date"
              name="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
            <input
              type="time"
              name="hora"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            />
            <select
              name="sala"
              value={sala}
              onChange={(e) => setSala(e.target.value)}
              required
            >
              <option value="">Selecciona una sala</option>
              <option value="conferencia">Sala de Conferencias</option>
              <option value="reunion">Sala de Reuniones</option>
              <option value="evento">Auditorio</option>
            </select>
            <textarea
              name="comentarios"
              rows="4"
              placeholder="Comentarios adicionales"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            />
            <button type="submit" className="action-button">Confirmar Reserva</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>
        </section>

        {tipoUsuario === 'admin' && (
          <section className="admin-container">
            <h2>Gestionar Reservas</h2>
            <div className="admin-reservas">
              {Object.keys(reservas).map((salaKey) => (
                <div key={salaKey} className="admin-sala">
                  <h3>{salaKey === 'conferencia' ? 'Sala de Conferencias' : salaKey === 'reunion' ? 'Sala de Reuniones' : 'Auditorio'}</h3>
                  <ul>
                    {reservas[salaKey].map((reserva) => (
                      <li key={reserva.id}>
                        {reserva.fecha} a las {reserva.hora} - {reserva.usuario}
                        <button onClick={() => eliminarReserva(reserva.id, salaKey)} className="delete-button">Eliminar</button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="form-section">
          <h2>Cancelar Reserva</h2>
          <form>
            <input type="date" name="fecha" required />
            <input type="time" name="hora" required />
            <button type="submit" className="action-button cancel-button">Cancelar Reserva</button>
          </form>
        </section>

        <section className="form-section">
          <h2>Descargar Archivo de Existencia</h2>
          <p>Haz clic en el botón para descargar el archivo que verifica la existencia actual de los datos.</p>
          <a href="archivo_existencia.pdf" download>
            <button className="action-button download-button">Descargar Archivo</button>
          </a>
        </section>
      </main>
    </div>
  );
};

export default Reservas;

















     
























import React, { useState } from 'react';

const OlvidasteContrasena = ({ cambiarVista }) => {
  const [correo, setCorreo] = useState('');

  // Aquí va la función que envía el correo al backend
  const manejarEnvio = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/auth/recuperar-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo }), // <-- aquí envías el correo
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje); // Correo enviado correctamente
        cambiarVista('login'); // Regresar a login o la vista que quieras
      } else {
        alert(data.mensaje); // Muestra el error que envía el backend
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={manejarEnvio}>
        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <button type="submit">Enviar instrucciones</button>
      </form>
      <div className="links">
        <a href="#" onClick={() => cambiarVista('login')}>Volver al inicio</a>
      </div>
    </div>
  );
};

export default OlvidasteContrasena;

















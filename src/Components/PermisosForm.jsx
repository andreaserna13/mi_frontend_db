import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PermisosForm = () => {
  const navigate = useNavigate();
  const [permiso, setPermiso] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario de permisos enviado con: ', permiso);
    // Aquí podrías llamar a una API si decides implementar el backend
  };

  const volverAlInicio = () => {
    navigate('/');
  };

  return (
    <div className="login-container">
      <h2>Formulario de Permisos</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tipo de Permiso"
          value={permiso}
          onChange={(e) => setPermiso(e.target.value)}
          required
        />
        <button type="submit">Enviar Permiso</button>
      </form>

      <button onClick={volverAlInicio} style={{ marginTop: '10px' }}>
        Volver al inicio
      </button>
    </div>
  );
};

export default PermisosForm;




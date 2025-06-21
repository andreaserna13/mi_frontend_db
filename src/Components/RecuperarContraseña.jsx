import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecuperarContraseña.css';
import { recuperarContrasena } from '../service/useService'; // ✅ importamos servicio

function RecuperarContraseña() {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await recuperarContrasena(correo); // ✅ usamos servicio

      if (data.mensaje?.toLowerCase().includes('enviado')) {
        setMensaje(data.mensaje || 'Correo enviado con instrucciones');
        setError(false);
        setCorreo('');
      } else {
        setMensaje(data.mensaje || 'Error al enviar el correo');
        setError(true);
      }
    } catch {
      setMensaje('Error al enviar el correo');
      setError(true);
    }
  };

  return (
    <form className="recuperar-container" onSubmit={handleSubmit}>
      <h2>Recuperar Contraseña</h2>
      <input
        type="email"
        placeholder="Ingresa tu correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <button type="submit">Enviar</button>

      <button
        type="button"
        onClick={() => navigate('/')}
        style={{ marginTop: '10px' }}
      >
        Volver al inicio
      </button>

      {mensaje && (
        <p style={{ color: error ? 'red' : 'green', marginTop: '10px' }}>
          {mensaje}
        </p>
      )}
    </form>
  );
}

export default RecuperarContraseña;

























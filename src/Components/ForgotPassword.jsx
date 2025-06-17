// ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';  // Asegúrate de que el archivo CSS esté en la ruta correcta.

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Lógica simple de validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un correo válido.');
      return;
    }

    // Aquí podrías agregar una llamada a la API o lógica para el envío de recuperación de contraseña
    setMessage('Te hemos enviado un enlace para restablecer tu contraseña a tu correo.');
    setError('');
    setEmail('');

    // Navegar de vuelta al login después de enviar el correo
    setTimeout(() => navigate('/login'), 3001);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
          <button type="submit">Enviar enlace</button>
        </form>
        <p>
          <a href="/login">Volver al inicio de sesión</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

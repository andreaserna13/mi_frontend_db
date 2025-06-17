import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // Asegúrate de que el archivo CSS esté en la ruta correcta.

const Login = ({ setLogueado, setTipoUsuario }) => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [tipoUsuario, setTipoUsuarioState] = useState('usuario');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Lógica de validación del login
    if (
      (usuario.toLowerCase() === 'admin' && tipoUsuario === 'admin' && clave === 'admin') ||
      (usuario.toLowerCase() === 'usuario' && tipoUsuario === 'usuario' && clave === 'usuario')
    ) {
      setLogueado(true);
      setTipoUsuario(tipoUsuario);  // Asegura que el tipo de usuario se actualice correctamente
      navigate(tipoUsuario === 'admin' ? '/admin' : '/reservas');
    } else {
      setError('Datos incorrectos, intenta nuevamente.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />

          {/* Aquí agregamos el título "Tipo de Usuario" */}
          <select
            value={tipoUsuario}
            onChange={(e) => setTipoUsuarioState(e.target.value)}
            required
          >
            <option value="usuario">Tipo de Usuario</option>
            <option value="admin">Administrador</option>
            <option value="usuario">Usuario</option>
          </select>

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Entrar</button>
        </form>

        <div className="links">
          {/* Restaurando los enlaces */}
          <a href="/recuperar-contraseña">¿Olvidaste tu contraseña?</a>
          <a href="/registro">¿No tienes cuenta? Regístrate</a>
          <a href="/permisos">Formulario de permisos</a>
        </div>
      </div>
    </div>
  );
};

export default Login;


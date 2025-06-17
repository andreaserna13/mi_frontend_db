// Ejemplo en App.jsx o Layout.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import AdminPanel from './components/AdminPanel';
import Reservas from './components/Reservas';

function App() {
  const [logueado, setLogueado] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState('');

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setLogueado(false);
    setTipoUsuario('');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Login
              logueado={logueado}
              tipoUsuario={tipoUsuario}
              setLogueado={setLogueado}
              setTipoUsuario={setTipoUsuario}
            />
          }
        />
        <Route
          path="/admin"
          element={<AdminPanel cerrarSesion={cerrarSesion} />}
        />
        <Route
          path="/reservas"
          element={<Reservas cerrarSesion={cerrarSesion} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
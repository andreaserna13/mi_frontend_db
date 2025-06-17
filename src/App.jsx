import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Reservas from './Components/Reservas';
import AdminPanel from './Components/AdminPanel';
import RecuperarContraseña from './Components/RecuperarContraseña'; 
import Registro from './Components/Registro';
import PermisosForm from './Components/PermisosForm';

function App() {
  const [logueado, setLogueado] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState('');

  useEffect(() => {
    // Al montar, revisa si hay token y tipoUsuario guardados
    const token = localStorage.getItem('token');
    const tipo = localStorage.getItem('tipoUsuario');
    if (token && tipo) {
      setLogueado(true);
      setTipoUsuario(tipo);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Login
              logueado={logueado}
              tipoUsuario={tipoUsuario}
              setLogueado={(val) => {
                setLogueado(val);
                if (!val) { // Al cerrar sesión limpia localStorage
                  localStorage.removeItem('token');
                  localStorage.removeItem('tipoUsuario');
                }
              }}
              setTipoUsuario={(tipo) => {
                setTipoUsuario(tipo);
                if (tipo) localStorage.setItem('tipoUsuario', tipo);
                else localStorage.removeItem('tipoUsuario');
              }}
            />
          }
        />
        <Route 
          path="/reservas" 
          element={
            logueado ? (
              <Reservas 
                tipoUsuario={tipoUsuario}
                setLogueado={setLogueado}
                setTipoUsuario={setTipoUsuario}
              />
            ) : <Navigate to="/" />
          } 
        />
        <Route 
          path="/admin" 
          element={
            logueado && tipoUsuario === 'admin' ? (
              <AdminPanel 
                tipoUsuario={tipoUsuario}
                setLogueado={setLogueado}
                setTipoUsuario={setTipoUsuario}
              />
            ) : <Navigate to="/" />
          } 
        />
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/permisos" element={<PermisosForm />} />
      </Routes>
    </Router>
  );
}

export default App;


































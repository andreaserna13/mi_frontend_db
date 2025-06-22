const express = require('express');
const cors = require('cors');
const connection = require('./config/db'); // Asegúrate que este archivo existe y conecta bien

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// LOGIN
app.post('/api/auth/login', (req, res) => {
  const { nombre, clave, tipoUsuario } = req.body;

  // Hardcoded admin
  if (nombre === 'Andrea Serna Gil' && clave === '123456simon' && tipoUsuario === 'admin') {
    return res.json({
      exito: true,
      token: 'token-falso-admin',
      usuario: { tipoUsuario: 'admin', nombre },
      mensaje: 'Login exitoso como administrador',
    });
  }

  // Hardcoded usuario
  if (nombre === 'Julian Zapata' && clave === 'julian.1009' && tipoUsuario === 'usuario') {
    return res.json({
      exito: true,
      token: 'token-falso-usuario',
      usuario: { tipoUsuario: 'usuario', nombre },
      mensaje: 'Login exitoso como usuario',
    });
  }

  // Consultar en base de datos
  const sql = 'SELECT * FROM usuarios WHERE nombre = ? AND tipoUsuario = ? AND estado = 1';
  connection.query(sql, [nombre.trim(), tipoUsuario], (err, results) => {
    if (err) {
      console.error('Error DB:', err);
      return res.status(500).json({ mensaje: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado o inactivo' });
    }

    const usuario = results[0];
    if (usuario.clave !== clave) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    return res.json({
      exito: true,
      usuario: { nombre: usuario.nombre, tipoUsuario: usuario.tipoUsuario },
      mensaje: 'Login exitoso (DB)',
    });
  });
});

// REGISTRO
app.post('/api/auth/registro', (req, res) => {
  const { nombre, clave, tipoUsuario } = req.body;

  if (!nombre || !clave || !tipoUsuario) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const sqlInsert = 'INSERT INTO usuarios (nombre, clave, tipoUsuario) VALUES (?, ?, ?)';
  connection.query(sqlInsert, [nombre, clave, tipoUsuario], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ mensaje: 'El nombre de usuario ya existe' });
      }
      console.error('Error DB:', err);
      return res.status(500).json({ mensaje: 'Error al registrar usuario' });
    }

    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});

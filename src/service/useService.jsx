export const iniciarSesion = async (nombre, clave, tipoUsuario) => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, clave, tipoUsuario }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { exito: false, mensaje: 'Error en la conexión con el servidor' };
  }
};










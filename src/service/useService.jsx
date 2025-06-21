const API_URL = import.meta.env.PROD
  ? 'https://TUNNEL-NGROK.ngrok-free.app' // reemplaza con tu URL de ngrok activa
  : '';

export const iniciarSesion = async (nombre, clave, tipoUsuario) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, clave, tipoUsuario }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { exito: false, mensaje: 'Error en la conexión con el servidor' };
  }
};













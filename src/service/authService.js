export async function iniciarSesion(nombre, clave, tipoUsuario) {
  const response = await fetch('https://mi-backend-db.vercel.app/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombre, clave, tipoUsuario })
  });

  const data = await response.json();
  return data;
}

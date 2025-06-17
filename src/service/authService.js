// src/services/authService.js

export async function iniciarSesion(nombre, clave, tipoUsuario) {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombre, clave, tipoUsuario })
  });

  const data = await response.json();
  return data;
}
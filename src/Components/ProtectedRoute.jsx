// src/Components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element }) {
  const isAuthenticated = true; // Aquí simulas que el usuario está autenticado

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return element;
}

export default ProtectedRoute;








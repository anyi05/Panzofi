import React from 'react';

const AdminPage = () => {
  const handleLogout = () => {
    // Redirige a la página de cierre de sesión, que maneja la eliminación de los tokens
    window.location.href = '/logout';
  };

  return (
    <div>
      <h1>Bienvenido al panel de administración</h1>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default AdminPage;

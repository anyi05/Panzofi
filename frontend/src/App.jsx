import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Admin from './pages/admin'; // ✅ Importa correctamente
import Users from './pages/user';
import Logout from './component/Logout';
import './index.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} /> 
        <Route path="/user" element={<Users />} />
        <Route path="/logout" element={<Logout />} />  {/* Ruta de cierre de sesión */}
      </Routes>
    </Router>
  );
};

export default App; // ✅ Exporta App, no Admin

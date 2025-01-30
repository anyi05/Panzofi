import React, { useState } from 'react';
import axios from 'axios';
import '../index.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();  // Para redirigir con React Router

  // Función que maneja el login
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/user/api/token/', {
        username: username,
        password: password,
      });
  
      const { access, refresh, is_superuser } = response.data;
  
      // Guardar los tokens en el almacenamiento local
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
  
      // Redirigir según si el usuario es superusuario o no
      if (is_superuser === true) {
        navigate('/admin');  // Redirigir al admin si es superusuario
      } else {
        navigate('/user');  // Redirigir al usuario normal si no lo es
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión');
    }
  };
  

  return (
    <div>
      <h1>Prueba de Desarrollo Panzofi</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}  // Captura el valor del username
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}  // Captura el valor del password
      />
      <button onClick={handleLogin} disabled={isSubmitting}>
        {isSubmitting ? 'Iniciando sesión...' : 'Ingresar'}
      </button>
      {error && <p>{error}</p>} 
    </div>
  );
};

export default Login;

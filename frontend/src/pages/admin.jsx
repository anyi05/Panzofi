import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registrar los componentes necesarios de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Admin = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Función para hacer una solicitud autenticada
  const hacerSolicitudAutenticada = async () => {
    const accessToken = localStorage.getItem('access_token'); // Obtén el token guardado

    if (accessToken) {
      try {
        // Hacemos una solicitud GET a una ruta protegida
        const response = await axios.get('http://localhost:8000/user/prueba/users/', {
          headers: {
            Authorization: `Bearer ${accessToken}`  // Autenticación con el token
          }
        });

        console.log("Datos obtenidos:", response.data); // Verifica los datos en la consola

        // Guardamos los datos obtenidos en el estado
        setActivities(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al hacer la solicitud autenticada:', error);
        setError('Hubo un problema al obtener los datos.');
        setLoading(false);
      }
    } else {
      setError('No hay token disponible');
      setLoading(false);
    }
  };

  // Llamar a la función cuando el componente se monta
  useEffect(() => {
    hacerSolicitudAutenticada();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // Función para calcular el tiempo de conexión en minutos
  const calculateTimeSpent = (loginTime, logoutTime) => {
    const login = new Date(loginTime);
    const logout = new Date(logoutTime);
    const timeSpent = logout - login;
    return (timeSpent / 1000) / 60;  // Convertir de milisegundos a minutos
  };

  // Función para obtener el nombre completo
  const getFullName = (firstName, lastName) => {
    return `${firstName || 'Desconocido'} ${lastName || ''}`;
  };

  // Configuración de gráficos
  const chartData1 = {
    labels: activities.map((activity) => `${activity.first_name} ${activity.last_name}`),
    datasets: [
      {
        label: 'Tiempo Conectado (minutos)',
        data: activities.map(activity => {
          const login = new Date(activity.login_time);
          const logout = new Date(activity.logout_time);
          const timeSpent = logout - login;
          return (timeSpent / 1000) / 60; // Convertir de milisegundos a minutos
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const chartData2 = {
    labels: activities.map((activity) => `${activity.first_name} ${activity.last_name}`),
    datasets: [
      {
        label: 'Botón 1 (clics)',
        data: activities.map(activity => activity.button_one_clicks || 0),
        backgroundColor: 'rgb(240, 220, 224)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
    ],
  };

  const chartData3 = {
    labels: activities.map((activity) => `${activity.first_name} ${activity.last_name}`),
    datasets: [
      {
        label: 'Botón 2 (clics)',
        data: activities.map(activity => activity.button_two_clicks || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
      },
    ],
  };

  // Mostrar cargando o error
  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#121212',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    }}>
      <h1>Actividad de los usuarios</h1>

      <h2>Resumen de Actividades</h2>

      {/* Contenedor de la tabla */}
      <div style={{
        width: '80%',   // La tabla ocupará un 80% del ancho de la página
        maxWidth: '1000px', // Para evitar que la tabla sea demasiado ancha
        maxHeight: '50vh',  // El contenedor no puede ser más grande que la mitad de la pantalla (50% de la altura)
        overflowY: 'auto',  // Si el contenido de la tabla excede el tamaño, se podrá hacer scroll vertical
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '10px',  // Para bordes redondeados
        border: '1px solid #555',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  // Un poco de sombra para resaltar el contenedor
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
        }}>
          <thead style={{ backgroundColor: '#222' }}>
            <tr>
              <th style={{ width: '20%' }}>Usuario</th>
              <th style={{ width: '20%' }}>Última sesión</th>
              <th style={{ width: '20%' }}>Tiempo conectado (min)</th>
              <th style={{ width: '20%' }}>Clics Botón 1</th>
              <th style={{ width: '20%' }}>Clics Botón 2</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
              <tr key={activity.id}>
                <td>{getFullName(activity.first_name, activity.last_name)}</td>
                <td>{new Date(activity.login_time).toLocaleString()}</td>
                <td>{calculateTimeSpent(activity.login_time, activity.logout_time)}</td>
                <td>{activity.button_one_clicks}</td>
                <td>{activity.button_two_clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Gráficos de Actividad</h2>
      <div style={{
        display: 'flex',
        justifyContent: 'center',  // Alinea los gráficos horizontalmente al centro
        marginTop: '20px',
        width: '80%',   // Los gráficos ocuparán un 80% del contenedor disponible
        height: '50vh',  // Los gráficos ocupan la mitad de la altura de la página
      }}>
        {/* Gráfico 1: Pie */}
        <div style={{
          flex: 1,
          margin: '10px',
          height: '100%',
        }}>
          <h3>Tiempo Conectado</h3>
          <Pie data={chartData1} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        {/* Gráfico 2: Bar */}
        <div style={{
          flex: 1,
          margin: '10px',
          height: '100%',
        }}>
          <h3>Clics Botón 1</h3>
          <Bar data={chartData2} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>

        {/* Gráfico 3: Bar */}
        <div style={{
          flex: 1,
          margin: '10px',
          height: '100%',
        }}>
          <h3>Clics Botón 2</h3>
          <Bar data={chartData3} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </div>
    </div>
  );
};

export default Admin;

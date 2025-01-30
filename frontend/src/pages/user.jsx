import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [landingPage, setLandingPage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
  const [timer, setTimer] = useState(0);
  const [lastLoginTime, setLastLoginTime] = useState(null);

  // Función para obtener los datos del landing page
  const fetchLandingPage = async () => {
    if (accessToken) {
      try {
        const response = await axios.get('http://localhost:8000/user/landing/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log('Datos recibidos:', response.data); // Verifica los datos en la consola
        setLandingPage(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos del landing page:', error);
        setError('Hubo un problema al obtener la página de destino.');
        setLoading(false);
      }
    } else {
      setError('No hay token disponible');
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const startSession = async () => {
    if (accessToken) {
      try {
        const response = await axios.get('http://localhost:8000/user/prueba/users/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Sesión iniciada correctamente');

        // Guardar la fecha del último inicio de sesión
        const currentTime = new Date();
        setLastLoginTime(currentTime);
      } catch (error) {
        console.error('Error al registrar inicio de sesión:', error);
        setError('Hubo un error al iniciar la sesión.');
      }
    } else {
      console.error('No hay token disponible');
      setError('No hay token disponible');
    }
  };

  // Función para cerrar sesión
  const endSession = async () => {
    if (accessToken) {
      try {
        const response = await axios.get('http://localhost:8000/user/prueba/users/', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Sesión cerrada correctamente');
      } catch (error) {
        console.error('Error al registrar cierre de sesión:', error);
        setError('Hubo un error al cerrar la sesión.');
      }
    }
  };

  // Función para registrar el clic de un botón
  const handleButtonClick = async (buttonId) => {
    if (accessToken) {
      try {
        const response = await axios.post(
          'http://localhost:8000/user/click/', // Asegúrate de que esta URL sea correcta
          { button: buttonId }, // El objeto con la información del botón
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(`Botón ${buttonId} clickeado`);
      } catch (error) {
        console.error('Error al registrar el clic del botón:', error);
        setError('Hubo un error al registrar el clic del botón.');
      }
    } else {
      console.error('No hay token disponible');
      setError('No hay token disponible');
    }
  };

  // Iniciar la sesión y cargar los datos del landing page al montar el componente
  useEffect(() => {
    startSession(); // Registrar sesión al montar el componente
    fetchLandingPage(); // Obtener los datos de la página

    // Lógica del temporizador para contar el tiempo
    const timerInterval = setInterval(() => {
      if (lastLoginTime) {
        const elapsedTime = Math.floor((new Date() - new Date(lastLoginTime)) / 1000);
        setTimer(elapsedTime);
      }
    }, 1000); // Actualizar cada segundo

    return () => {
      endSession(); // Registrar cierre de sesión al desmontar el componente
      clearInterval(timerInterval); // Limpiar el temporizador
    };
  }, [lastLoginTime]); // Dependencia para que se actualice al cambiar la fecha de inicio de sesión

  // Estilos
  const styles = {
    landingPage: {
      fontFamily: 'Arial, sans-serif',
      margin: '20px',
      padding: '20px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
    },
    logo: {
      maxWidth: '150px',
      height: 'auto',
      marginRight: '20px',
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: '2rem',
      color: 'white',
      margin: 0,
    },
    main: {
      marginTop: '20px',
    },
    descriptionContainer: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    description: {
      fontSize: '1.2rem',
      color: '#0000FF',  // Cambié el color para asegurar que sea legible
      margin: 0,
      padding: '0 10px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '1rem',
      margin: '0 10px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: '#4CAF50',
      color: 'white',
      borderRadius: '5px',
    },
    imageContainer: {
      textAlign: 'center',
      marginTop: '20px',
    },
    image: {
      maxWidth: '150px',
      height: 'auto',
    },
    loading: {
      fontSize: '1.5rem',
      textAlign: 'center',
      marginTop: '20px',
    },
    error: {
      fontSize: '1.5rem',
      color: 'red',
      textAlign: 'center',
      marginTop: '20px',
    },
    timer: {
      fontSize: '1.5rem',
      textAlign: 'center',
      marginTop: '20px',
    },
    lastLogin: {
      fontSize: '1.2rem',
      textAlign: 'center',
      marginTop: '20px',
    },
  };

  // Renderizado de los datos
  if (loading) return <div style={styles.loading}>Cargando...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  const imageUrl = landingPage?.image ? `http://localhost:8000${landingPage.image}` : null;
  const logoUrl = landingPage.logo ? `http://localhost:8000${landingPage.logo}` : null;
  const description = landingPage?.description || '';

  return (
    <div style={styles.landingPage}>
      <header style={styles.header}>
        {logoUrl && <img src={logoUrl} alt="Logo" style={styles.logo} />}
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>{landingPage.title}</h1>
        </div>
      </header>
      <main style={styles.main}>
        <div style={styles.descriptionContainer}>
          <p style={styles.description}>{description}</p>
        </div>
      </main>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => handleButtonClick(1)}>Botón 1</button>
        <button style={styles.button} onClick={() => handleButtonClick(2)}>Botón 2</button>
      </div>
      <div style={styles.imageContainer}>
        {imageUrl && <img src={imageUrl} alt="Imagen principal" style={styles.image} />}
      </div>
      <div style={styles.timer}>
        <p>Tiempo transcurrido desde el último inicio de sesión: {timer} segundos</p>
      </div>
      {lastLoginTime && (
        <div style={styles.lastLogin}>
          <p>Último inicio de sesión: {lastLoginTime.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default Users;

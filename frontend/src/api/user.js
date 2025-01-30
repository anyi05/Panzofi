import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/user/prueba/users',  // URL de tu backend
});

// Añadir el token al encabezado de cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores (por ejemplo, expiración del token)
axiosInstance.interceptors.response.use(
  (response) => response,  // Si la respuesta es exitosa, devolverla sin cambios
  async (error) => {
    const originalRequest = error.config;

    // Verificar si el error es por un token expirado
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;  // Marcar como reintento

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post('http://localhost:8000/api/token/refresh/', { refresh: refreshToken });

        const { access } = response.data;

        // Actualizar el access_token en el localStorage
        localStorage.setItem('access_token', access);

        // Reintentar la solicitud original con el nuevo token de acceso
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        return axios(originalRequest);  // Realiza la solicitud original con el nuevo token
      } catch (err) {
        // Si el refresh token también falla, redirigir al login
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }

    // Si el error no es por token expirado, simplemente rechazar la promesa
    return Promise.reject(error);
  }
);

export default axiosInstance;

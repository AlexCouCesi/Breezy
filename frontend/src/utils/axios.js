import axios from 'axios';
import Cookies from 'js-cookie';

// Création d'une instance Axios pour les appels vers l'API principale
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Envoie automatiquement les cookies (dont le refreshToken)
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // Vérifie si _retry est défini, sinon le considère comme false
    const hasRetried = typeof originalRequest._retry !== 'undefined' ? originalRequest._retry : false;
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      // Appelle la route de refresh
      const res = await axios.get('/api/auth/refresh', { withCredentials: true });
      if (res.status === 200) {
        Cookies.set('accessToken', res.data.accessToken, {
            expires: 1,
            secure: true,
            sameSite: 'strict',
          }
        );
        // Mets à jour le header Authorization si besoin
        api.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.accessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + res.data.accessToken;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

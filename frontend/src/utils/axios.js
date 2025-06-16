import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // pour envoyer les cookies (refreshToken) automatiquement
});

// Intercepteur de réponse pour gérer le refresh token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // Si le token est expiré ou invalide et qu'on n'a pas déjà tenté un refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Appel à /refresh pour obtenir un nouveau accessToken
        const res = await axios.post(
          process.env.NEXT_PUBLIC_AUTH_URL + '/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        // Stocke le nouveau accessToken dans le cookie (optionnel, selon votre logique)
        Cookies.set('accessToken', res.data.accessToken, { secure: true, sameSite: 'strict' });
        // Le refreshToken doit être envoyé par le backend en tant que cookie HttpOnly, ne pas le gérer côté JS
        // Met à jour le header Authorization pour la requête initiale
        originalRequest.headers['Authorization'] = 'Bearer ' + res.data.accessToken;
        // Relance la requête initiale avec le nouveau token
        return api(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, redirige vers la page de login
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
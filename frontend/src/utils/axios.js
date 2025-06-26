import axios from 'axios';
import Cookies from 'js-cookie';

// Création d'une instance Axios pour les appels vers l'API principale
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Envoie automatiquement les cookies (dont le refreshToken)
});

// Intercepteur de réponse : tente un refresh automatique si 401
api.interceptors.response.use(
  response => response,

  async error => {
    const originalRequest = error.config;

    // Si erreur 401 (unauthorized) et qu’on n’a pas déjà tenté un refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Appelle le endpoint de refresh côté auth (le refreshToken est en cookie HttpOnly)
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        // Stocke le nouveau accessToken dans les cookies (visible JS si besoin, sinon juste en mémoire)
        Cookies.set('accessToken', newAccessToken, {
          secure: true,
          sameSite: 'strict',
        });

        // Met à jour le header Authorization pour la requête originale
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Renvoie la requête initiale avec le nouveau token
        return api(originalRequest);
      } catch (refreshError) {
        // Si le refresh échoue, l'utilisateur est probablement déconnecté → rediriger
        window.location.href = '/auth/login';
      }
    }

    // Dans les autres cas, on laisse passer l'erreur
    return Promise.reject(error);
  }
);

export default api;

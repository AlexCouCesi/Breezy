import axios from 'axios';

// Client Axios pour les appels à l'API principale (ex: posts, users, etc.)
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL, // Exemple : http://localhost:3001
    withCredentials: true, // Nécessaire pour les cookies JWT
});

// Intercepteur de réponse : tente un refresh si 401 non encore tenté
api.interceptors.response.use(
    response => response, // Cas normal : réponse transmise telle quelle

    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Tente de rafraîchir le token via /api/auth/refresh
                await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // Relance la requête initiale avec les nouveaux cookies
                return api(originalRequest);
            } catch (refreshError) {
                // Si le refresh échoue, on redirige vers la connexion
                window.location.href = '/auth/login';
            }
        }

        // Si ce n’est pas un 401 ou le refresh a échoué, renvoyer l’erreur
        return Promise.reject(error);
    }
);

export default api;
import axios from 'axios';

// Instance Axios préconfigurée pour l'authentification
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_URL, // Ex: http://localhost:5000 ou domaine distant
    withCredentials: true, // Envoie les cookies (ex: JWT) dans les requêtes cross-origin
});

export default api;

// src/utils/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
    withCredentials: true, // pour que les cookies soient transmis automatiquement
});

export default api;

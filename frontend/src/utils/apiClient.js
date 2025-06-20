// src/utils/apiClient.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    });

    api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
            {},
            { withCredentials: true }
            );
            return api(originalRequest);
        } catch (refreshError) {
            window.location.href = '/auth/login';
        }
        }

        return Promise.reject(error);
    }
);

export default api;

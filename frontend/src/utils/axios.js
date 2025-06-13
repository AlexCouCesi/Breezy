import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// intercepte les réponses 401 et appelle /refresh pour obtenir un nouveau accessToken
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Appel à /refresh pour obtenir un nouveau accessToken
      try {
        const res = await axios.post(process.env.NEXT_PUBLIC_AUTH_URL + '/api/auth/refresh', {}, { withCredentials: true });
        Cookies.set('accessToken', res.data.accessToken, { secure: true, sameSite: 'strict' });
        originalRequest.headers['Authorization'] = 'Bearer ' + res.data.accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirige vers login si refresh échoue
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
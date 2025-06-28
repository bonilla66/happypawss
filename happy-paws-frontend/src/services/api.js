import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const cookies = document.cookie;

    if (error.response?.status === 401 && !originalRequest._retry && cookies.includes("refresh_token")) {
      originalRequest._retry = true;

      try {
        await api.get('/auth/refresh', {
          withCredentials: true
        });

        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;



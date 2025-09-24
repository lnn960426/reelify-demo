import axios from 'axios';
import router from '../router';

//Use backend URL from environment variable or default to localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_REMOTE_API,
  timeout:15000, // Include cookies in requests
});

//Attach the token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Handle 401 errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
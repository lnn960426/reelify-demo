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
  (response) => response,
  (error) => {
    const  status = error?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      //redirect to login page
      try {
        router && router.push && router.push('/login');
      } catch {}
    }
        return Promise.reject(error);
      }
);

    export default api;
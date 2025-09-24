import axios from 'axios';

//Use backend URL from environment variable or default to localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_REMOTE_API,
  timeout:15000, // Include cookies in requests
});

//Attach the token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
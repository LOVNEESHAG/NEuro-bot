import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "https://neuro-bot-8naq.onrender.com";

console.log("Using API:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL + "/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 🔥 TOKEN INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
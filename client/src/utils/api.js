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

// 🔥 token attach
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 401 handle
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token"); // cleanup
    }
    return Promise.reject(err);
  }
);

export default api;

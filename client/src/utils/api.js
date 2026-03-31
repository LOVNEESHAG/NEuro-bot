import axios from "axios";

const api = axios.create({
  baseURL: "https://neuro-bot-8naq.onrender.com/api", // ✅ FINAL FIX
  headers: {
    "Content-Type": "application/json"
  }
});

// token attach
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

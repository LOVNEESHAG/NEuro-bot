import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "https://neuro-bot-8naq.onrender.com";

console.log("Using API:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL + "/api",
});

export default api;

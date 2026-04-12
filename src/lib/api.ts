import axios from "axios";

export const ADMIN_TOKEN_KEY = "admin_auth_token";

const defaultProductionApiBase = "https://annoda-project.onrender.com";

const apiBaseUrl = import.meta.env.DEV
  ? ""
  : (import.meta.env.VITE_API_BASE_URL || defaultProductionApiBase).replace(/\/$/, "");

const api = axios.create({
  baseURL: apiBaseUrl
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
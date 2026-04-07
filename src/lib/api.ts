import axios from "axios";

export const ADMIN_TOKEN_KEY = "admin_auth_token";

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
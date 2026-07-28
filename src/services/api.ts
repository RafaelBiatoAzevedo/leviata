import axios from "axios";
import { authStorage } from "../admin/services/auth-storage";
import { envs } from "../config/env";

export const api = axios.create({
  baseURL: envs.API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = authStorage.getToken();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

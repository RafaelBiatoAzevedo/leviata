import axios from "axios";
import { envs } from "../config/env";
import { authStorage } from "../admin/services/auth-storage";

export const api = axios.create({
  baseURL: envs.API_BASE_URL,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = authStorage.getRefreshToken();

        const response = await api.post("/auth/refresh", {
          refreshToken,
        });

        const { accessToken } = response.data;

        authStorage.setToken(accessToken);

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch {
        localStorage.clear();

        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  },
);

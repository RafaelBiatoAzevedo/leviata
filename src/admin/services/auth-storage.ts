import { storageKeys } from "../../constants/storageKeys";
import type { LoginUserResponseDto } from "../dto/auth/LoginResponseDto";

export const authStorage = {
  getToken() {
    return localStorage.getItem(storageKeys.TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(storageKeys.TOKEN_KEY, token);
  },

  removeToken() {
    localStorage.removeItem(storageKeys.TOKEN_KEY);
  },

  getRefreshToken() {
    return localStorage.getItem(storageKeys.REFRESH_TOKEN_KEY);
  },

  setRefreshToken(refreshToken: string) {
    localStorage.setItem(storageKeys.REFRESH_TOKEN_KEY, refreshToken);
  },

  removeRefreshToken() {
    localStorage.removeItem(storageKeys.REFRESH_TOKEN_KEY);
  },

  getUser() {
    return localStorage.getItem(storageKeys.USER_KEY);
  },

  setUser(user: LoginUserResponseDto) {
    localStorage.setItem(storageKeys.USER_KEY, JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem(storageKeys.USER_KEY);
  },
};

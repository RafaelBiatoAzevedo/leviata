import { storageKeys } from "../constants/storageKeys";

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
};

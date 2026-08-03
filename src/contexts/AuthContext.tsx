import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { api } from "../services/api";

import { storageKeys } from "../constants/storageKeys";
import type {
  LoginResponseDto,
  LoginUserResponseDto,
} from "../dto/auth/LoginResponseDto";
import { logout } from "../admin/services/auth";

interface AuthContextData {
  user: LoginUserResponseDto | null;

  token: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  signIn(data: LoginResponseDto): void;

  signOut(): void;

  refreshSession(): void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<LoginUserResponseDto | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(storageKeys.TOKEN_KEY);

    const storedUser = localStorage.getItem(storageKeys.USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);

      setUser(JSON.parse(storedUser));

      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  const refreshSession = useCallback(async () => {
    const refreshToken = localStorage.getItem(storageKeys.REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    const response = await api.post("/auth/refresh", {
      refreshToken,
    });

    const { accessToken } = response.data;

    localStorage.setItem(storageKeys.TOKEN_KEY, accessToken);

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    setToken(accessToken);
  }, []);

  const signIn = useCallback(
    ({ accessToken, refreshToken, user }: LoginResponseDto) => {
      localStorage.setItem(storageKeys.TOKEN_KEY, accessToken);

      localStorage.setItem(storageKeys.REFRESH_TOKEN_KEY, refreshToken);

      localStorage.setItem(storageKeys.USER_KEY, JSON.stringify(user));

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      setToken(accessToken);

      setUser(user);
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(storageKeys.TOKEN_KEY);

    localStorage.removeItem(storageKeys.REFRESH_TOKEN_KEY);

    localStorage.removeItem(storageKeys.USER_KEY);

    logout();

    delete api.defaults.headers.common.Authorization;

    setToken(null);

    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,

      token,

      isAuthenticated: !!token,

      isLoading: loading,

      signIn,

      signOut,

      refreshSession,
    }),
    [user, token, loading, signIn, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

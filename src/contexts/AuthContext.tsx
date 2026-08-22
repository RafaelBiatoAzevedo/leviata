import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { api } from "../services/api";

import type {
  LoginResponseDto,
  LoginUserResponseDto,
} from "../admin/dtos/auth/LoginResponseDto";
import { logout } from "../admin/services/auth";
import { authStorage } from "../admin/services/auth-storage";

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
    const storedToken = authStorage.getToken();

    const storedUser = authStorage.getUser();

    if (storedToken && storedUser) {
      setToken(storedToken);

      setUser(JSON.parse(storedUser));

      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  const refreshSession = useCallback(async () => {
    const refreshToken = authStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    const response = await api.post("/auth/refresh", {
      refreshToken,
    });

    const { accessToken } = response.data;

    authStorage.setToken(accessToken);

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    setToken(accessToken);
  }, []);

  const signIn = useCallback(
    ({ accessToken, refreshToken, user }: LoginResponseDto) => {
      authStorage.setToken(accessToken);

      authStorage.setRefreshToken(refreshToken);

      authStorage.setUser(user);

      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      setToken(accessToken);

      setUser(user);
    },
    [],
  );

  const signOut = useCallback(() => {
    authStorage.removeToken();

    authStorage.removeRefreshToken();

    authStorage.removeUser();

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

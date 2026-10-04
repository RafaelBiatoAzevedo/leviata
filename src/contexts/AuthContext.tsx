import {
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
import { getMe, logout } from "../admin/services/auth";
import { authStorage } from "../admin/services/auth-storage";
import { AuthContext } from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

function readStoredUser(): LoginUserResponseDto | null {
  try {
    const value = JSON.parse(
      authStorage.getUser() ?? "null",
    ) as LoginUserResponseDto | null;
    return value &&
      typeof value.id === "string" &&
      typeof value.email === "string" &&
      typeof value.role === "string"
      ? value
      : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<LoginUserResponseDto | null>(readStoredUser);

  const [token, setToken] = useState<string | null>(() =>
    readStoredUser() ? authStorage.getToken() : null,
  );

  const [loading, setLoading] = useState(Boolean(user && token));
  const userId = user?.id;

  useEffect(() => {
    if (!token || !userId) return;
    let cancelled = false;
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    getMe()
      .then((current) => {
        if (cancelled) return;
        authStorage.setUser(current);
        setUser(current);
        setToken(authStorage.getToken());
      })
      .catch(() => {
        if (cancelled) return;
        authStorage.removeToken();
        authStorage.removeRefreshToken();
        authStorage.removeUser();
        delete api.defaults.headers.common.Authorization;
        setUser(null);
        setToken(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, userId]);

  const updateUser = useCallback((current: LoginUserResponseDto) => {
    authStorage.setUser(current);
    setUser(current);
  }, []);

  const refreshSession = useCallback(async () => {
    const refreshToken = authStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    const response = await api.post<{
      accessToken: string;
      refreshToken: string;
    }>("/auth/refresh", {
      refreshToken,
    });

    const { accessToken } = response.data;

    authStorage.setToken(accessToken);
    authStorage.setRefreshToken(response.data.refreshToken);

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
    void logout().catch(() => undefined);
    authStorage.removeToken();

    authStorage.removeRefreshToken();

    authStorage.removeUser();

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
      updateUser,

      refreshSession,
    }),
    [user, token, loading, signIn, signOut, updateUser, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

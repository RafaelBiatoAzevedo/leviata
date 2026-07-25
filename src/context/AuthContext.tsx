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

interface AuthContextData {
  user: LoginUserResponseDto | null;

  token: string | null;

  isAuthenticated: boolean;

  signIn(data: LoginResponseDto): void;

  signOut(): void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<LoginUserResponseDto | null>(null);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(storageKeys.TOKEN_KEY);

    const storedUser = localStorage.getItem(storageKeys.USER_KEY);

    if (!storedToken || !storedUser) return;

    setToken(storedToken);

    setUser(JSON.parse(storedUser));

    api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
  }, []);

  const signIn = useCallback(({ accessToken, user }: LoginResponseDto) => {
    localStorage.setItem(storageKeys.TOKEN_KEY, accessToken);

    localStorage.setItem(storageKeys.USER_KEY, JSON.stringify(user));

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    setToken(accessToken);

    setUser(user);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(storageKeys.TOKEN_KEY);

    localStorage.removeItem(storageKeys.USER_KEY);

    delete api.defaults.headers.common.Authorization;

    setToken(null);

    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,

      token,

      isAuthenticated: !!token,

      signIn,

      signOut,
    }),
    [user, token, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

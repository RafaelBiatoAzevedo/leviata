import { createContext } from "react";
import type {
  LoginResponseDto,
  LoginUserResponseDto,
} from "../admin/dtos/auth/LoginResponseDto";

export interface AuthContextData {
  user: LoginUserResponseDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn(data: LoginResponseDto): void;
  signOut(): void;
  updateUser(user: LoginUserResponseDto): void;
  refreshSession(): Promise<void>;
}

export const AuthContext = createContext({} as AuthContextData);

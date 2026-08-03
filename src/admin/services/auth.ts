import type { LoginRequestDto } from "../dto/auth/LoginRequestDto";
import type { LoginResponseDto } from "../dto/auth/LoginResponseDto";
import { api } from "../../services/api";

export async function login(data: LoginRequestDto): Promise<LoginResponseDto> {
  const response = await api.post<LoginResponseDto>("/auth/login", data);

  return response.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function refresh(
  data: LoginRequestDto,
): Promise<LoginResponseDto> {
  const response = await api.post<LoginResponseDto>("/auth/refresh", data);

  return response.data;
}

export async function getMe() {
  const response = await api.post("/auth/me");

  return response.data;
}

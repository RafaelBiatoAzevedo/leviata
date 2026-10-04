import { isAxiosError } from "axios";
import type { UserResponseDto } from "../dtos/users/UserResponseDto";

export const userRoleOptions = [
  { value: "ADMIN", label: "Administrador" },
  { value: "SUPER_ADMIN", label: "Superadministrador" },
];

export function formatUserRole(role: string) {
  return userRoleOptions.find((option) => option.value === role)?.label ?? role;
}

export function userName(
  user: Pick<UserResponseDto, "firstName" | "lastName" | "email">,
) {
  return (
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
  );
}

export function userErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data.message;
    if (Array.isArray(message)) return message.join("\n");
    if (message) return message;
  }
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação. Tente novamente.";
}

import { isAxiosError } from "axios";

export function institutionErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data.message;
    if (Array.isArray(message)) return message.join("\n");
    if (message) return message;
    if (error.response?.status === 404) return "Instituição não encontrada.";
  }
  return "Não foi possível concluir a operação. Tente novamente.";
}

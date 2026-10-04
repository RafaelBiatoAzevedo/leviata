import { isAxiosError } from "axios";

export function formatScheduleDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function scheduleErrorMessage(error: unknown) {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data.message;
    if (Array.isArray(message)) return message.join("\n");
    if (message) return message;
  }
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação. Tente novamente.";
}

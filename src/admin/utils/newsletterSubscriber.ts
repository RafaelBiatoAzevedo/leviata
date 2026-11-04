import { isAxiosError } from "axios";

export function newsletterSubscriberError(error: unknown) {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data.message;
    if (Array.isArray(message)) return message.join("\n");
    if (message) return message;
    if (error.response?.status === 404) return "Inscrito não encontrado.";
    if (error.response?.status === 409)
      return "Já existe um inscrito com esse e-mail.";
  }
  return "Não foi possível concluir a operação. Tente novamente.";
}

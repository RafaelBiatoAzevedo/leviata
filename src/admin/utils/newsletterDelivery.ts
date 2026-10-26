import { isAxiosError } from "axios";
import type { NewsletterMailSettings } from "../dtos/newsletter/NewsletterMailDto";

export function newsletterSendAvailability(
  settings: NewsletterMailSettings | null | undefined,
  publishedAt: string | null | undefined,
  sentAt?: string | null,
) {
  if (!settings)
    return "Não foi possível verificar o serviço de e-mail. Você pode salvar a edição e enviar depois.";
  if (!settings.ready)
    return "O envio por e-mail estará disponível após a configuração e ativação do remetente.";
  if (!settings.workerEnabled)
    return "O processamento de e-mails está desativado no momento.";
  if (
    settings.worker.pausedUntil &&
    new Date(settings.worker.pausedUntil).getTime() > Date.now()
  )
    return "O envio está temporariamente pausado. Verifique a conexão de e-mail antes de continuar.";
  if (sentAt) return "Esta edição já está marcada como enviada.";
  const date = publishedAt ? new Date(publishedAt) : null;
  if (!date || !Number.isFinite(date.getTime()) || date.getTime() > Date.now())
    return "Defina uma data de publicação de hoje ou anterior para enviar esta edição.";
  return "";
}

export function newsletterMailError(error: unknown) {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    if (error.response?.status === 503)
      return "O envio por e-mail ainda não está disponível. A newsletter continua salva.";
    const message = error.response?.data?.message;
    if (error.response && error.response.status < 500 && message)
      return Array.isArray(message) ? message.join(" ") : message;
  }
  return "Não foi possível confirmar a operação. Atualize o acompanhamento antes de tentar novamente.";
}

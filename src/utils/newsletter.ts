import { isAxiosError } from "axios";
import type { NewsletterSubscription } from "../services/newsletter";
import type { NewsletterSubscriptionFormData } from "../validations/newsletter";

export function newsletterSubscriptionData(
  values: NewsletterSubscriptionFormData,
): NewsletterSubscription {
  const name = [values.name, values.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");
  const cellphone = values.cellphone?.trim();
  return {
    email: values.email.trim().toLowerCase(),
    ...(name && { name }),
    ...(cellphone && { cellphone }),
  };
}

export function newsletterSubscriptionError(error: unknown): string {
  if (
    isAxiosError<{ message?: string | string[] }>(error) &&
    error.response &&
    error.response.status < 500
  ) {
    const message = error.response.data?.message;
    if (typeof message === "string" && message.trim()) return message;
    if (Array.isArray(message) && message.length) return message.join(" ");
  }
  return "Não foi possível concluir a inscrição. Tente novamente.";
}

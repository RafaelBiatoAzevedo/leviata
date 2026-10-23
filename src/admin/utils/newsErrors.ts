import { isAxiosError } from "axios";
import type { NewsFormData } from "../validations/news.schema";

const newsFields = [
  "title",
  "description",
  "date",
  "category",
  "isInternal",
  "externalUrl",
  "relatedType",
  "relatedId",
  "coverUrl",
] as const satisfies readonly (keyof NewsFormData)[];

export function newsErrorDetails(error: unknown) {
  const apiMessage = isAxiosError<{ message?: string | string[] }>(error)
    ? error.response?.data?.message
    : undefined;
  const messages = (
    Array.isArray(apiMessage) ? apiMessage : [apiMessage]
  ).filter(
    (message): message is string =>
      typeof message === "string" && !!message.trim(),
  );
  const message = messages.length
    ? messages.join(" ")
    : error instanceof Error
      ? error.message
      : "Não foi possível salvar a notícia. Tente novamente.";
  const grouped = new Map<(typeof newsFields)[number], string[]>();

  for (const message of messages) {
    const field = newsFields.find(
      (field) =>
        message.startsWith(`${field} `) ||
        message.startsWith(`${field}.`) ||
        message.startsWith(`${field}[`),
    );
    if (field) grouped.set(field, [...(grouped.get(field) ?? []), message]);
  }

  return {
    message,
    fieldErrors: [...grouped].map(([field, messages]) => ({
      field,
      message: messages.join(" "),
    })),
  };
}

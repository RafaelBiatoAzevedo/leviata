import { isAxiosError } from "axios";
import type { BookFormData } from "../validations/book.schema";

const bookFields = [
  "title",
  "subtitle",
  "description",
  "isbn",
  "year",
  "publisher",
  "externalUrl",
  "authors",
  "coverUrl",
] as const satisfies readonly (keyof BookFormData)[];

export function bookErrorDetails(error: unknown) {
  const apiMessage = isAxiosError<{ message?: string | string[] }>(error)
    ? error.response?.data.message
    : undefined;
  const messages = (Array.isArray(apiMessage) ? apiMessage : [apiMessage]).filter(
    (message): message is string => typeof message === "string" && !!message.trim(),
  );
  const message = messages.length
    ? messages.join(" ")
    : error instanceof Error
      ? error.message
      : "Não foi possível salvar o livro. Tente novamente.";
  const grouped = new Map<(typeof bookFields)[number], string[]>();

  for (const message of messages) {
    const propertyMessage = message.replace(/^each value in /, "");
    const field = bookFields.find(
      (field) =>
        propertyMessage.startsWith(`${field} `) ||
        propertyMessage.startsWith(`${field}.`) ||
        propertyMessage.startsWith(`${field}[`),
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

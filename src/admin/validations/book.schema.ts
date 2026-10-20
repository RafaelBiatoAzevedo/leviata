import { z } from "zod";

export const bookSchema = z.object({
  coverUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  title: z
    .string()
    .trim()
    .min(1, "Informe o título.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  subtitle: z
    .string()
    .trim()
    .max(255, "O subtítulo deve ter no máximo 255 caracteres.")
    .optional(),

  description: z.string().trim().optional(),

  isbn: z
    .string()
    .trim()
    .max(20, "O ISBN deve ter no máximo 20 caracteres.")
    .optional(),

  year: z
    .number({
      message: "Informe o ano. Ex: 2020",
    })
    .int("Informe um ano válido.")
    .min(1, "Informe um ano válido."),

  publisher: z
    .string()
    .trim()
    .min(1, "Informe a editora.")
    .max(255, "A editora deve ter no máximo 255 caracteres."),

  externalUrl: z
    .string()
    .trim()
    .min(1, "Informe o link do livro.")
    .url("Informe uma URL válida."),

  authors: z
    .array(z.string().uuid("Selecione um autor válido."))
    .min(1, "Selecione pelo menos um autor."),
});

export type BookFormData = z.infer<typeof bookSchema>;

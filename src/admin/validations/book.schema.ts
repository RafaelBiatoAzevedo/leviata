import { z } from "zod";

export const bookSchema = z.object({
  coverUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  title: z.string().trim().min(1, "Informe o título.").max(255),

  subtitle: z.string().trim().max(255).optional(),

  description: z.string().trim().optional(),

  isbn: z.string().trim().max(20).optional(),

  year: z
    .number({
      message: "Informe o ano. Ex: 2020",
    })
    .int("Informe um ano válido.")
    .min(1, "Informe um ano válido."),

  publisher: z.string().trim().min(1, "Informe a editora.").max(255),

  externalUrl: z.string().url("Informe uma URL válida.").or(z.literal("")),

  authors: z
    .array(z.string().uuid("Selecione um autor válido."))
    .min(1, "Selecione pelo menos um autor."),
});

export type BookFormData = z.infer<typeof bookSchema>;

import { z } from "zod";

export const searchSchema = z.object({
  coverUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  title: z
    .string()
    .min(1, "O título é obrigatório.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  content: z.string().optional(),

  people: z
    .array(z.string().uuid("ID de pessoa inválido."))
    .min(1, "Selecione pelo menos uma pessoa."),
});

export type SearchFormData = z.infer<typeof searchSchema>;

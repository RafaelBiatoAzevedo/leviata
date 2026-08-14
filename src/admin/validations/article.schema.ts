import { z } from "zod";
import type { TArticleType } from "../types/TArticleType";

export const articleSchema = z.object({
  title: z
    .string()
    .min(1, "Informe o título.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  type: z.enum(["ARTICLE", "DOSSIER"] as [TArticleType, ...TArticleType[]], {
    message: "Selecione o tipo do artigo.",
  }),

  journal: z
    .string()
    .max(255, "A revista deve ter no máximo 255 caracteres.")
    .optional()
    .or(z.literal("")),

  volume: z
    .string()
    .max(50, "O volume deve ter no máximo 50 caracteres.")
    .optional()
    .or(z.literal("")),

  year: z
    .number({
      message: "Informe o ano. Ex: 2020",
    })
    .int("Informe um ano válido.")
    .min(1, "Informe um ano válido."),

  doi: z
    .string()
    .max(255, "O DOI deve ter no máximo 255 caracteres.")
    .optional()
    .or(z.literal("")),

  summary: z.string().optional().or(z.literal("")),

  externalUrl: z
    .string()
    .min(1, "Informe uma url.")
    .url("Informe uma URL válida.")
    .or(z.literal("")),

  authors: z.array(z.string()).min(1, "Adicione pelo menos um autor."),
});

export type ArticleFormData = z.infer<typeof articleSchema>;

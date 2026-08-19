import { z } from "zod";

import {
  NewsRelatedType,
  type TNewsRelatedType,
} from "../enums/NewsRelatedType";
import { NewsCategory, type TNewsCategory } from "../enums/NewsCategory";

export const newsSchema = z.object({
  coverUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  title: z
    .string()
    .min(1, "Informe o título.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  description: z.string().min(1, "Informe a descrição."),

  date: z.string().min(1, "Informe a data."),

  category: z.enum(
    Object.values(NewsCategory) as [TNewsCategory, ...TNewsCategory[]],
    {
      message: "Selecione uma categoria.",
    },
  ),

  isInternal: z.boolean(),

  externalUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  relatedType: z
    .enum(
      Object.values(NewsRelatedType) as [
        TNewsRelatedType,
        ...TNewsRelatedType[],
      ],
      {
        message: "Selecione o tipo relacionado.",
      },
    )
    .optional()
    .nullable(),

  relatedId: z.string().optional().or(z.literal("")).nullable(),
});

export type NewsFormData = z.infer<typeof newsSchema>;

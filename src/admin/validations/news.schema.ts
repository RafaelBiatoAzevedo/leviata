import { z } from "zod";

import {
  NewsRelatedType,
  type TNewsRelatedType,
} from "../types/TNewsRelatedType";
import { NewsCategory, type TNewsCategory } from "../types/TNewsCategory";

export const newsSchema = z
  .object({
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

    externalUrl: z.string().trim(),

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
      .or(z.literal(""))
      .optional()
      .nullable(),

    relatedId: z.string().trim().optional().nullable(),
  })
  .superRefine((data, context) => {
    if (data.isInternal) {
      if (!data.relatedType)
        context.addIssue({
          code: "custom",
          path: ["relatedType"],
          message: "Selecione a categoria do conteúdo relacionado.",
        });
      if (
        !data.relatedId ||
        !z.string().uuid().safeParse(data.relatedId).success
      )
        context.addIssue({
          code: "custom",
          path: ["relatedId"],
          message: "Selecione um item relacionado válido.",
        });
    } else if (
      !data.externalUrl ||
      !z.string().url().safeParse(data.externalUrl).success
    ) {
      context.addIssue({
        code: "custom",
        path: ["externalUrl"],
        message: data.externalUrl
          ? "Informe uma URL válida."
          : "Informe o link da notícia.",
      });
    }
  });

export type NewsFormData = z.infer<typeof newsSchema>;

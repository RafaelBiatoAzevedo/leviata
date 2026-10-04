import { z } from "zod";

export const thematicVideoSchema = z.object({
  linkId: z.string().uuid().optional(),
  videoId: z.string().uuid("Selecione um vídeo válido."),
  personId: z.string().uuid("Selecione uma pessoa válida.").or(z.literal("")),
  title: z
    .string()
    .trim()
    .min(1, "O título é obrigatório.")
    .max(255, "O título deve ter no máximo 255 caracteres."),
  description: z
    .string()
    .max(1000, "A descrição deve ter no máximo 1000 caracteres."),
});

export const thematicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "O título é obrigatório.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  description: z
    .string()
    .max(1000, "A descrição deve ter no máximo 1000 caracteres.")
    .optional()
    .or(z.literal("")),

  mainVideoId: z
    .string()
    .uuid("Selecione um vídeo principal válido.")
    .or(z.literal("")),

  coordinatorId: z
    .string()
    .uuid("Selecione um coordenador válido.")
    .or(z.literal("")),

  additionalVideos: z.array(thematicVideoSchema),
});

export type ThematicFormData = z.infer<typeof thematicSchema>;

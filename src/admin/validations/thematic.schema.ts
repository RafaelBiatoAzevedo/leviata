import { z } from "zod";

export const thematicSchema = z.object({
  title: z
    .string()
    .min(1, "O título é obrigatório.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  description: z
    .string()
    .max(1000, "A descrição deve ter no máximo 1000 caracteres.")
    .optional()
    .or(z.literal("")),

  mainVideoId: z.string().uuid("Selecione um vídeo principal válido."),

  coordinatorId: z.string().uuid("Selecione um coordenador válido."),

  additionalVideos: z
    .array(z.string().uuid("Selecione vídeos válidos."))
    .optional(),
});

export type ThematicFormData = z.infer<typeof thematicSchema>;

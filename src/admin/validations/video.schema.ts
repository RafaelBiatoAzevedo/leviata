import { z } from "zod";

export const videoSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),

  videoUrl: z
    .string()
    .min(1, "A URL do vídeo é obrigatória.")
    .url("Informe uma URL válida."),

  description: z.string().optional(),

  people: z.array(z.string()).optional(),
});

export type VideoFormData = z.infer<typeof videoSchema>;

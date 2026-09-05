import { z } from "zod";

export const presentedWorkSchema = z.object({
  title: z
    .string()
    .min(1, "Informe o título.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  date: z.string().min(1, "Informe a data."),

  location: z.string().optional(),

  meetingId: z.string().optional(),

  documentUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  registrationUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  recordingUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  meetingUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  authors: z.array(z.string()).min(1, "Selecione pelo menos um autor."),
});

export type PresentedWorkFormData = z.infer<typeof presentedWorkSchema>;

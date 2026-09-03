import { z } from "zod";

export const jurySchema = z.object({
  coverUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  title: z
    .string()
    .min(1, "Informe o título.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  date: z.string().min(1, "Informe a data."),

  description: z.string().optional(),

  location: z.string().optional(),

  judges: z
    .array(z.string().uuid("ID do juiz inválido."))
    .min(1, "Selecione pelo menos um juiz."),

  jurors: z
    .array(z.string().uuid("ID do jurado inválido."))
    .min(1, "Selecione pelo menos um jurado."),

  prosecutors: z
    .array(z.string().uuid("ID do promotor inválido."))
    .min(1, "Selecione pelo menos um promotor."),

  defenders: z
    .array(z.string().uuid("ID do defensor inválido."))
    .min(1, "Selecione pelo menos um defensor."),

  bailiffs: z
    .array(z.string().uuid("ID do oficial de justiça inválido."))
    .min(1, "Selecione pelo menos um oficial de justiça."),

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
});

export type JuryFormData = z.infer<typeof jurySchema>;

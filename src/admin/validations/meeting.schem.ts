import { z } from "zod";

export const meetingSchema = z.object({
  coverUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  title: z.string().min(1, "Informe o título."),

  type: z.enum(["MEETING", "SEMINAR"], {
    message: "Informe o tipo da reunião.",
  }),

  description: z.string().optional(),

  date: z.string().min(1, "Informe a data."),

  location: z.string().optional(),

  registrationUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  meetingUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  speakers: z
    .array(z.string().uuid("Selecione um participante válido."))
    .min(1, "Selecione pelo menos um participante."),
});

export type MeetingFormData = z.infer<typeof meetingSchema>;

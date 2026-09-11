import { z } from "zod";

export const boardSchema = z.object({
  title: z
    .string()
    .min(1, "Informe o título.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  candidateId: z.string().uuid("Selecione o candidato."),

  advisorId: z.string().uuid("Selecione o orientador."),

  members: z
    .array(z.string().uuid())
    .min(1, "Selecione pelo menos um membro da banca."),

  date: z.string().min(1, "Informe a data."),

  meetingUrl: z
    .string()
    .min(1, "Informe a URL.")
    .url("Informe uma URL válida."),
});

export type BoardFormData = z.infer<typeof boardSchema>;

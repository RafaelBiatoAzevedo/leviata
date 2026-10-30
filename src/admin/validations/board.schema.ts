import { z } from "zod";
import { toLocalDateTime } from "../utils/dateTime";
import { BoardType } from "../types/TBoardType";

export const boardSchema = z.object({
  title: z
    .string()
    .min(1, "Informe o título.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  type: z
    .enum(["", BoardType.QUALIFICATION, BoardType.DEFENSE])
    .refine((value) => value !== "", "Selecione o tipo de banca."),

  candidateId: z.string().uuid("Selecione o candidato."),

  advisorId: z.string().uuid("Selecione o orientador."),

  members: z
    .array(z.string().uuid())
    .min(1, "Selecione pelo menos um membro da banca."),

  date: z
    .string()
    .min(1, "Informe a data e hora.")
    .refine(
      (value) => !!value && toLocalDateTime(value) === value,
      "Informe uma data e hora válidas.",
    ),

  meetingUrl: z
    .string()
    .min(1, "Informe a URL.")
    .url("Informe uma URL válida."),
});

export type BoardFormData = z.input<typeof boardSchema>;
export type BoardSubmitData = z.output<typeof boardSchema>;

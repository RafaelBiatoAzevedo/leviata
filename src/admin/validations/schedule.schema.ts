import { z } from "zod";

const isValidDate = (value: string) =>
  Number.isFinite(new Date(value).getTime());

export const scheduleSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "O título é obrigatório.")
      .max(255, "Use até 255 caracteres."),
    subtitle: z.string().trim().max(255, "Use até 255 caracteres."),
    description: z.string(),
    date: z
      .string()
      .min(1, "A data inicial é obrigatória.")
      .refine(isValidDate, "Informe uma data válida."),
    endDate: z
      .string()
      .refine(
        (value) => !value || isValidDate(value),
        "Informe uma data válida.",
      ),
    location: z.string().trim().max(255, "Use até 255 caracteres."),
    externalUrl: z.union([
      z.literal(""),
      z
        .string()
        .url("Informe uma URL válida.")
        .refine(
          (value) => /^https?:\/\//i.test(value),
          "Use uma URL http ou https.",
        ),
    ]),
  })
  .refine(
    (data) => !data.endDate || new Date(data.endDate) >= new Date(data.date),
    {
      path: ["endDate"],
      message: "A data final não pode ser anterior à data inicial.",
    },
  );

export type ScheduleFormData = z.infer<typeof scheduleSchema>;

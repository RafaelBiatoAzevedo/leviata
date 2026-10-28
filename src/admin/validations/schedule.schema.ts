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
    destination: z.enum(["EXTERNAL", "MEETING"]),
    externalUrl: z.string().trim(),
    meetingId: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.destination === "MEETING") {
      if (!z.uuid().safeParse(data.meetingId).success) {
        ctx.addIssue({
          code: "custom",
          path: ["meetingId"],
          message: "Selecione um evento cadastrado.",
        });
      }
    } else if (data.externalUrl) {
      const valid =
        z.url().safeParse(data.externalUrl).success &&
        /^https?:\/\//i.test(data.externalUrl);
      if (!valid)
        ctx.addIssue({
          code: "custom",
          path: ["externalUrl"],
          message: "Informe uma URL válida com http ou https.",
        });
    }
  })
  .refine(
    (data) => !data.endDate || new Date(data.endDate) >= new Date(data.date),
    {
      path: ["endDate"],
      message: "A data final não pode ser anterior à data inicial.",
    },
  );

export type ScheduleFormData = z.infer<typeof scheduleSchema>;

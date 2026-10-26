import { z } from "zod";

export const commentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s+/g, " "))
    .pipe(
      z
        .string()
        .min(3, "Informe seu nome completo.")
        .max(120, "Use até 120 caracteres.")
        .regex(/^\S+\s+\S+/, "Informe nome e sobrenome."),
    ),
  text: z
    .string()
    .trim()
    .min(3, "Escreva pelo menos 3 caracteres.")
    .max(300, "Use até 300 caracteres."),
});

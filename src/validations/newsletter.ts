import { z } from "zod";

export const newsletterSubscriptionSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido.")
    .max(254, "O e-mail deve ter no máximo 254 caracteres."),
  name: z
    .string()
    .trim()
    .max(120, "O nome deve ter no máximo 120 caracteres.")
    .optional(),
  lastName: z
    .string()
    .trim()
    .max(120, "O sobrenome deve ter no máximo 120 caracteres.")
    .optional(),
  cellphone: z
    .string()
    .trim()
    .max(30, "O telefone deve ter no máximo 30 caracteres.")
    .optional(),
});

export type NewsletterSubscriptionFormData = z.infer<
  typeof newsletterSubscriptionSchema
>;

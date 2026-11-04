import { z } from "zod";

export const newsletterSubscriberSchema = z.object({
  name: z.string().trim().max(255, "Use até 255 caracteres."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido.")
    .max(254, "Use até 254 caracteres."),
  cellphone: z.string().trim().max(30, "Use até 30 caracteres."),
  isActive: z.boolean(),
  allowEmail: z.boolean(),
});

export type NewsletterSubscriberFormData = z.infer<
  typeof newsletterSubscriberSchema
>;

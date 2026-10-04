import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().url("Informe uma URL válida.")]);

export const newsletterSchema = z.object({
  title: z.string().min(1, "O título é obrigatório."),
  subject: z.string().min(1, "O assunto é obrigatório."),
  htmlContent: z.string().min(1, "O conteúdo é obrigatório."),
  coverUrl: optionalUrl.optional(),
  pdfUrl: optionalUrl.optional(),
  publishedAt: z.string().optional(),
  sentAt: z.string().optional(),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

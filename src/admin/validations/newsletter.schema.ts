import { z } from "zod";

const optionalUrl = z.union([
  z.literal(""),
  z.string().url("Informe uma URL válida."),
]);

const webUrl = z
  .string()
  .max(2000)
  .refine((value) => {
    if (!value) return true;
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "Informe um link começando com https://.");

const contentSchema = z.object({
  customHtml: z.string().max(200000).optional(),
  version: z.literal(1),
  mode: z.enum(["visual", "html"]),
  template: z.enum(["CLASSIC", "EDITORIAL", "MAGAZINE"]),
  background: z.enum(["paper", "white", "ink"]),
  frame: z.enum(["double", "line", "none"]),
  masthead: z.string().max(200),
  tagline: z.string().max(500),
  editionLabel: z.string().max(100),
  intro: z.string().max(10000),
  footer: z.string().max(2000),
  sections: z
    .array(
      z.object({
        id: z.string().max(80),
        title: z.string().max(200),
        layout: z.enum(["stories", "briefs"]),
        items: z
          .array(
            z.object({
              id: z.string().max(80),
              title: z.string().max(300),
              text: z.string().max(20000),
              details: z.string().max(500),
              imageUrl: webUrl,
              imageAlt: z.string().max(300),
              linkUrl: webUrl,
              linkLabel: z.string().max(100),
            }),
          )
          .max(30),
      }),
    )
    .max(20),
});

export const newsletterSchema = z
  .object({
    title: z.string().min(1, "O título é obrigatório."),
    subject: z.string().min(1, "O assunto é obrigatório."),
    htmlContent: z.string(),
    contentData: contentSchema.optional(),
    coverUrl: optionalUrl.optional(),
    publishedAt: z.string().optional(),
    sentAt: z.string().optional(),
  })
  .superRefine((data, context) => {
    if (data.contentData?.mode === "visual") {
      if (
        !data.contentData.sections.some((section) =>
          section.items.some((item) => item.title.trim() || item.text.trim()),
        )
      )
        context.addIssue({
          code: "custom",
          path: ["htmlContent"],
          message: "Adicione pelo menos um conteúdo com título ou texto.",
        });
    } else if (!data.htmlContent.trim()) {
      context.addIssue({
        code: "custom",
        path: ["htmlContent"],
        message: "O conteúdo HTML é obrigatório no modo avançado.",
      });
    }
  });

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

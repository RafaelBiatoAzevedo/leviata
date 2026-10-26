import { z } from "zod";
import { PersonCategory, type TPersonCategory } from "../types/TPersonCategory";

export const personSchema = z
  .object({
    imageUrl: z
      .string()
      .url("Informe uma URL válida.")
      .optional()
      .or(z.literal("")),

    name: z.string().trim().min(1, "Informe o nome.").max(255),

    category: z.enum(
      Object.values(PersonCategory) as [TPersonCategory, ...TPersonCategory[]],
      {
        message: "Selecione uma categoria.",
      },
    ),

    isActive: z.boolean(),

    displayOrder: z.coerce
      .number()
      .min(0, "A ordem deve ser maior ou igual a zero."),

    birthDate: z.string().optional(),

    bio: z.string().optional(),

    orcid: z.string().optional(),

    email: z
      .string()
      .trim()
      .refine(
        (value) => !value || z.email().safeParse(value).success,
        "Informe um e-mail válido.",
      ),

    lattesUrl: z
      .string()
      .url("Informe uma URL válida.")
      .optional()
      .or(z.literal("")),

    website: z
      .string()
      .url("Informe uma URL válida.")
      .optional()
      .or(z.literal("")),

    linkedinUrl: z
      .string()
      .url("Informe uma URL válida.")
      .optional()
      .or(z.literal("")),

    honorificTitle: z.string().optional(),

    nationalityId: z.string(),

    academicTitleId: z.string(),

    institutionId: z.string(),
  })
  .superRefine((person, context) => {
    if (person.category === PersonCategory.EXTERNO) return;

    const requiredFields = {
      email: "O e-mail é obrigatório.",
      nationalityId: "Selecione uma nacionalidade.",
      academicTitleId: "Selecione um título acadêmico.",
      institutionId: "Selecione uma instituição.",
    } as const;

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!person[field as keyof typeof requiredFields]?.trim()) {
        context.addIssue({ code: "custom", path: [field], message });
      }
    }
  });

export type PersonFormData = z.infer<typeof personSchema>;

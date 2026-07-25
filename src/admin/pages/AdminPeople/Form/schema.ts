import { z } from "zod";
import { PersonCategory } from "../../../../enums/person-category";

export const personSchema = z.object({
  slug: z.string().trim().min(1, "Informe o slug.").max(255),

  name: z.string().trim().min(1, "Informe o nome.").max(255),

  category: z.nativeEnum(PersonCategory, {
    error: "Selecione uma categoria.",
  }),

  isActive: z.boolean(),

  displayOrder: z.coerce
    .number()
    .min(0, "A ordem deve ser maior ou igual a zero."),

  imageUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  birthDate: z.string().optional(),

  bio: z.string().optional(),

  orcid: z.string().optional(),

  email: z
    .string()
    .email("Informe um e-mail válido.")
    .optional()
    .or(z.literal("")),

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

  nationalityId: z.string().optional(),

  academicTitleId: z.string().optional(),

  institutionId: z.string().optional(),
});

export type PersonFormData = z.infer<typeof personSchema>;

import { z } from "zod";
import { PersonCategory } from "../types/TPersonCategory";

export const personSchema = z.object({
  imageUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  name: z.string().trim().min(1, "Informe o nome.").max(255),

  category: z.nativeEnum(PersonCategory, {
    error: "Selecione uma categoria.",
  }),

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
    .min(1, "O e-mail é obrigatório.")
    .email("Informe um e-mail válido."),

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

  nationalityId: z.string().min(1, "Selecione uma nacionalidade."),

  academicTitleId: z.string().min(1, "Selecione um título acadêmico."),

  institutionId: z.string().min(1, "Selecione uma instituição."),
});

export type PersonFormData = z.infer<typeof personSchema>;

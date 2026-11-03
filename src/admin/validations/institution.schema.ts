import { z } from "zod";

export const institutionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome da instituição.")
    .max(255, "O nome deve ter no máximo 255 caracteres."),
  acronym: z
    .string()
    .trim()
    .min(1, "Informe a sigla da instituição.")
    .max(50, "A sigla deve ter no máximo 50 caracteres."),
  countryId: z.string().uuid("Selecione um país válido."),
});

export type InstitutionFormData = z.infer<typeof institutionSchema>;

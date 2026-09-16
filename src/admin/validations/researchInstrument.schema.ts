import { z } from "zod";
import {
  ResearchInstrumentType,
  type TResearchInstrumentType,
} from "../types/TResearchInstrumentType";

export const researchInstrumentSchema = z.object({
  title: z
    .string()
    .min(1, "O título é obrigatório.")
    .max(255, "O título deve ter no máximo 255 caracteres."),

  type: z.enum(
    Object.values(ResearchInstrumentType) as [
      TResearchInstrumentType,
      ...TResearchInstrumentType[],
    ],
  ),

  startYear: z.number().int("O ano deve ser um número inteiro.").optional(),

  endYear: z.number().int("O ano deve ser um número inteiro.").optional(),

  content: z.string().optional(),

  externalUrl: z
    .string()
    .url("Informe uma URL válida.")
    .optional()
    .or(z.literal("")),

  people: z
    .array(z.string().uuid("ID de pessoa inválido."))
    .min(1, "Selecione pelo menos uma pessoa."),
});

export type ResearchInstrumentFormData = z.infer<
  typeof researchInstrumentSchema
>;

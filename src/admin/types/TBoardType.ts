export const BoardType = {
  QUALIFICATION: "QUALIFICATION",
  DEFENSE: "DEFENSE",
} as const;

export type TBoardType = (typeof BoardType)[keyof typeof BoardType];

export const boardTypeLabels: Record<TBoardType, string> = {
  QUALIFICATION: "Banca de Qualificação",
  DEFENSE: "Banca de Defesa",
};

export const boardTypeDescriptions: Record<TBoardType, string> = {
  QUALIFICATION:
    "Validação do projeto e dos capítulos iniciais durante o TCC, mestrado ou doutorado.",
  DEFENSE:
    "Exame final do TCC, dissertação ou tese para conclusão do curso e obtenção do título acadêmico.",
};

export function isBoardType(value: unknown): value is TBoardType {
  return value === BoardType.QUALIFICATION || value === BoardType.DEFENSE;
}

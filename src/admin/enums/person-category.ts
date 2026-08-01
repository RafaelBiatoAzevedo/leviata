export const PersonCategory = {
  DOCENTE: "DOCENTE",
  DISCENTE: "DISCENTE",
  EGRESSO: "EGRESSO",
  PESQUISADOR: "PESQUISADOR",
  SUB_COORDENADOR: "SUB_COORDENADOR",
  COORDENADOR: "COORDENADOR",
} as const;

export type PersonCategory =
  (typeof PersonCategory)[keyof typeof PersonCategory];

export const personCategoryLabels: Record<PersonCategory, string> = {
  DOCENTE: "Docente",
  DISCENTE: "Discente",
  EGRESSO: "Egresso",
  PESQUISADOR: "Pesquisador",
  SUB_COORDENADOR: "Subcoordenador",
  COORDENADOR: "Coordenador",
};

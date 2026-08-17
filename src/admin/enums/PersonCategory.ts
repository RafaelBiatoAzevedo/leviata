export const PersonCategory = {
  DOCENTE: "DOCENTE",
  DISCENTE: "DISCENTE",
  EGRESSO: "EGRESSO",
  PESQUISADOR: "PESQUISADOR",
  SUB_COORDENADOR: "SUB_COORDENADOR",
  COORDENADOR: "COORDENADOR",
} as const;

export type TPersonCategory =
  (typeof PersonCategory)[keyof typeof PersonCategory];

export const personCategoryLabels: Record<TPersonCategory, string> = {
  DOCENTE: "Docente",
  DISCENTE: "Discente",
  EGRESSO: "Egresso",
  PESQUISADOR: "Pesquisador",
  SUB_COORDENADOR: "Subcoordenador",
  COORDENADOR: "Coordenador",
};

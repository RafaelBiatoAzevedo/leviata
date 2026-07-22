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

import type { IconType } from "react-icons";
import { FiFilm, FiMic, FiSearch, FiVideo } from "react-icons/fi";
import { GiInjustice } from "react-icons/gi";
import type { TMeetingType } from "../admin/types/TMeetingType";

export interface ActivityCategory {
  label: string;
  path: string;
  description: string;
  Icon: IconType;
  resource: "research" | "juries" | "meetings";
  type?: TMeetingType;
}

export interface ActivityRecord {
  isInternal?: boolean;
  type?: string;
}

export const activityCategories: ActivityCategory[] = [
  {
    label: "Pesquisas",
    path: "/atividades/pesquisas",
    description: "Projetos e registros de investigação.",
    Icon: FiSearch,
    resource: "research",
  },
  {
    label: "Júris Históricos",
    path: "/atividades/juris-historicos",
    description: "Diálogos entre história, direito e justiça.",
    Icon: GiInjustice,
    resource: "juries",
  },
  {
    label: "Encontros",
    path: "/atividades/encontros",
    description: "Conversas e registros de nossos encontros.",
    Icon: FiVideo,
    resource: "meetings",
    type: "MEETING",
  },
  {
    label: "Seminários",
    path: "/atividades/seminarios",
    description: "Debates e pesquisas compartilhadas pelo grupo.",
    Icon: FiMic,
    resource: "meetings",
    type: "SEMINAR",
  },
  {
    label: "Simpósios",
    path: "/atividades/simposios",
    description: "Encontros de pesquisa e troca de conhecimentos.",
    Icon: FiMic,
    resource: "meetings",
    type: "SYMPOSIUM",
  },
  {
    label: "Mostra de documentários",
    path: "/atividades/mostra-de-documentarios",
    description: "Sessões de cinema, história e memória.",
    Icon: FiFilm,
    resource: "meetings",
    type: "DOCUMENTARY",
  },
];

export function availableActivityCategories(
  records: Record<ActivityCategory["resource"], ActivityRecord[]>,
) {
  return activityCategories.filter((category) =>
    records[category.resource].some((record) =>
      category.resource === "meetings"
        ? record.isInternal === true && record.type === category.type
        : record.isInternal !== false,
    ),
  );
}

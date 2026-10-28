import type { IconType } from "react-icons";
import {
  FiAward,
  FiBook,
  FiCalendar,
  FiClipboard,
  FiCompass,
  FiFileText,
  FiLayers,
  FiMail,
  FiMic,
  FiMonitor,
  FiUsers,
  FiVideo,
} from "react-icons/fi";
import { GiInjustice } from "react-icons/gi";

export const metricGroups = [
  { key: "all", label: "Todos" },
  { key: "collection", label: "Acervo" },
  { key: "activities", label: "Atividades" },
  { key: "communication", label: "Comunicação" },
] as const;

export type MetricGroup = (typeof metricGroups)[number]["key"];

interface DashboardMetric {
  key: string;
  label: string;
  description: string;
  to: string;
  icon: IconType;
  group: Exclude<MetricGroup, "all">;
}

export const dashboardMetrics: DashboardMetric[] = [
  {
    key: "people",
    label: "Pessoas ativas",
    description: "Integrantes e participantes externos",
    to: "/admin/pessoas",
    icon: FiUsers,
    group: "collection",
  },
  {
    key: "books",
    label: "Livros",
    description: "Obras e edições do acervo",
    to: "/admin/livros",
    icon: FiBook,
    group: "collection",
  },
  {
    key: "articles",
    label: "Artigos",
    description: "Produção acadêmica em revista",
    to: "/admin/artigos",
    icon: FiFileText,
    group: "collection",
  },
  {
    key: "dossiers",
    label: "Dossiês editoriais",
    description: "Edições temáticas de publicações",
    to: "/admin/artigos",
    icon: FiLayers,
    group: "collection",
  },
  {
    key: "juries",
    label: "Júris históricos",
    description: "História, direito e participação",
    to: "/admin/juris",
    icon: GiInjustice,
    group: "activities",
  },
  {
    key: "meetings",
    label: "Eventos",
    description: "Encontros, seminários, simpósios e mostras",
    to: "/admin/encontros",
    icon: FiMic,
    group: "activities",
  },
  {
    key: "boards",
    label: "Bancas",
    description: "Qualificações e defesas",
    to: "/admin/bancas",
    icon: FiAward,
    group: "activities",
  },
  {
    key: "presentedWorks",
    label: "Trabalhos apresentados",
    description: "Apresentações e participações",
    to: "/admin/apresentacoes-trabalhos",
    icon: FiMonitor,
    group: "activities",
  },
  {
    key: "research",
    label: "Pesquisas",
    description: "Projetos e núcleos de investigação",
    to: "/admin/pesquisas",
    icon: FiCompass,
    group: "collection",
  },
  {
    key: "researchInstruments",
    label: "Instrumentos de pesquisa",
    description: "Dossiês, catálogos e bancos de dados",
    to: "/admin/instrumentos-pesquisa",
    icon: FiClipboard,
    group: "collection",
  },
  {
    key: "thematics",
    label: "Linhas temáticas",
    description: "Caminhos de pesquisa do grupo",
    to: "/admin/tematicas",
    icon: FiLayers,
    group: "collection",
  },
  {
    key: "videos",
    label: "Vídeos",
    description: "Conteúdos audiovisuais cadastrados",
    to: "/admin/videos",
    icon: FiVideo,
    group: "collection",
  },
  {
    key: "news",
    label: "Notícias",
    description: "Novidades e atualizações do portal",
    to: "/admin/noticias",
    icon: FiFileText,
    group: "communication",
  },
  {
    key: "schedule",
    label: "Agenda",
    description: "Datas e compromissos cadastrados",
    to: "/admin/agenda",
    icon: FiCalendar,
    group: "activities",
  },
  {
    key: "newsletters",
    label: "Newsletters",
    description: "Edições preparadas e publicadas",
    to: "/admin/newsletter",
    icon: FiMail,
    group: "communication",
  },
];

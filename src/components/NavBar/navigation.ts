import type { IconType } from "react-icons";
import {
  FiActivity,
  FiBookOpen,
  FiCalendar,
  FiClipboard,
  FiCompass,
  FiDatabase,
  FiFileText,
  FiFolder,
  FiGrid,
  FiMail,
  FiMic,
  FiSearch,
  FiUsers,
  FiVideo,
} from "react-icons/fi";
import { GiInjustice } from "react-icons/gi";

export interface NavigationLink {
  label: string;
  path: string;
  description: string;
  Icon: IconType;
}

export interface NavigationSection extends NavigationLink {
  children?: NavigationLink[];
}

export const menus: NavigationSection[] = [
  {
    label: "O Grupo",
    path: "/grupo",
    description: "Conheça o Leviatã e o Cativeiro.",
    Icon: FiUsers,
    children: [
      {
        label: "Pesquisadores",
        path: "/grupo/pesquisadores",
        description: "As pessoas que constroem nossas pesquisas.",
        Icon: FiUsers,
      },
      {
        label: "Linhas Temáticas",
        path: "/grupo/linhas-tematicas",
        description: "Temas e caminhos de investigação.",
        Icon: FiCompass,
      },
    ],
  },
  {
    label: "Publicações",
    path: "/publicacoes",
    description: "Livros, artigos, trabalhos e dossiês.",
    Icon: FiBookOpen,
  },
  {
    label: "Instrumentos de Pesquisa",
    path: "/instrumentos",
    description: "Fontes e ferramentas para investigar.",
    Icon: FiSearch,
    children: [
      {
        label: "Planilhas Biblio-Temáticas",
        path: "/instrumentos/planilhas-biblio-tematicas",
        description: "Levantamentos para apoiar a pesquisa.",
        Icon: FiGrid,
      },
      {
        label: "Catálogos",
        path: "/instrumentos/catalogos",
        description: "Guias e referências para consulta.",
        Icon: FiFolder,
      },
      {
        label: "Banco de Dados",
        path: "/instrumentos/banco-de-dados",
        description: "Dados e registros históricos reunidos.",
        Icon: FiDatabase,
      },
    ],
  },
  {
    label: "Atividades",
    path: "/atividades",
    description: "Projetos, encontros e experiências.",
    Icon: FiActivity,
    children: [
      {
        label: "Pesquisas",
        path: "/atividades/pesquisas",
        description: "Projetos e registros de investigação.",
        Icon: FiSearch,
      },
      {
        label: "Apresentações de trabalhos",
        path: "/atividades/apresentacoes-trabalhos",
        description: "A pesquisa do grupo em circulação.",
        Icon: FiFileText,
      },
      {
        label: "Núcleo “Em costas negras”",
        path: "/atividades/nucleo-de-pesquisa-em-costas-negras",
        description: "História e cultura africana e afro-brasileira.",
        Icon: FiUsers,
      },
      {
        label: "Júris Históricos",
        path: "/atividades/juris-historicos",
        description: "Diálogos entre história, direito e justiça.",
        Icon: GiInjustice,
      },
      {
        label: "Encontros e Seminários",
        path: "/atividades/encontros-e-seminarios",
        description: "Conversas e registros de nossos encontros.",
        Icon: FiVideo,
      },
    ],
  },
  {
    label: "Agenda",
    path: "/agenda",
    description: "Acompanhe as próximas datas do grupo.",
    Icon: FiCalendar,
    children: [
      {
        label: "Encontros e Seminários",
        path: "/atividades/encontros-e-seminarios",
        description: "Consulte os encontros e seus registros.",
        Icon: FiVideo,
      },
      {
        label: "Bancas",
        path: "/agenda/bancas",
        description: "Exames de qualificação e defesas.",
        Icon: FiClipboard,
      },
      {
        label: "Seminários",
        path: "/agenda/seminarios",
        description: "Próximos debates e encontros realizados.",
        Icon: FiMic,
      },
    ],
  },
  {
    label: "Notícias",
    path: "/noticias",
    description: "Novidades, boletins e atualizações.",
    Icon: FiFileText,
    children: [
      {
        label: "Newsletter",
        path: "/noticias/newsletter",
        description: "Leia os boletins e receba as novidades.",
        Icon: FiMail,
      },
    ],
  },
  {
    label: "Contato",
    path: "/contato",
    description: "Converse e conecte-se com o grupo.",
    Icon: FiMail,
  },
];

function normalizePath(value: string) {
  const path = value.replace(/\/+$/, "") || "/";
  return path === "/newsletter" ? "/noticias/newsletter" : path;
}

export function isNavigationActive(pathname: string, path: string) {
  const current = normalizePath(pathname);
  const target = normalizePath(path);
  return (
    current === target || (target !== "/" && current.startsWith(`${target}/`))
  );
}

export function navigationCurrent(pathname: string, path: string) {
  if (!isNavigationActive(pathname, path)) return undefined;
  return normalizePath(pathname) === normalizePath(path) ? "page" : "location";
}

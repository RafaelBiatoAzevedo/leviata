import type { IconType } from "react-icons";
import {
  FiActivity,
  FiBookOpen,
  FiCalendar,
  FiClipboard,
  FiCompass,
  FiDatabase,
  FiFileText,
  FiFilm,
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
        label: "Bancas",
        path: "/agenda/bancas",
        description: "Exames de qualificação e defesas.",
        Icon: FiClipboard,
      },
      {
        label: "Pesquisas",
        path: "/atividades/pesquisas",
        description: "Projetos e registros de investigação.",
        Icon: FiSearch,
      },
      {
        label: "Júris Históricos",
        path: "/atividades/juris-historicos",
        description: "Diálogos entre história, direito e justiça.",
        Icon: GiInjustice,
      },
      {
        label: "Encontros",
        path: "/atividades/encontros",
        description: "Conversas e registros de nossos encontros.",
        Icon: FiVideo,
      },
      {
        label: "Seminários",
        path: "/atividades/seminarios",
        description: "Debates e pesquisas compartilhadas pelo grupo.",
        Icon: FiMic,
      },
      {
        label: "Mostra de documentários",
        path: "/atividades/mostra-de-documentarios",
        description: "Sessões de cinema, história e memória.",
        Icon: FiFilm,
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
        label: "Encontros",
        path: "/agenda/encontros",
        description: "Próximos encontros e conversas já realizadas.",
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
      {
        label: "Mostra de documentários",
        path: "/agenda/mostra-de-documentarios",
        description: "Próximas sessões e mostras já realizadas.",
        Icon: FiFilm,
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

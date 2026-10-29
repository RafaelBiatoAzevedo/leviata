import type { IconType } from "react-icons";
import {
  FiAward,
  FiBarChart2,
  FiBell,
  FiBook,
  FiCalendar,
  FiClipboard,
  FiFileText,
  FiFolder,
  FiHome,
  FiLayers,
  FiMail,
  FiMic,
  FiMonitor,
  FiUserCheck,
  FiUsers,
  FiVideo,
} from "react-icons/fi";
import { GiInjustice } from "react-icons/gi";
import { TbFolderSearch } from "react-icons/tb";

interface MenuItem {
  to: string;
  label: string;
  icon: IconType;
  end?: boolean;
  superAdmin?: boolean;
  keywords?: string;
}

interface MenuGroup {
  id: string;
  label: string;
  items: MenuItem[];
}

const groups: MenuGroup[] = [
  {
    id: "overview",
    label: "Visão geral",
    items: [
      { to: "/admin", label: "Dashboard", icon: FiHome, end: true },
      {
        to: "/admin/observatorio",
        label: "Observatório",
        icon: FiBarChart2,
        keywords: "analytics estatísticas acessos audiência",
      },
      { to: "/admin/notificacoes", label: "Notificações", icon: FiBell },
      {
        to: "/admin/documentacao",
        label: "Documentação",
        icon: FiBook,
        keywords:
          "manual ajuda guias documentação completa html arquitetura api",
      },
    ],
  },
  {
    id: "communication",
    label: "Comunicação",
    items: [
      { to: "/admin/noticias", label: "Notícias", icon: FiFileText },
      { to: "/admin/agenda", label: "Agenda", icon: FiCalendar },
      { to: "/admin/newsletter", label: "Newsletter", icon: FiMail },
    ],
  },
  {
    id: "research",
    label: "Pesquisa e acervo",
    items: [
      { to: "/admin/pessoas", label: "Pessoas", icon: FiUsers },
      { to: "/admin/tematicas", label: "Linhas temáticas", icon: FiLayers },
      { to: "/admin/pesquisas", label: "Pesquisas", icon: TbFolderSearch },
      {
        to: "/admin/instrumentos-pesquisa",
        label: "Instrumentos de pesquisa",
        icon: FiClipboard,
      },
      { to: "/admin/livros", label: "Livros", icon: FiBook },
      { to: "/admin/artigos", label: "Artigos / Dossiês", icon: FiFolder },
      {
        to: "/admin/apresentacoes-trabalhos",
        label: "Apresentações de trabalhos",
        icon: FiMonitor,
      },
      { to: "/admin/videos", label: "Vídeos", icon: FiVideo },
    ],
  },
  {
    id: "activities",
    label: "Atividades",
    items: [
      { to: "/admin/juris", label: "Júris históricos", icon: GiInjustice },
      {
        to: "/admin/encontros",
        label: "Eventos",
        keywords: "encontros seminários simpósios mostras documentários",
        icon: FiMic,
      },
      { to: "/admin/bancas", label: "Bancas", icon: FiAward },
    ],
  },
  {
    id: "administration",
    label: "Administração",
    items: [
      {
        to: "/admin/usuarios",
        label: "Usuários",
        icon: FiUserCheck,
        superAdmin: true,
      },
    ],
  },
];

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");

export function adminMenuGroups(role?: string, query = ""): MenuGroup[] {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          (!item.superAdmin || role === "SUPER_ADMIN") &&
          terms.every((term) =>
            normalize(
              `${group.label} ${item.label} ${item.keywords || ""}`,
            ).includes(term),
          ),
      ),
    }))
    .filter((group) => group.items.length > 0);
}

import { useEffect, useId, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import { useNotifications } from "../../contexts/NotificationsContext";
import { adminMenuGroups } from "./navigation";
import {
  ClearSearch,
  EmptySearch,
  Group,
  GroupTitle,
  ItemIcon,
  ItemLabel,
  Menu,
  NavItem,
  Navigation,
  NotificationCount,
  Search,
  SearchSummary,
} from "./styles";

interface Props {
  compact: boolean;
  role?: string;
  onNavigate(): void;
}

export function AdminSidebarMenu({ compact, role, onNavigate }: Props) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const id = useId();
  const { pathname } = useLocation();
  const { unreadCount } = useNotifications();
  const groups = adminMenuGroups(role, compact ? "" : query);
  const searching = !compact && query.trim().length > 0;
  const resultCount = groups.reduce(
    (count, group) => count + group.items.length,
    0,
  );

  useEffect(() => {
    // Keep the current section within reach, including in the collapsed menu.
    if (compact || !query.trim())
      navigation.current
        ?.querySelector<HTMLElement>('[aria-current="page"]')
        ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [pathname, compact, query]);

  function clearSearch() {
    setQuery("");
    input.current?.focus();
  }

  return (
    <Menu>
      {!compact && (
        <Search role="search" aria-label="Busca no menu administrativo">
          <FiSearch aria-hidden="true" />
          <input
            ref={input}
            type="search"
            aria-label="Buscar seção do menu"
            aria-controls={`${id}-links`}
            placeholder="Buscar no menu"
            autoComplete="off"
            maxLength={100}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query) {
                event.preventDefault();
                event.stopPropagation();
                clearSearch();
              }
            }}
          />
          {query && (
            <ClearSearch
              type="button"
              aria-label="Limpar busca"
              onClick={clearSearch}
            >
              <FiX aria-hidden="true" />
            </ClearSearch>
          )}
        </Search>
      )}
      <SearchSummary role="status" aria-live="polite">
        {searching
          ? `${resultCount} ${resultCount === 1 ? "seção encontrada" : "seções encontradas"}`
          : ""}
      </SearchSummary>
      <Navigation
        ref={navigation}
        id={`${id}-links`}
        aria-label="Navegação administrativa"
        $compact={compact}
      >
        {groups.map((group) => (
          <Group key={group.id} aria-labelledby={`${id}-${group.id}`}>
            <GroupTitle id={`${id}-${group.id}`} $compact={compact}>
              <span>{group.label}</span>
            </GroupTitle>
            {group.items.map(({ icon: Icon, ...item }) => {
              const count = item.to === "/admin/notificacoes" ? unreadCount : 0;
              return (
                <NavItem
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  title={compact ? item.label : undefined}
                  aria-label={
                    count ? `${item.label}: ${count} não lidas` : item.label
                  }
                  $compact={compact}
                  onClick={() => {
                    setQuery("");
                    onNavigate();
                  }}
                >
                  <ItemIcon aria-hidden="true">
                    <Icon />
                  </ItemIcon>
                  <ItemLabel $compact={compact}>{item.label}</ItemLabel>
                  {count > 0 && (
                    <NotificationCount $compact={compact} aria-hidden="true">
                      {count > 99 ? "99+" : count}
                    </NotificationCount>
                  )}
                </NavItem>
              );
            })}
          </Group>
        ))}
        {searching && resultCount === 0 && (
          <EmptySearch>
            <FiSearch aria-hidden="true" />
            <strong>Nenhuma seção encontrada</strong>
            <span>Tente outro termo ou limpe a busca.</span>
          </EmptySearch>
        )}
      </Navigation>
    </Menu>
  );
}

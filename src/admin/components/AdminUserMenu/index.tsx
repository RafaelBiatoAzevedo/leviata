import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import {
  FiExternalLink,
  FiLogOut,
  FiMoreVertical,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Container,
  OptionsButton,
  Menu,
  MenuItem,
  Separator,
  MenuHeading,
} from "./styles";

export function AdminUserMenu({ onLogout }: { onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    menu.current
      ?.querySelector<HTMLButtonElement>('[role="menuitem"]')
      ?.focus();
    function outside(event: PointerEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  function goTo(path: string) {
    setOpen(false);
    navigate(path);
  }

  function handleKeys(event: KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(
      menu.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ??
        [],
    );
    const index = items.findIndex((item) => item === document.activeElement);
    if (event.key === "Tab") {
      setOpen(false);
      trigger.current?.focus();
      return;
    }
    let next: number;
    if (event.key === "ArrowDown") next = (index + 1) % items.length;
    else if (event.key === "ArrowUp")
      next = (index - 1 + items.length) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    items[next]?.focus();
  }

  return (
    <Container ref={wrapper}>
      <OptionsButton
        ref={trigger}
        type="button"
        aria-label="Opções da conta"
        title="Opções da conta"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <FiMoreVertical aria-hidden="true" />
      </OptionsButton>
      {open && (
        <Menu
          ref={menu}
          id={menuId}
          role="menu"
          aria-label="Opções da conta"
          onKeyDown={handleKeys}
          onBlur={(event) => {
            if (!wrapper.current?.contains(event.relatedTarget)) setOpen(false);
          }}
        >
          <MenuHeading role="presentation">
            <span>Conectado como</span>
            <strong>{user?.email}</strong>
          </MenuHeading>
          <MenuItem
            role="menuitem"
            type="button"
            onClick={() => goTo("/admin/minha-conta")}
          >
            <FiUser aria-hidden="true" />
            Minha conta
          </MenuItem>
          {user?.role === "SUPER_ADMIN" && (
            <MenuItem
              role="menuitem"
              type="button"
              onClick={() => goTo("/admin/usuarios")}
            >
              <FiUsers aria-hidden="true" />
              Gerenciar usuários
            </MenuItem>
          )}
          <MenuItem role="menuitem" type="button" onClick={() => goTo("/")}>
            <FiExternalLink aria-hidden="true" />
            Voltar ao site
          </MenuItem>
          <Separator role="separator" />
          <MenuItem
            role="menuitem"
            type="button"
            $danger
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <FiLogOut aria-hidden="true" />
            Sair da conta
          </MenuItem>
        </Menu>
      )}
    </Container>
  );
}

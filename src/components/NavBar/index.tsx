import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { FiArrowUpRight, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import leviataLogo from "../../assets/images/leviataLogo.png";
import { SocialLinks } from "../SocialLinks";
import {
  isNavigationActive,
  navigationCurrent,
  menus,
  type NavigationSection,
} from "./navigation";
import {
  ActionsWrapper,
  Container,
  Copy,
  DesktopOnly,
  Dropdown,
  DropdownArrow,
  DropdownContent,
  DropdownHeading,
  DropdownPanel,
  FooterMenuMobile,
  Logo,
  LogoButtonWrapper,
  Menu,
  MenuItem,
  MenuToggle,
  MenuWrapper,
  MobileCategoryCopy,
  MobileCategoryIcon,
  MobileGroup,
  MobileGroupHeader,
  MobileIntro,
  MobileMenu,
  MobileOnly,
  MobileSubmenu,
  SubmenuCopy,
  SubmenuIcon,
  SubmenuItem,
  SubmenuList,
  TitleColumn,
} from "./styles";
import { ThemeToggle } from "../ThemeToggle";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const dropdownRef = useRef<HTMLLIElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const clickCount = useRef(0);
  const timer = useRef<number | null>(null);
  const navId = useId();
  const location = useLocation();
  const navigate = useNavigate();
  const mobileMenuId = "portal-mobile-menu";

  function submenuId(menu: NavigationSection, mode: "desktop" | "mobile") {
    return `${navId}-${mode}-${menu.path.slice(1)}`;
  }

  function closeMenus() {
    setIsOpen(false);
    setOpenDropdown(null);
  }

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const background = Array.from(
      navRef.current?.parentElement?.querySelectorAll<HTMLElement>(
        "main, footer",
      ) ?? [],
    ).map((element) => ({ element, inert: element.inert }));
    background.forEach(({ element }) => {
      element.inert = true;
    });
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() =>
      mobileRef.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus(),
    );

    const desktop = window.matchMedia("(min-width: 1201px)");
    const closeOnDesktop = () => {
      if (desktop.matches) {
        setIsOpen(false);
        setOpenDropdown(null);
      }
    };
    const closeOnHistory = () => {
      setIsOpen(false);
      setOpenDropdown(null);
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        setOpenDropdown(null);
        toggleRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        navRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [],
      ).filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    desktop.addEventListener("change", closeOnDesktop);
    window.addEventListener("popstate", closeOnHistory);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      background.forEach(({ element, inert }) => {
        element.inert = inert;
      });
      desktop.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("popstate", closeOnHistory);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen || !openDropdown) return;
    const handleOutside = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node))
        setOpenDropdown(null);
    };
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      dropdownRef.current
        ?.querySelector<HTMLButtonElement>("[data-submenu-toggle]")
        ?.focus();
      setOpenDropdown(null);
    };
    const handleHistory = () => setOpenDropdown(null);
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("popstate", handleHistory);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("popstate", handleHistory);
    };
  }, [isOpen, openDropdown]);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );

  function handleLogoClick() {
    closeMenus();
    clickCount.current++;
    if (clickCount.current === 1) navigate("/");
    if (timer.current !== null) window.clearTimeout(timer.current);
    if (clickCount.current === 3) {
      clickCount.current = 0;
      timer.current = null;
      navigate("/admin");
      return;
    }
    timer.current = window.setTimeout(() => {
      clickCount.current = 0;
    }, 600);
  }

  function handleMenuToggle() {
    if (isOpen) closeMenus();
    else {
      setOpenDropdown(
        menus.find(
          (menu) =>
            menu.children && isNavigationActive(location.pathname, menu.path),
        )?.path ?? null,
      );
      setIsOpen(true);
    }
  }

  function handleDropdownKeyDown(
    event: KeyboardEvent<HTMLLIElement>,
    menu: NavigationSection,
  ) {
    if (!menu.children) return;
    if (event.key === "Escape" && openDropdown === menu.path) {
      event.preventDefault();
      event.stopPropagation();
      setOpenDropdown(null);
      event.currentTarget
        .querySelector<HTMLButtonElement>("[data-submenu-toggle]")
        ?.focus();
      return;
    }
    const direction =
      event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    const edge =
      event.key === "Home" ? "first" : event.key === "End" ? "last" : null;
    if (!direction && (!edge || openDropdown !== menu.path)) return;
    event.preventDefault();
    const panelId = submenuId(menu, "desktop");
    if (openDropdown !== menu.path) {
      setOpenDropdown(menu.path);
      window.requestAnimationFrame(() => {
        const links = document
          .getElementById(panelId)
          ?.querySelectorAll<HTMLAnchorElement>("a[href]");
        const target = direction < 0 ? links?.[links.length - 1] : links?.[0];
        target?.focus();
      });
      return;
    }
    const links = Array.from(
      event.currentTarget.querySelectorAll<HTMLAnchorElement>(
        "[data-submenu-link]",
      ),
    );
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next =
      edge === "first"
        ? 0
        : edge === "last"
          ? links.length - 1
          : index < 0
            ? direction < 0
              ? links.length - 1
              : 0
            : (index + direction + links.length) % links.length;
    links[next]?.focus();
  }

  return (
    <Container ref={navRef} aria-label="Navegação principal">
      <LogoButtonWrapper
        type="button"
        onClick={handleLogoClick}
        aria-label="Leviatã e o Cativeiro: página inicial"
      >
        <Logo src={leviataLogo} alt="" />
        <TitleColumn aria-hidden="true">
          <p>Leviatã</p>
          <p>e o</p>
          <p>Cativeiro</p>
        </TitleColumn>
      </LogoButtonWrapper>

      <DesktopOnly>
        <Menu>
          {menus.map((menu) => {
            const active = isNavigationActive(location.pathname, menu.path);
            const expanded = openDropdown === menu.path;
            return (
              <Dropdown
                key={menu.path}
                ref={expanded ? dropdownRef : null}
                $active={active}
                $open={expanded}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse")
                    setOpenDropdown(menu.children ? menu.path : null);
                }}
                onPointerLeave={(event) => {
                  if (
                    event.pointerType === "mouse" &&
                    !event.currentTarget.contains(document.activeElement)
                  )
                    setOpenDropdown(null);
                }}
                onBlur={(event) => {
                  if (
                    !event.currentTarget.contains(
                      event.relatedTarget as Node | null,
                    )
                  )
                    setOpenDropdown(null);
                }}
                onKeyDown={(event) => handleDropdownKeyDown(event, menu)}
              >
                <MenuItem
                  to={menu.path}
                  $active={active}
                  onClick={closeMenus}
                  data-main-link
                  aria-current={navigationCurrent(location.pathname, menu.path)}
                >
                  {menu.label}
                </MenuItem>
                {menu.children && (
                  <DropdownArrow
                    type="button"
                    data-submenu-toggle
                    $expanded={expanded}
                    aria-label={`Submenu de ${menu.label}`}
                    aria-expanded={expanded}
                    aria-controls={submenuId(menu, "desktop")}
                    onClick={() =>
                      setOpenDropdown((current) =>
                        current === menu.path ? null : menu.path,
                      )
                    }
                  >
                    <FiChevronDown aria-hidden="true" />
                  </DropdownArrow>
                )}
                {menu.children && (
                  <DropdownContent
                    id={submenuId(menu, "desktop")}
                    hidden={!expanded}
                    inert={!expanded}
                  >
                    <DropdownPanel>
                      <DropdownHeading>
                        <strong>{menu.label}</strong>
                        <span>{menu.description}</span>
                      </DropdownHeading>
                      <SubmenuList>
                        {menu.children.map(({ Icon, ...submenu }) => {
                          const selected =
                            active &&
                            isNavigationActive(location.pathname, submenu.path);
                          return (
                            <li key={submenu.path}>
                              <SubmenuItem
                                to={submenu.path}
                                onClick={closeMenus}
                                $active={selected}
                                data-submenu-link
                                aria-current={
                                  selected
                                    ? navigationCurrent(
                                        location.pathname,
                                        submenu.path,
                                      )
                                    : undefined
                                }
                              >
                                <SubmenuIcon aria-hidden="true">
                                  <Icon />
                                </SubmenuIcon>
                                <SubmenuCopy>
                                  <strong>{submenu.label}</strong>
                                  <span>{submenu.description}</span>
                                </SubmenuCopy>
                                <FiArrowUpRight aria-hidden="true" />
                              </SubmenuItem>
                            </li>
                          );
                        })}
                      </SubmenuList>
                    </DropdownPanel>
                  </DropdownContent>
                )}
              </Dropdown>
            );
          })}
        </Menu>
      </DesktopOnly>

      <DesktopOnly $actions>
        <ActionsWrapper>
          <ThemeToggle />
        </ActionsWrapper>
      </DesktopOnly>

      <MobileOnly>
        <ThemeToggle />
        <MenuToggle
          ref={toggleRef}
          type="button"
          $open={isOpen}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls={mobileMenuId}
          onClick={handleMenuToggle}
        >
          {isOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </MenuToggle>
      </MobileOnly>

      <MobileMenu
        ref={mobileRef}
        id={mobileMenuId}
        $open={isOpen}
        inert={!isOpen}
        aria-hidden={!isOpen}
      >
        <MobileIntro>
          <span>Leviatã e o Cativeiro</span>
          <h2>Explore o portal</h2>
          <p>Pesquisas, produções e atividades do grupo.</p>
        </MobileIntro>
        <MenuWrapper>
          {menus.map((menu) => {
            const active = isNavigationActive(location.pathname, menu.path);
            const expanded = openDropdown === menu.path;
            const Icon = menu.Icon;
            return (
              <MobileGroup key={menu.path} $active={active}>
                <MobileGroupHeader>
                  <MenuItem
                    to={menu.path}
                    $active={active}
                    onClick={closeMenus}
                    id={`${navId}-mobile-${menu.path.slice(1)}-label`}
                    aria-current={navigationCurrent(
                      location.pathname,
                      menu.path,
                    )}
                  >
                    <MobileCategoryIcon aria-hidden="true">
                      <Icon />
                    </MobileCategoryIcon>
                    <MobileCategoryCopy>
                      <strong>{menu.label}</strong>
                      <span>{menu.description}</span>
                    </MobileCategoryCopy>
                  </MenuItem>
                  {menu.children && (
                    <DropdownArrow
                      type="button"
                      $expanded={expanded}
                      aria-label={`Submenu de ${menu.label}`}
                      aria-expanded={expanded}
                      aria-controls={submenuId(menu, "mobile")}
                      onClick={() =>
                        setOpenDropdown((current) =>
                          current === menu.path ? null : menu.path,
                        )
                      }
                    >
                      <FiChevronDown aria-hidden="true" />
                    </DropdownArrow>
                  )}
                </MobileGroupHeader>
                {menu.children && (
                  <MobileSubmenu
                    id={submenuId(menu, "mobile")}
                    hidden={!expanded}
                  >
                    {menu.children.map(({ Icon: ChildIcon, ...submenu }) => {
                      const selected =
                        active &&
                        isNavigationActive(location.pathname, submenu.path);
                      return (
                        <li key={submenu.path}>
                          <SubmenuItem
                            to={submenu.path}
                            onClick={closeMenus}
                            $active={selected}
                            aria-current={
                              selected
                                ? navigationCurrent(
                                    location.pathname,
                                    submenu.path,
                                  )
                                : undefined
                            }
                          >
                            <SubmenuIcon aria-hidden="true">
                              <ChildIcon />
                            </SubmenuIcon>
                            <SubmenuCopy>
                              <strong>{submenu.label}</strong>
                              <span>{submenu.description}</span>
                            </SubmenuCopy>
                            <FiArrowUpRight aria-hidden="true" />
                          </SubmenuItem>
                        </li>
                      );
                    })}
                  </MobileSubmenu>
                )}
              </MobileGroup>
            );
          })}
        </MenuWrapper>
        <FooterMenuMobile>
          <SocialLinks />
          <Copy>© {new Date().getFullYear()} Rafael Azevedo</Copy>
        </FooterMenuMobile>
      </MobileMenu>
    </Container>
  );
};

import {
  ActionsWrapper,
  Container,
  Copy,
  DesktopOnly,
  Dropdown,
  DropdownArrow,
  DropdownContent,
  FooterMenuMobile,
  //LanguageButton,
  Logo,
  LogoButtonWrapper,
  Menu,
  MenuItem,
  MenuWrapper,
  MenuToggle,
  MobileMenu,
  MobileOnly,
  SubmenuItem,
  TitleColumn,
  //SwitchCircle,
  //ThemeSwitch,
} from "./styles";

//import { useTranslation } from "react-i18next";

import { useEffect, useRef, useState } from "react";

import leviataLogo from "../../assets/images/leviataLogo.png";

import { SocialLinks } from "../SocialLinks";

import { FiChevronDown, FiChevronUp, FiMenu, FiX } from "react-icons/fi";

import { Link, useLocation, useNavigate } from "react-router-dom";
//import { useTranslation } from "react-i18next";

const menus = [
  {
    label: "O Grupo",
    path: "/grupo",
    children: [
      { label: "O Grupo", path: "/grupo" },
      { label: "Pesquisadores", path: "/grupo/pesquisadores" },
      { label: "Linhas Temáticas", path: "/grupo/linhas-tematicas" },
    ],
  },
  { label: "Publicações", path: "/publicacoes" },
  {
    label: "Instrumentos de Pesquisa",
    path: "/instrumentos",
    children: [
      { label: "Intrumentos de Pesquisa", path: "/instrumentos" },
      {
        label: "Planilhas Biblio-Temáticas",
        path: "/instrumentos/planilhas-biblio-tematicas",
      },
      { label: "Catálogos", path: "/instrumentos/catalogos" },
      { label: "Banco de Dados", path: "/instrumentos/banco-de-dados" },
    ],
  },
  {
    label: "Atividades",
    path: "/atividades",
    children: [
      { label: "Atividades", path: "/atividades" },
      {
        label: "Pesquisas",
        path: "/atividades/nucleo-de-pesquisa-em-costas-negras",
      },
      { label: "Júris Históricos", path: "/atividades/juris-historicos" },
      {
        label: "Encontros e Seminários",
        path: "/atividades/encontros-e-seminarios",
      },
    ],
  },
  {
    label: "Agenda",
    path: "/agenda",
    children: [
      { label: "Agenda", path: "/agenda" },
      { label: "Encontros", path: "/agenda/encontros" },
      { label: "Bancas", path: "/agenda/bancas" },
      { label: "Seminários", path: "/agenda/seminarios" },
    ],
  },
  {
    label: "Notícias",
    path: "/noticias",
    children: [
      { label: "Notícias", path: "/noticias" },
      { label: "Newsletter", path: "/noticias/newsletter" },
    ],
  },
  { label: "Contato", path: "/contato" },
];

// interface NavbarProps {
//   toggleTheme: () => void;
//   theme: string;
// }

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLLIElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  //const { i18n } = useTranslation();

  const location = useLocation();

  const navigate = useNavigate();

  const clickCount = useRef(0);

  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const desktop = window.matchMedia("(min-width: 1201px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setIsOpen(false);
    };
    const closeOnHistory = () => setIsOpen(false);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
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
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("popstate", closeOnHistory);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogoClick() {
    setIsOpen(false);
    clickCount.current++;

    if (clickCount.current === 1) {
      navigate("/");
    }

    if (clickCount.current === 3) {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }

      clickCount.current = 0;

      navigate("/admin");

      return;
    }

    if (timer.current) {
      window.clearTimeout(timer.current);
    }

    timer.current = window.setTimeout(() => {
      clickCount.current = 0;
    }, 600);
  }

  // const toggleLanguage = () => {
  //   const newLang = i18n.language === "pt" ? "en" : "pt";
  //   i18n.changeLanguage(newLang);
  //   localStorage.setItem("portfolio-language", newLang);
  // };

  const handleDropdown = (menu: string) => {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  return (
    <Container ref={navRef} aria-label="Navegação principal">
      <LogoButtonWrapper as="button" type="button" onClick={handleLogoClick}>
        <Logo src={leviataLogo} alt="Leviata e o cativeiro" />
        <TitleColumn>
          <p>Leviatã</p>
          <p>e o</p>
          <p>Cativeiro</p>
        </TitleColumn>
      </LogoButtonWrapper>

      <DesktopOnly>
        <Menu>
          {menus.map((menu) => {
            const isHashLink = menu.path.startsWith("#");

            const isActive =
              location.pathname === menu.path ||
              menu.children?.some((child) => child.path === location.pathname);

            return (
              <Dropdown
                key={menu.label}
                ref={openDropdown === menu.label ? dropdownRef : null}
              >
                <MenuItem
                  as={isHashLink ? "a" : Link}
                  href={isHashLink ? menu.path : undefined}
                  to={!isHashLink ? menu.path : undefined}
                  $active={isActive}
                >
                  {menu.label}
                </MenuItem>
                {menu.children && (
                  <DropdownArrow
                    type="button"
                    aria-label={`Submenu de ${menu.label}`}
                    aria-expanded={openDropdown === menu.label}
                    aria-controls={`submenu-${menu.path.slice(1)}`}
                    onClick={() => handleDropdown(menu.label)}
                  >
                    {openDropdown === menu.label ? (
                      <FiChevronUp />
                    ) : (
                      <FiChevronDown />
                    )}
                  </DropdownArrow>
                )}

                {menu.children && openDropdown === menu.label && (
                  <DropdownContent id={`submenu-${menu.path.slice(1)}`}>
                    {menu.children.map((submenu) => (
                      <SubmenuItem
                        key={submenu.path}
                        as={Link}
                        to={submenu.path}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {submenu.label}
                      </SubmenuItem>
                    ))}
                  </DropdownContent>
                )}
              </Dropdown>
            );
          })}
        </Menu>
      </DesktopOnly>

      <DesktopOnly>
        <ActionsWrapper style={{ display: "none" }}>
          {/* <ThemeSwitch onClick={toggleTheme}>
            <SwitchCircle themeMode={theme}>
              {theme === "dark" ? "🌙" : "☀️"}
            </SwitchCircle>
          </ThemeSwitch>

          <LanguageButton onClick={toggleLanguage}>
            {i18n.language === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}
          </LanguageButton> */}
        </ActionsWrapper>
      </DesktopOnly>

      <MobileOnly>
        <MenuToggle
          ref={toggleRef}
          type="button"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls="portal-mobile-menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </MenuToggle>
      </MobileOnly>

      <MobileMenu
        id="portal-mobile-menu"
        $open={isOpen}
        inert={!isOpen}
        aria-hidden={!isOpen}
      >
        <MenuWrapper>
          {menus.map((menu) => (
            <div key={menu.label}>
              <MenuItem
                as={Link}
                to={menu.path}
                onClick={() => setIsOpen(false)}
                $active={location.pathname === menu.path}
              >
                {menu.label}
              </MenuItem>

              {menu.children?.map((submenu) => (
                <SubmenuItem
                  key={submenu.path}
                  as={Link}
                  to={submenu.path}
                  onClick={() => setIsOpen(false)}
                >
                  {submenu.label}
                </SubmenuItem>
              ))}
            </div>
          ))}

          {/* <ActionsWrapper>
            <ThemeSwitch onClick={toggleTheme}>
              <SwitchCircle themeMode={theme}>
                {theme === "dark" ? "🌙" : "☀️"}
              </SwitchCircle>
            </ThemeSwitch>

            <LanguageButton onClick={toggleLanguage}>
              {i18n.language === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}
            </LanguageButton>
          </ActionsWrapper> */}
        </MenuWrapper>

        <FooterMenuMobile>
          <SocialLinks />

          <Copy>© {new Date().getFullYear()} Rafael Azevedo</Copy>
        </FooterMenuMobile>
      </MobileMenu>
    </Container>
  );
};

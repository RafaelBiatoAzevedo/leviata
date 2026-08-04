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
  MobileMenu,
  MobileOnly,
  SubmenuItem,
  //SwitchCircle,
  //ThemeSwitch,
} from "./styles";

//import { useTranslation } from "react-i18next";

import { useEffect, useRef, useState } from "react";

import leviataLogo from "../../assets/images/leviataLogo.png";

import { SocialLinks } from "../SocialLinks";

import { FiChevronDown, FiChevronUp, FiMenu, FiX } from "react-icons/fi";

import { useTheme } from "styled-components";

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
        label: 'Nucleo de Pesquisa "Em costas negras"',
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
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { colors } = useTheme();

  //const { i18n } = useTranslation();

  const location = useLocation();

  const navigate = useNavigate();

  const clickCount = useRef(0);

  const timer = useRef<number | null>(null);

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
    <Container>
      <LogoButtonWrapper as="button" type="button" onClick={handleLogoClick}>
        <Logo src={leviataLogo} alt="Leviata e o cativeiro" />
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

                  {menu.children && (
                    <DropdownArrow
                      onClick={(e) => {
                        e.preventDefault();

                        handleDropdown(menu.label);
                      }}
                    >
                      {openDropdown === menu.label ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </DropdownArrow>
                  )}
                </MenuItem>

                {menu.children && openDropdown === menu.label && (
                  <DropdownContent>
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
        {isOpen ? (
          <FiX
            size={"3rem"}
            color={colors.textSoft}
            onClick={() => setIsOpen(false)}
          />
        ) : (
          <FiMenu
            size={"3rem"}
            color={colors.textSoft}
            onClick={() => setIsOpen(true)}
          />
        )}
      </MobileOnly>

      <MobileMenu $open={isOpen}>
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

import {
  ActionsWrapper,
  Container,
  Copy,
  DesktopOnly,
  FooterMenuMobile,
  LanguageButton,
  Logo,
  LogoWrapper,
  Menu,
  MenuItem,
  MenuWrapper,
  MobileMenu,
  MobileOnly,
  SwitchCircle,
  ThemeSwitch,
} from "./styles";
import { useTranslation } from "react-i18next";

import { useEffect, useState } from "react";
import leviataLogo from "../../assets/images/leviataLogo.png";
import { SocialLinks } from "../SocialLinks";
import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiGrid,
  FiHome,
  FiMail,
  FiMenu,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useTheme } from "styled-components";

interface NavbarProps {
  toggleTheme: () => void;
  theme: string;
}
//using in other project
// const sectionAndIcons = {
//   hero: FiHome,
//   about: FiUser,
//   projects: FiGrid,
//   experiences: FiBriefcase,
//   education: FiBookOpen,
//   courses: FiAward,
//   contact: FiMail,
// };

export const menus = [
  {
    label: "O Grupo",
    path: "/grupo",

    children: [
      {
        label: "Pesquisadores",
        path: "/grupo/pesquisadores",
      },

      {
        label: "Linhas Temáticas",
        path: "/grupo/linhas-tematicas",
      },
    ],
  },

  {
    label: "Publicações",
    path: "/publicacoes",
  },

  {
    label: "Instrumentos de Pesquisa",
    path: "/instrumentos",

    children: [
      {
        label: "Planilhas",
        path: "/instrumentos/planilhas",
      },

      {
        label: "Catálogos",
        path: "/instrumentos/catalogos",
      },

      {
        label: "Banco de Dados",
        path: "/instrumentos/banco-de-dados",
      },
    ],
  },

  {
    label: "Atividades",
    path: "/atividades",

    children: [
      {
        label: "Pesquisas",
        path: "/atividades/pesquisas",
      },

      {
        label: "Júris",
        path: "/atividades/juris",
      },

      {
        label: "Encontros",
        path: "/atividades/encontros",
      },
    ],
  },

  {
    label: "Agenda",
    path: "/agenda",

    children: [
      {
        label: "Encontros",
        path: "/agenda/encontros",
      },

      {
        label: "Bancas",
        path: "/agenda/bancas",
      },

      {
        label: "Seminários",
        path: "/agenda/seminarios",
      },
    ],
  },

  {
    label: "Notícias",
    path: "/noticias",

    children: [
      {
        label: "Newsletter",
        path: "/noticias/newsletter",
      },
    ],
  },

  {
    label: "Contato",
    path: "/contato",
  },
];

export const Navbar = ({ toggleTheme, theme }: NavbarProps) => {
  const [active, setActive] = useState("hero");
  const [isOpen, setIsOpen] = useState(false);
  const { colors } = useTheme();
  const { i18n, t } = useTranslation();

  //using in other project
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
      },
    );

    Object.keys(sectionAndIcons).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(newLang);
    localStorage.setItem("portfolio-language", newLang);
  };

  const handleClick = () => setIsOpen(false);

  return (
    <Container>
      <LogoWrapper>
        <Logo src={leviataLogo} alt="Leviata e o cativeiro logo" />
      </LogoWrapper>

      <DesktopOnly>
        <Menu>
          {menus.map((menu) => (
            <MenuItem
              key={menu.label}
              as="a"
              href={`#${name}`}
              $active={active === name}
            >
              {menu.label}
            </MenuItem>
          ))}
        </Menu>
      </DesktopOnly>

      <DesktopOnly>
        <ActionsWrapper>
          <ThemeSwitch onClick={toggleTheme}>
            <SwitchCircle themeMode={theme}>
              {theme === "dark" ? "🌙" : "☀️"}
            </SwitchCircle>
          </ThemeSwitch>

          <LanguageButton onClick={toggleLanguage}>
            {i18n.language === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}
          </LanguageButton>
        </ActionsWrapper>
      </DesktopOnly>

      <MobileOnly>
        {isOpen ? (
          <FiX
            size={"3rem"}
            color={colors.textSoft}
            onClick={() => setIsOpen(!isOpen)}
          />
        ) : (
          <FiMenu
            size={"3rem"}
            color={colors.textSoft}
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
      </MobileOnly>

      <MobileMenu $open={isOpen}>
        <MenuWrapper>
          {Object.entries(sectionAndIcons).map(([name, Icon]) => {
            return (
              <MenuItem
                key={name}
                as="a"
                href={`#${name}`}
                $active={active === name}
                onClick={handleClick}
              >
                <Icon />
                {t(`nav.${name}`)}
              </MenuItem>
            );
          })}

          <ActionsWrapper>
            <ThemeSwitch onClick={toggleTheme}>
              <SwitchCircle themeMode={theme}>
                {theme === "dark" ? "🌙" : "☀️"}
              </SwitchCircle>
            </ThemeSwitch>

            <LanguageButton onClick={toggleLanguage}>
              {i18n.language === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}
            </LanguageButton>
          </ActionsWrapper>
        </MenuWrapper>

        <FooterMenuMobile>
          <SocialLinks />
          <Copy>© {new Date().getFullYear()} Rafael Azevedo</Copy>
        </FooterMenuMobile>
      </MobileMenu>
    </Container>
  );
};

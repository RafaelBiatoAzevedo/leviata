export const lightTheme = {
  mode: "light" as const,
  colors: {
    background: "#FFFFFF",
    backgroundCard: "#000000",
    surface: "#fcfaf5",
    primary: "#C6A15B",
    secondary: "#111827",

    onSecondary: "#E5E7EB",

    text: "#000000",
    textSoft: "#8B929D",
    heading: "#111827",
    onPrimary: "#000000",

    border: "#C6A15B",

    accent: "#C6A15B",
    accentHover: "#D4B06A",

    accentSoft: "rgba(198, 161, 91, 0.12)",
    accentGlow: "rgba(198, 161, 91, 0.28)",

    feedback: {
      info: {
        main: "#3B82F6",
        light: "#DBEAFE",
        border: "#93C5FD",
      },

      success: {
        main: "#22C55E",
        light: "#DCFCE7",
        border: "#86EFAC",
      },

      warning: {
        main: "#F59E0B",
        light: "#FEF3C7",
        border: "#FCD34D",
      },

      danger: {
        main: "#EF4444",
        light: "#FEE2E2",
        border: "#FCA5A5",
      },
    },
  },

  breakpoints: {
    smallMobile: "360px",
    mobile: "480px",
    tablet: "768px",
    laptop: "1024px",
    desktop: "1280px",
    fullhd: "1920px",
  },

  fonts: {
    title: "'Cormorant Garamond', serif",
    body: "'Inter', sans-serif",
  },
};

export const darkTheme = {
  ...lightTheme,
  mode: "dark" as const,
  colors: {
    ...lightTheme.colors,
    background: "#10141C",
    backgroundCard: "#151B25",
    surface: "#191F2A",
    primary: "#C6A15B",
    secondary: "#111827",
    onSecondary: "#E5E7EB",
    text: "#ECE7DE",
    textSoft: "#B2BBCA",
    heading: "#F2EDE4",
    onPrimary: "#111827",
    border: "#465164",

    accent: "#C6A15B",
    accentHover: "#D4B06A",

    accentSoft: "rgba(198, 161, 91, 0.12)",
    accentGlow: "rgba(198, 161, 91, 0.28)",

    feedback: {
      info: {
        main: "#93C5FD",
        light: "#182B43",
        border: "#426C9F",
      },

      success: {
        main: "#86EFAC",
        light: "#152D24",
        border: "#397D55",
      },

      warning: {
        main: "#FCD34D",
        light: "#362B18",
        border: "#8B6D35",
      },

      danger: {
        main: "#FDA4AF",
        light: "#361F25",
        border: "#93534C",
      },
    },
  },
};

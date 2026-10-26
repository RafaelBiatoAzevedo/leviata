import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "../styles/themes";
import {
  normalizeThemePreference,
  readThemePreference,
  saveThemePreference,
  THEME_STORAGE_KEY,
} from "../utils/themePreference";
import { ThemeContext } from "./theme-context";

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState(readThemePreference);
  const theme = mode === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    saveThemePreference(mode);
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme.colors.background);
  }, [mode, theme]);

  useEffect(() => {
    function synchronize(event: StorageEvent) {
      if (event.key === THEME_STORAGE_KEY || event.key === null) {
        setMode(normalizeThemePreference(event.newValue));
      }
    }
    window.addEventListener("storage", synchronize);
    return () => window.removeEventListener("storage", synchronize);
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((current) => (current === "dark" ? "light" : "dark"));
  }, []);
  const value = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

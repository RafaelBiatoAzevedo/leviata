import { createContext } from "react";
import type { ThemeMode } from "../utils/themePreference";

export interface ThemeContextData {
  mode: ThemeMode;
  toggleTheme(): void;
}

export const ThemeContext = createContext<ThemeContextData>({
  mode: "light",
  toggleTheme: () => {},
});

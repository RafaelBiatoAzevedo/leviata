import { useContext } from "react";
import { ThemeContext } from "../contexts/theme-context";

export function useThemeMode() {
  return useContext(ThemeContext);
}

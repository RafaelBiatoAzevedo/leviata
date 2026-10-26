export type ThemeMode = "light" | "dark";
// Reuse the preference key from the original, commented theme structure.
export const THEME_STORAGE_KEY = "portfolio-theme";

export function normalizeThemePreference(value: unknown): ThemeMode {
  return value === "dark" ? "dark" : "light";
}

export function readThemePreference(): ThemeMode {
  try {
    return normalizeThemePreference(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "light";
  }
}

export function saveThemePreference(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Switching still works when the browser disallows persistent storage.
  }
}

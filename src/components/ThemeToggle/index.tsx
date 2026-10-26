import { FiMoon, FiSun } from "react-icons/fi";
import { useThemeMode } from "../../hooks/useThemeMode";
import { SwitchCircle, ThemeSwitch } from "../NavBar/styles";

export function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode();
  return (
    <ThemeSwitch
      type="button"
      role="switch"
      aria-checked={mode === "dark"}
      aria-label="Tema escuro"
      title={mode === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
      onClick={toggleTheme}
    >
      <SwitchCircle $themeMode={mode}>
        {mode === "dark" ? (
          <FiMoon aria-hidden="true" />
        ) : (
          <FiSun aria-hidden="true" />
        )}
      </SwitchCircle>
    </ThemeSwitch>
  );
}

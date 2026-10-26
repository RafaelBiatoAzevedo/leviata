import { css } from "styled-components";

// These variables exist only in dark mode. Every use keeps the original light
// color as its CSS fallback, preserving the finished light appearance.
export const darkThemeTokens = {
  surface: "#191F2A",
  elevated: "#222A38",
  text: "#ECE7DE",
  muted: "#B2BBCA",
  border: "#465164",
  "field-border": "#65758C",
  "field-bg": "#111720",
  "accent-text": "#E0C184",
  highlight: "#302D26",
  active: "#C6A15B",
  "success-bg": "#152D24",
  "success-text": "#9CE9BB",
  "success-border": "#397D55",
  "danger-bg": "#361F25",
  "danger-text": "#FFB0AA",
  "danger-border": "#93534C",
  "warning-text": "#F4CE86",
  "info-text": "#ACD2FF",
  "on-primary": "#111827",
} as const;

export const darkThemeVariables = css`
  :root {
    ${Object.entries(darkThemeTokens)
      .map(([name, value]) => `--theme-${name}: ${value};`)
      .join("\n")}
  }
`;

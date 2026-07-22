import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyle";
import { lightTheme, darkTheme } from "./styles/themes";
import { Router } from "./routes";

function App() {
  const [theme, setTheme] = useState(() => {
    // const savedTheme = localStorage.getItem("portfolio-theme");

    // if (savedTheme) return savedTheme;

    // const prefersDark = window.matchMedia(
    //   "(prefers-color-scheme: dark)",
    // ).matches;
    //return prefersDark ? "dark" : "light";

    return "light";
  });

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <GlobalStyle />

      <Router />
    </ThemeProvider>
  );
}

export default App;

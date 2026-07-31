import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyle";
import { lightTheme, darkTheme } from "./styles/themes";
import { Router } from "./routes/index.routes";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./shared/Toast/ToastProvider";
import { ModalProvider } from "./shared/Modal/ModalProvider";

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
    <AuthProvider>
      <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        <ModalProvider>
          <ToastProvider>
            <GlobalStyle />

            <Router />
          </ToastProvider>
        </ModalProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

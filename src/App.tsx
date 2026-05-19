import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyle";
import { lightTheme, darkTheme } from "./styles/themes";
import { Router } from "./routes";
import { Navbar } from "./components/NavBar";
import { Footer } from "./components/Footer";

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

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    setTheme(newTheme);

    //localStorage.setItem("portfolio-theme", newTheme);
  };

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <GlobalStyle />;
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <main>
        <Router />
      </main>
      <Footer />
    </ThemeProvider>
  );
}

export default App;

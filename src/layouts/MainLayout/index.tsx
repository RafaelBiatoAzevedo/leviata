import { Outlet } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/NavBar";
import { ScrollToTop } from "../../components/ScrollToTop";
import { Portal, PortalGlobalStyle } from "./styles";

export function MainLayout() {
  // const toggleTheme = () => {
  //   const newTheme = theme === "dark" ? "light" : "dark";

  //   setTheme(newTheme);

  //   //localStorage.setItem("portfolio-theme", newTheme);
  // };

  return (
    <Portal>
      <PortalGlobalStyle />
      <ScrollToTop />

      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </Portal>
  );
}

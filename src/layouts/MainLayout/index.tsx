import { Outlet } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/NavBar";
import { ScrollToTop } from "../../components/ScrollToTop";

export function MainLayout() {
  // const toggleTheme = () => {
  //   const newTheme = theme === "dark" ? "light" : "dark";

  //   setTheme(newTheme);

  //   //localStorage.setItem("portfolio-theme", newTheme);
  // };

  return (
    <>
      <ScrollToTop />

      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

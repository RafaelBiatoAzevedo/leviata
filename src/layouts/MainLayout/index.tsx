import { Outlet } from "react-router-dom";
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/NavBar";
import { ScrollToTop } from "../../components/ScrollToTop";
import { Portal, PortalGlobalStyle } from "./styles";
import { ActivitiesProvider } from "../../contexts/ActivitiesContext";

export function MainLayout() {
  return (
    <ActivitiesProvider>
      <Portal>
        <PortalGlobalStyle />
        <ScrollToTop />

        <Navbar />

        <main>
          <Outlet />
        </main>

        <Footer />
      </Portal>
    </ActivitiesProvider>
  );
}

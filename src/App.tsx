import { GlobalStyle } from "./styles/GlobalStyle";
import { Router } from "./routes/index.routes";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./shared/Toast/ToastProvider";
import { ModalProvider } from "./shared/Modal/ModalProvider";
import { AppearanceProvider } from "./contexts/ThemeContext";
import { PortalAnalytics } from "./analytics/PortalAnalytics";

function App() {
  return (
    <AuthProvider>
      <AppearanceProvider>
        <ModalProvider>
          <ToastProvider>
            <GlobalStyle />

            <PortalAnalytics />
            <Router />
          </ToastProvider>
        </ModalProvider>
      </AppearanceProvider>
    </AuthProvider>
  );
}

export default App;

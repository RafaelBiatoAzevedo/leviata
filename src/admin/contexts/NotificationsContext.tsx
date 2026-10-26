import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  notificationsService,
  type NotificationCounts,
} from "../services/notifications";
import { useAuth } from "../hooks/useAuth";

interface NotificationsContextData extends NotificationCounts {
  refresh(): Promise<void>;
  revision: number;
  changed(): void;
}
const NotificationsContext = createContext<NotificationsContextData>({
  unreadCount: 0,
  pendingCount: 0,
  revision: 0,
  refresh: async () => {},
  changed: () => {},
});

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [counts, setCounts] = useState<NotificationCounts>({
    unreadCount: 0,
    pendingCount: 0,
  });
  const [revision, setRevision] = useState(0);
  const controller = useRef<AbortController | null>(null);
  const enabled = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const refresh = useCallback(async () => {
    if (!enabled) return;
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    try {
      const { data } = await notificationsService.counts(request.signal);
      if (!request.signal.aborted) setCounts(data);
    } catch {
      /* Keep the last count when a background request fails. The inbox exposes errors. */
    }
  }, [enabled]);

  useEffect(() => {
    const update = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    update();
    const timer = window.setInterval(update, 30_000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
      controller.current?.abort();
    };
  }, [refresh]);

  const changed = useCallback(() => {
    setRevision((value) => value + 1);
    void refresh();
  }, [refresh]);
  const value = useMemo(
    () => ({ ...counts, revision, changed, refresh }),
    [counts, revision, changed, refresh],
  );
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

// This hook shares a small provider module with its context, like the existing ToastProvider.
// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  return useContext(NotificationsContext);
}

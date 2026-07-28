import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Toast } from "./Toast";

import type { ShowToastParams, ToastContextData, ToastData } from "./types";

import { ContainerProvider } from "./styles";

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastContext = createContext({} as ToastContextData);

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((oldState) => oldState.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    ({
      title,
      description,
      type = "info",
      duration = 4000,
    }: ShowToastParams) => {
      const id = crypto.randomUUID();

      const toast: ToastData = {
        id,
        title,
        description,
        type,
        duration,
      };

      setToasts((oldState) => [...oldState, toast]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
      clearToasts,
    }),
    [toasts, showToast, removeToast, clearToasts],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <ContainerProvider>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </ContainerProvider>
    </ToastContext.Provider>
  );
}

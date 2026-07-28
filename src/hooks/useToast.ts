import { useContext } from "react";
import { ToastContext } from "../shared/Toast/ToastProvider";

export function useToast() {
  return useContext(ToastContext);
}

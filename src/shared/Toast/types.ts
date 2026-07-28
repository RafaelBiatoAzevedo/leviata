export type TToastType = "info" | "success" | "warning" | "danger";

export interface ToastData {
  id: string;

  title: string;

  description?: string;

  type: TToastType;

  duration?: number;
}

export interface ShowToastParams {
  title: string;

  description?: string;

  type?: TToastType;

  duration?: number;
}

export interface ToastContextData {
  toasts: ToastData[];

  showToast(data: ShowToastParams): void;

  removeToast(id: string): void;

  clearToasts(): void;
}

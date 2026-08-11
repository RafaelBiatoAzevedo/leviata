export type ModalVariant = "primary" | "success" | "danger";

export interface ModalOptions {
  title: string;

  content: React.ReactNode;

  confirmText?: string;

  cancelText?: string;

  confirmVariant?: ModalVariant;

  hideFooter?: boolean;

  closeOnBackdrop?: boolean;

  confirmDisabled?: boolean;

  onConfirm?: () => void | Promise<void>;

  onCancel?: () => void;
}

export interface ModalContextData {
  showModal(options: ModalOptions): void;

  closeModal(): void;

  updateModal(updates: Partial<ModalOptions>): void;
}

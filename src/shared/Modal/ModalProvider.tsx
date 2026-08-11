import { createContext, useCallback, useMemo, useState } from "react";
import type { ModalContextData, ModalOptions } from "./types";
import { Modal } from "./Modal";

export const ModalContext = createContext({} as ModalContextData);

interface Props {
  children: React.ReactNode;
}

export function ModalProvider({ children }: Props) {
  const [modal, setModal] = useState<ModalOptions | null>(null);

  const closeModal = useCallback(() => {
    if (modal?.onCancel) {
      modal.onCancel();
    }

    setModal(null);
  }, [modal]);

  const showModal = useCallback((options: ModalOptions) => {
    setModal({
      confirmText: "Confirmar",
      cancelText: "Cancelar",
      confirmVariant: "primary",
      closeOnBackdrop: true,
      hideFooter: false,
      ...options,
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    if (modal?.onConfirm) {
      await modal.onConfirm();
    }

    setModal(null);
  }, [modal]);

  const updateModal = useCallback((updates: Partial<ModalOptions>) => {
    setModal((current) => {
      if (!current) return current;

      return {
        ...current,
        ...updates,
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      showModal,
      closeModal,
      updateModal,
    }),
    [showModal, closeModal, updateModal],
  );

  return (
    <ModalContext.Provider value={value}>
      {children}

      {modal && (
        <Modal
          title={modal.title}
          confirmText={modal.confirmText!}
          cancelText={modal.cancelText!}
          confirmVariant={modal.confirmVariant!}
          hideFooter={modal.hideFooter!}
          closeOnBackdrop={modal.closeOnBackdrop!}
          onClose={closeModal}
          onCancel={closeModal}
          onConfirm={handleConfirm}
          confirmDisabled={modal.confirmDisabled}
        >
          {modal.content}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

import { FiX } from "react-icons/fi";

import {
  Backdrop,
  Container,
  Header,
  Title,
  CloseButton,
  Content,
  Footer,
  CancelButton,
  ConfirmButton,
} from "./styles";
import type { ReactNode } from "react";

interface ModalProps {
  title: string;

  confirmText: string;

  cancelText: string;

  confirmVariant: "primary" | "success" | "danger";

  hideFooter: boolean;

  closeOnBackdrop: boolean;

  confirmDisabled?: boolean;

  onClose(): void;

  onCancel(): void;

  onConfirm(): void | Promise<void>;

  children: ReactNode;
}

export function Modal({
  title,
  confirmText,
  cancelText,
  confirmVariant,
  hideFooter,
  closeOnBackdrop,
  confirmDisabled = false,
  onClose,
  onCancel,
  onConfirm,
  children,
}: ModalProps) {
  return (
    <Backdrop
      onClick={() => {
        if (closeOnBackdrop) {
          onClose();
        }
      }}
    >
      <Container onClick={(event) => event.stopPropagation()}>
        <Header>
          <Title>{title}</Title>

          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </Header>

        <Content>{children}</Content>

        {!hideFooter && (
          <Footer>
            <CancelButton onClick={onCancel}>{cancelText}</CancelButton>

            <ConfirmButton
              variant={confirmVariant}
              onClick={onConfirm}
              disabled={confirmDisabled}
            >
              {confirmText}
            </ConfirmButton>
          </Footer>
        )}
      </Container>
    </Backdrop>
  );
}

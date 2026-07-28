import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";

import type { ToastData } from "./types";

import {
  CloseButton,
  Container,
  Content,
  Description,
  IconContainer,
  Title,
} from "./styles";

interface ToastProps {
  toast: ToastData;

  onClose(id: string): void;
}

export function Toast({ toast, onClose }: ToastProps) {
  function renderIcon() {
    switch (toast.type) {
      case "success":
        return <FiCheckCircle />;

      case "warning":
        return <FiAlertTriangle />;

      case "danger":
        return <FiAlertCircle />;

      default:
        return <FiInfo />;
    }
  }

  return (
    <Container $type={toast.type}>
      <IconContainer $type={toast.type}>{renderIcon()}</IconContainer>

      <Content>
        <Title>{toast.title}</Title>

        {toast.description && <Description>{toast.description}</Description>}
      </Content>

      <CloseButton onClick={() => onClose(toast.id)}>
        <FiX />
      </CloseButton>
    </Container>
  );
}

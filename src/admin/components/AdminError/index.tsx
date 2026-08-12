import { FiAlertCircle } from "react-icons/fi";

import { Container } from "./styles";

interface AdminErrorProps {
  children?: React.ReactNode;
}

export function AdminError({ children }: AdminErrorProps) {
  if (!children) return null;

  return (
    <Container role="alert">
      <FiAlertCircle size={15} />

      <span>{children}</span>
    </Container>
  );
}

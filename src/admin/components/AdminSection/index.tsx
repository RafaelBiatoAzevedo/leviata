import type { ReactNode } from "react";

import { Container, Header, Title, Content } from "./styles";

interface AdminSectionProps {
  title: string;

  children: ReactNode;

  action?: ReactNode;
}

export function AdminSection({ title, children, action }: AdminSectionProps) {
  return (
    <Container>
      <Header>
        <Title>{title}</Title>

        {action}
      </Header>

      <Content>{children}</Content>
    </Container>
  );
}

import type { ReactNode } from "react";

import { Container, Left, Right, Title, Subtitle } from "./styles";

interface IAdminPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function AdminPageHeader({
  title,
  subtitle,
  children,
}: IAdminPageHeaderProps) {
  return (
    <Container>
      <Left>
        <Title>{title}</Title>

        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </Left>

      <Right>{children}</Right>
    </Container>
  );
}

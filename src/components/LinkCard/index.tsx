import { CardDescription, CardTitle, Container, IconWrapper } from "./styles";
import type { JSX } from "react";

interface ILinkCardProps {
  to: string;
  icon: JSX.Element;
  title: string;
  description: string;
}

export function LinkCard({
  to,
  icon: Icon,
  title,
  description,
}: ILinkCardProps) {
  return (
    <Container to={to}>
      <IconWrapper>{Icon}</IconWrapper>

      <CardTitle>{title}</CardTitle>

      <CardDescription>{description}</CardDescription>
    </Container>
  );
}

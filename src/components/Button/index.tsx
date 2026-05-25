import type { FC } from "react";

import { Container, LinkContainer } from "./styles";

export interface IButtonProps {
  title: string;

  type?: "button" | "submit" | "reset";

  to?: string;

  onClick?: () => void;
}

export const Button: FC<IButtonProps> = ({
  title,
  type = "button",
  to,
  onClick,
}) => {
  if (to) {
    return <LinkContainer to={to}>{title}</LinkContainer>;
  }

  return (
    <Container type={type} onClick={onClick}>
      {title}
    </Container>
  );
};

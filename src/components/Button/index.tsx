import type { FC } from "react";
import { Container } from "./styles";

interface IButtonProps {
  title: string;
}

export const Button: FC<IButtonProps> = ({ title }) => {
  return <Container>{title}</Container>;
};

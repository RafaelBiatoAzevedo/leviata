import type { FC } from "react";
import { Container } from "./styles";

export interface IButtonProps {
  title: string;

  type?: "button" | "submit" | "reset";
}

export const Button: FC<IButtonProps> = ({ title }) => {
  return <Container>{title}</Container>;
};

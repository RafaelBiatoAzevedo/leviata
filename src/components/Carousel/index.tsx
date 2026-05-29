import type { JSX } from "react";
import { Container } from "./styles";

interface ICarouselProps {
  children: JSX.Element;
}

export function Carousel({ children }: ICarouselProps) {
  return <Container>{children}</Container>;
}

import { FiArrowUpRight } from "react-icons/fi";
import {
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  IconWrapper,
  ReadMore,
} from "./styles";
import type { JSX } from "react";

interface ILinkCardProps {
  className?: string;
  to: string;
  icon: JSX.Element;
  title: string;
  description: string;
  descriptionIcon?: JSX.Element;
  showReadMore?: boolean;
}

export function LinkCard({
  className,
  to,
  icon: Icon,
  title,
  description,
  descriptionIcon,
  showReadMore = false,
}: ILinkCardProps) {
  return (
    <Container to={to} className={className} $showReadMore={showReadMore}>
      <CardHeader>
        <IconWrapper aria-hidden="true">{Icon}</IconWrapper>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardDescription>
        {descriptionIcon}
        {description}
      </CardDescription>

      {showReadMore && (
        <ReadMore aria-hidden="true">
          Ver mais
          <FiArrowUpRight />
        </ReadMore>
      )}
    </Container>
  );
}

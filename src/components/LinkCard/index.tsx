import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import {
  CardDescription,
  CardHeader,
  CardTitle,
  Container,
  IconWrapper,
  ReadMore,
  ReadMoreArrow,
} from "./styles";
import type { JSX } from "react";

interface ILinkCardProps {
  className?: string;
  to: string;
  icon: JSX.Element;
  title: string;
  description: string;
  descriptionLabel?: string;
  descriptionIcon?: JSX.Element;
  showReadMore?: boolean;
  detailsFooter?: boolean;
}

export function LinkCard({
  className,
  to,
  icon: Icon,
  title,
  description,
  descriptionLabel,
  descriptionIcon,
  showReadMore = false,
  detailsFooter = false,
}: ILinkCardProps) {
  return (
    <Container to={to} className={className} $showReadMore={showReadMore}>
      <CardHeader>
        <IconWrapper aria-hidden="true">{Icon}</IconWrapper>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardDescription>
        {descriptionIcon}
        {descriptionLabel ? (
          <span>
            <small>{descriptionLabel}</small>
            <strong>{description}</strong>
          </span>
        ) : (
          description
        )}
      </CardDescription>

      {showReadMore && (
        <ReadMore aria-hidden="true">
          {detailsFooter ? "Ver detalhes" : "Ver mais"}
          {detailsFooter ? (
            <ReadMoreArrow>
              <FiArrowRight />
            </ReadMoreArrow>
          ) : (
            <FiArrowUpRight />
          )}
        </ReadMore>
      )}
    </Container>
  );
}

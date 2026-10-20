import {
  Acronym,
  Bottom,
  Container,
  Description,
  ReadMore,
  Title,
  Top,
} from "./styles";

interface CardLinkProps {
  to: string;
  acronym: string;
  title?: string;
  description: string;
}

export function ThematicLinkCard({
  to,
  acronym,
  title,
  description,
}: CardLinkProps) {
  return (
    <Container to={to}>
      <Top>
        <Acronym>{acronym}</Acronym>
      </Top>

      <Bottom>
        {!!title && <Title>{title}</Title>}

        <Description>{description}</Description>
      </Bottom>

      <ReadMore aria-hidden="true">Ver mais</ReadMore>
    </Container>
  );
}

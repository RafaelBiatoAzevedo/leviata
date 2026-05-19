import { Acronym, Bottom, Container, Description, Title, Top } from "./styles";

interface CardLinkProps {
  to: string;
  acronym: string;
  title?: string;
  description: string;
}

export function LinkCard({ to, acronym, title, description }: CardLinkProps) {
  return (
    <Container to={to}>
      <Top>
        <Acronym>{acronym}</Acronym>
      </Top>

      <Bottom>
        {!!title && <Title>{title}</Title>}

        <Description>{description}</Description>
      </Bottom>
    </Container>
  );
}

import { FiArchive } from "react-icons/fi";

import { Container, IconWrapper, Content, Title, Period } from "./styles";

interface IDossierCardProps {
  id: number;
  title: string;
  startYear: number;
  endYear: number;
}

export function DossierCard({
  id,
  title,
  startYear,
  endYear,
}: IDossierCardProps) {
  return (
    <Container to={`/instrumentos/planilhas-biblio-tematicas/dossie/${id}`}>
      <IconWrapper>
        <FiArchive />
      </IconWrapper>

      <Content>
        <Title>{title}</Title>

        <Period>{`${startYear} - ${endYear}`}</Period>
      </Content>
    </Container>
  );
}

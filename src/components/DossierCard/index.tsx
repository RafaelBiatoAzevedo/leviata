import { FiArchive, FiArrowRight } from "react-icons/fi";

import {
  Container,
  Header,
  IconWrapper,
  HeaderLabel,
  Reference,
  Content,
  Title,
  Period,
  Footer,
  ReadMore,
  LinkArrow,
} from "./styles";

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
      <Header>
        <IconWrapper aria-hidden="true">
          <FiArchive />
        </IconWrapper>
        <HeaderLabel>Dossiê temático</HeaderLabel>
        <Reference aria-hidden="true">{String(id).padStart(2, "0")}</Reference>
      </Header>

      <Content>
        <Title title={title}>{title}</Title>

        <Period>
          <span>Período</span>
          <strong>{`${startYear} — ${endYear}`}</strong>
        </Period>

        <Footer>
          <ReadMore>Explorar dossiê</ReadMore>
          <LinkArrow aria-hidden="true">
            <FiArrowRight />
          </LinkArrow>
        </Footer>
      </Content>
    </Container>
  );
}

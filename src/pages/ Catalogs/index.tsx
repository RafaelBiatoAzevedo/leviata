import { DocumentViewer } from "../../components/DocumentViewer";
import { SectionHeader } from "../../components/SectionHeader";
import {
  Container,
  Content,
  LinkButton,
  LinkWrapper,
  Paragraph,
  ParagraphDecoration,
  Title,
} from "./styles";

import pdf from "../../assets/PDFs/ferreira_ra_dadosdepesquisa_fran_escritos.pdf";
import { FiExternalLink } from "react-icons/fi";

export function Catalogs() {
  return (
    <Container>
      <Content>
        <SectionHeader title="Catálogos" />
        <Title>
          Escritos sobre o negro e a escravidão africana: um guia de obras
          disponíveis nas bases do banco de dados digital Escritos Sobre os
          Novos Mundos
        </Title>
        <Paragraph>
          O acesso quase ilimitado a obras e documentos digitalizados trouxe aos
          pesquisadores da história do negro e da escravidão africana uma
          vantagem e um problema. Tal afirmação refere-se ao imenso manancial de
          fontes disponíveis, que, não obstante, sem um trabalho inicial de
          agrupamento, levado a cabo a partir de uma questão mais precisa, pode
          ser tornar pouco útil. Dirimir tal problema foi o principal objetivo
          da construção do catálogo “Escritos sobre o negro e a escravidão
          africana: um guia de obras disponíveis nas bases do banco de dados
          digital Escritos Sobre os Novos Mundos”, realizado com recursos FAPESP
          (Processo: nº. 2013/14786-6) e do CNPq (Processo: 470390/2014-0).
        </Paragraph>
        <Paragraph>
          Assim, tanto o pesquisador em início de carreira quanto um conjunto
          mais amplo de interessados poderão, a partir do catálogo produzido com
          o fomento do CNPq, entrar em contato com um significativo número de
          textos de época, alguns não frequentemente estudados pelos
          historiadores da área, sobre a escravidão, sobre o cativo africano e
          sobre o negro produzidos e editados em língua portuguesa ou que
          circularam no mundo luso-brasileiro.
        </Paragraph>
        <LinkWrapper>
          <ParagraphDecoration>
            O catálogo abaixo também pode ser consultado através deste link.
            Para acessar a íntegra das obras de época, visite o projeto:
          </ParagraphDecoration>
          <LinkButton
            href="https://www.grupoescritos.com/apresentacao"
            target="_blank"
          >
            Grupo Escritos <FiExternalLink />
          </LinkButton>
        </LinkWrapper>
        <DocumentViewer
          pdf={pdf}
          externalLink="https://repositorio.unesp.br/entities/publication/83388b8c-a51b-4368-ab87-1b4aafb9f121"
        />
      </Content>
    </Container>
  );
}

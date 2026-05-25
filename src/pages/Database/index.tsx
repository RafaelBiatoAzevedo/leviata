import { DocumentViewer } from "../../components/DocumentViewer";
import { SectionHeader } from "../../components/SectionHeader";
import {
  Container,
  Content,
  Paragraph,
  ParagraphDecoration,
  Title,
} from "./styles";

import pdf from "../../assets/PDFs/azevedo_lb_dadosdepesquisa_fran_autoridades.pdf";

export function Database() {
  return (
    <Container>
      <Content>
        <SectionHeader center title="Banco de Dados" />
        <Title>Autoridades Policiais – São Paulo e Pernambuco, 1828-1888</Title>
        <Paragraph>
          O conjunto de dados de pesquisa abaixo reúne informações biográficas
          sobre as autoridades que exerceram funções policiais nas províncias de
          Pernambuco e São Paulo durante o século XIX.
        </Paragraph>
        <Paragraph>
          O levantamento foi dividido por cargos (Juízes de Paz, Chefes de
          Polícia, Prefeitos de Comarca, Delegados, Subdelegados, Juízes
          Municipais), conforme a ordem de criação desses postos e
          considerando-se o período de atuação de cada autoridade. Ao final,
          constam as referências (fontes de época, estudos e outras) utilizadas
          para compor as breves biografias.
        </Paragraph>
        <Paragraph>
          Este levantamento é parte de uma pesquisa de doutorado financiada pela
          Fundação de Amparo à Pesquisa do Estado de São Paulo – FAPESP
          (Processo nº. 19/03596-8). Atualmente, esse conjunto de biografias vêm
          sendo atualizado e acrescentado com informações de outras autoridades
          policiais do Império. O intuito é incorporar os dados biográficos a
          uma plataforma online e colaborativa sobre a história da polícia no
          Brasil imperial. Para saber mais ou colaborar, entre em contato:
          larissabiato@gmail.com.
        </Paragraph>

        <DocumentViewer
          externalLink="https://repositorio.unesp.br/entities/publication/5e9a6de1-f743-4086-83ba-65694656efb1"
          pdf={pdf}
        />

        <ParagraphDecoration>
          Como citar: AZEVEDO, L. B. Autoridades policiais – Pernambuco e São
          Paulo, 1828-1888. Dados de Pesquisa, 2023.
        </ParagraphDecoration>
      </Content>
    </Container>
  );
}

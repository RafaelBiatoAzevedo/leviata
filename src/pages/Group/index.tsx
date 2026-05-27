import { NewsletterForm } from "../../components/NewsletterForm";
import { ParagraphText } from "../../components/ParagraphText";
import {
  Container,
  Content,
  PresentationLabel,
  PresentationSection,
  PresentationTitle,
  Title,
  VideoWrapper,
} from "./styles";

const text = `Criado em 2019, o grupo de pesquisa “Leviatã e o Cativeiro” reúne
          pesquisadores em torno do binômio temático Estado Moderno e
          escravidão. Ao considerar um largo arco temporal, que vai do século
          XVI ao XIX, nossas pesquisas procuram analisar, com base em diferentes
          corpus documentais, a relação entre as diversas instituições
          luso-brasileiras – Inquisição, família, polícia, Imprensa – e a
          escravidão de africanos e descendentes. Centradas fundamentalmente no
          espaço que conecta Brasil e Portugal, durante o período colonial e o
          período imperial, nossas investigações perpassam indagações e
          respostas aos temas pungentes na sociedade brasileira atual, agregando
          novos tópicos aos debates estabelecidos entre os especialistas e
          abrindo a comunicação com todo o público interessado.`;

export function Group() {
  return (
    <Container>
      <Content>
        <Title>O Grupo</Title>

        <ParagraphText text={text} />

        <PresentationSection>
          <PresentationLabel>
            Testemunho e reflexão sobre os caminhos de pesquisa, memória e
            construção intelectual do grupo.
          </PresentationLabel>

          <PresentationTitle>
            Palavras do Prof. Dr. Ricardo Alexandre Ferreira
          </PresentationTitle>

          <VideoWrapper>
            <iframe
              src="https://www.youtube.com/embed/UqRGZf3lhIQ"
              title="Prof. Dr. Ricardo Alexandre Ferreira"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoWrapper>
        </PresentationSection>

        <NewsletterForm type="middle" />
      </Content>
    </Container>
  );
}

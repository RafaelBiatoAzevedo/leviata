import { HistoryDivider } from "../../components/HistotyDivider";
import { NewsletterForm } from "../../components/NewsletterForm";
import { ParagraphText } from "../../components/ParagraphText";
import { SectionHeader } from "../../components/SectionHeader";
import { PublicDataState } from "../../components/PublicDataState";
import {
  VideoCarousel,
  VideoPresentation,
} from "../../components/VideoPresentation";
import { usePublicList } from "../../hooks/usePublicData";
import type { VideoResponseDto } from "../../admin/dtos/videos/VideoResponseDto";
import { Container, Content } from "./styles";

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
  const {
    data: videos,
    loading,
    error,
  } = usePublicList<VideoResponseDto>("videos");
  const featured = videos.find(
    (video) =>
      video.title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/\s+/g, " ")
        .toLocaleLowerCase("pt-BR") === "grupo leviata e o cativeiro",
  );
  const otherVideos = videos.filter((video) => video.id !== featured?.id);
  return (
    <Container>
      <Content>
        <SectionHeader center title="O Grupo" />

        <ParagraphText text={text} />

        <PublicDataState
          loading={loading}
          error={error}
          empty={!videos.length}
          label="os vídeos do grupo"
        />
        {featured && <VideoPresentation video={featured} />}

        {featured && otherVideos.length > 0 && <HistoryDivider />}

        <VideoCarousel videos={otherVideos} label="Outros vídeos do grupo" />

        <NewsletterForm type="middle" />
      </Content>
    </Container>
  );
}

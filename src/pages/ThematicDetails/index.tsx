import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  ContainerLoading,
  Content,
  PresentationLabel,
  PresentationSection,
  PresentationTitle,
  Title,
  VideoWrapper,
} from "./styles";
import { Loading } from "../../components/Loading";

interface IThematicData {
  title: string;
  author: string;
  youtubeEmbedLink: string;
  AssociatedResearchers: [];
}

export function ThematicDetails() {
  const { id } = useParams();
  const [thematicData, setThematicData] = useState<null | IThematicData>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      //call api future

      setTimeout(() => {
        setThematicData({
          title: "Cativeiro, saúde e alimentação: séculos XVII e XVIII",
          author: "Ana Carolina de Carvalho Viotti",
          youtubeEmbedLink: "https://www.youtube.com/embed/_n9U48W5evI",
          AssociatedResearchers: [],
        });
        setLoading(false);
      }, 6000);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!id) return;

    load();
  }, [id]);

  if (loading) {
    return (
      <ContainerLoading>
        <p>Carregando Temática ....</p>
        <Loading />
      </ContainerLoading>
    );
  }

  if (!thematicData) {
    return (
      <ContainerLoading>
        <p>Não foi possível carregar a Temática.</p>
      </ContainerLoading>
    );
  }

  return (
    <Container>
      <Content>
        <Title>{`${thematicData.title}`}</Title>
        <PresentationSection>
          <PresentationLabel>
            Confira os enfoques desta linha no vídeo da pesquisadora.
          </PresentationLabel>

          <PresentationTitle>{thematicData.author}</PresentationTitle>

          <VideoWrapper>
            <iframe
              src={thematicData.youtubeEmbedLink}
              title={thematicData.author}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoWrapper>
        </PresentationSection>
      </Content>
    </Container>
  );
}

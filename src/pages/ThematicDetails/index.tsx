import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AssociatedPresentationLabel,
  AssociatedPresentationSection,
  AssociatedPresentationTitle,
  AssociatedWrapper,
  Container,
  ContainerLoading,
  Content,
  PresentationLabel,
  PresentationSection,
  PresentationTitle,
  VideoWrapper,
} from "./styles";
import { Loading } from "../../components/Loading";
import { SectionHeader } from "../../components/SectionHeader";
import { HistoryDivider } from "../../components/HistotyDivider";

interface IThematicData {
  title: string;
  author: string;
  youtubeEmbedLink: string;
  associatedResearchers: IThematicData[];
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
          associatedResearchers: [
            {
              title: "Cativeiro, saúde e alimentação: séculos XVII e XVIII",
              author: "Ana Carolina de Carvalho Viotti",
              youtubeEmbedLink: "https://www.youtube.com/embed/_n9U48W5evI",
              associatedResearchers: [],
            },
            {
              title: "Cativeiro, saúde e alimentação: séculos XVII e XVIII",
              author: "Ana Carolina de Carvalho Viotti",
              youtubeEmbedLink: "https://www.youtube.com/embed/_n9U48W5evI",
              associatedResearchers: [],
            },
            {
              title: "Cativeiro, saúde e alimentação: séculos XVII e XVIII",
              author: "Ana Carolina de Carvalho Viotti",
              youtubeEmbedLink: "https://www.youtube.com/embed/_n9U48W5evI",
              associatedResearchers: [],
            },
            {
              title: "Cativeiro, saúde e alimentação: séculos XVII e XVIII",
              author: "Ana Carolina de Carvalho Viotti",
              youtubeEmbedLink: "https://www.youtube.com/embed/_n9U48W5evI",
              associatedResearchers: [],
            },
            {
              title: "Cativeiro, saúde e alimentação: séculos XVII e XVIII",
              author: "Ana Carolina de Carvalho Viotti",
              youtubeEmbedLink: "https://www.youtube.com/embed/_n9U48W5evI",
              associatedResearchers: [],
            },
          ],
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
        <Loading />
        <p>Carregando Temática ....</p>
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
        <SectionHeader center title={`${thematicData.title}`} />
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

        <HistoryDivider />

        {!!thematicData.associatedResearchers.length && (
          <AssociatedWrapper>
            <SectionHeader
              small
              title="Pesquisas vinculadas"
              subtitle="Acompanhe as pesquisas vinculadas a temática"
            />
            {thematicData.associatedResearchers.map((associated) => (
              <AssociatedPresentationSection>
                <AssociatedPresentationLabel>
                  Confira os enfoques desta linha no vídeo da pesquisadora.
                </AssociatedPresentationLabel>

                <AssociatedPresentationTitle>
                  {associated.author}
                </AssociatedPresentationTitle>

                <VideoWrapper>
                  <iframe
                    src={associated.youtubeEmbedLink}
                    title={associated.author}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </VideoWrapper>
              </AssociatedPresentationSection>
            ))}
          </AssociatedWrapper>
        )}
      </Content>
    </Container>
  );
}

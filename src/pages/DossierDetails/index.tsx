import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DocumentViewer } from "../../components/DocumentViewer";
import {
  Container,
  ContainerLoading,
  Content,
  Subtitle,
  Title,
} from "./styles";
import { Loading } from "../../components/Loading";
import pdf from "../../assets/PDFs/ferreira_ra_dadosdepesquisa_fran_escritos.pdf";
import { ParagraphText } from "../../components/ParagraphText";

interface IDossierData {
  title: string;
  startYear: number;
  endYear: number;
  pdf: string;
  link: string;
  text: string;
}

export function DossierDetails() {
  const { id } = useParams();
  const [dossierData, setDossierData] = useState<null | IDossierData>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      //call api future

      setTimeout(() => {
        setDossierData({
          title: "Dossiês Crime",
          startYear: 1998,
          endYear: 2023,
          pdf: pdf,
          link: "",
          text: "Reunimos no documento a seguir os dossiês de história do crime e da criminalidade publicados em revistas nacionais e estrangeiras de 1998 a 2023.\nEstabelecemos como critério para este levantamento os dossiês publicados em revistas de história qualificadas nos estratos A1, A2, A3, A4 e B1 da última avaliação do Qualis Periódicos (2017-2020) da CAPES. Foram utilizadas as ferramentas de busca dos sistemas das revistas.",
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
        <p>Carregando Dossiê ....</p>
      </ContainerLoading>
    );
  }

  if (!dossierData) {
    return (
      <ContainerLoading>
        <p>Não foi possível carregar o dossiê.</p>
      </ContainerLoading>
    );
  }

  return (
    <Container>
      <Content>
        <div>
          <Title>{`${dossierData.title}`}</Title>
          <Subtitle>{`${dossierData?.startYear} - ${dossierData.endYear}`}</Subtitle>
        </div>
        <ParagraphText text={dossierData.text} />

        <DocumentViewer externalLink={dossierData.link} pdf={dossierData.pdf} />
      </Content>
    </Container>
  );
}

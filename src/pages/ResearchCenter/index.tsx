import { usePublicList } from "../../hooks/usePublicData";
import type { SearchResponseDto } from "../../admin/dtos/research/SearchResponseDto";
import { ImageGallery } from "../../components/ImageGallery";
import { Loading } from "../../components/Loading";
import { HistoryDivider } from "../../components/HistotyDivider";
import { ParagraphText } from "../../components/ParagraphText";
import { SectionHeader } from "../../components/SectionHeader";
import { Container, Content, Text, InfoWrapper, Label } from "./styles";

const text = `O projeto “Em costas negras: núcleo de pesquisa em história e cultura africana e afro-brasileira da UNESP” pretende 
reunir esforços com outras iniciativas em curso para que a região nordeste do Estado de São Paulo, um espaço equivocadamente
 tido como de pequena presença da população de origem africana, dada à imensa recepção de imigrantes europeus, nomeadamente 
 italianos, entre fins do século XIX e meados do século XX, seja dotada de um centro de pesquisa destinado a promover o estudo 
 da história e cultura africana e afro-brasileira.\n
O ponto de partida para a criação do núcleo foi a doação, pela família de um dos mais importantes historiadores brasileiros das 
últimas décadas, o professor Manolo Garcia Florentino (1958-2021), à UNESP, por meio do grupo de pesquisa Escritos sobre os novos 
mundos, da integralidade de sua biblioteca e de arquivos, contendo documentos de interesse para a pesquisa da história da diáspora 
africana e da escravidão africana praticada nas Américas, entre os séculos XVI e XIX.\n
O principal objetivo é a organização do acervo, que hoje se encontra instalado no interior do prédio da biblioteca do Câmpus de Franca, 
da UNESP, mas ainda em caixas de transporte. Neste primeiro momento, pretende-se, por meio do trabalho de discentes do curso de graduação 
e de pós-graduação em História, contratados para a execução de serviços eventuais, sob orientação dos pesquisadores que integram este 
projeto e dos profissionais da biblioteca da universidade, bem como do CEDAPH, realizar todo o trabalho de higienização, catalogação 
e acondicionamento de mais de 2.000 volumes. Em um segundo momento, os pesquisadores do grupo Leviatã e o Cativeiro produzirão um catálogo 
temático do acervo com o objetivo de otimizar a utilização das obras e documentos pelos estudiosos, além de contemplarem as coleções do 
centro em seus próprios projetos de pesquisa.`;

const searchers = [
  "Prof. Dr. Ricardo Alexandre Ferreira (UNESP/Franca) – Coordenador",
  "Prof. Dra Ana Carolina de Carvalho Viotti (UNESP/Marília)",
  "Prof. Dra. Adriana Pereira Campos (UFES)",
  "Prof. Dra. Larissa Biato de Azevedo (UNESP/Franca)",
];

const students = ["Mariana de Oliveira Lima", "Rafaela Cia Vieira"];

export function ResearchCenter() {
  const { data, loading, error } = usePublicList<SearchResponseDto>("research");
  const research = data.filter((record) =>
    `${record.title} ${record.slug}`
      .toLowerCase()
      .replace(/-/g, " ")
      .includes("costas negras"),
  );
  const images = research.flatMap((record) => record.images ?? []);
  const supports = research.flatMap((record) => record.supports ?? []);
  return (
    <Container>
      <Content>
        <SectionHeader center title="Núcleo de pesquisa “Em costas negras" />

        <ParagraphText text={text} />

        <HistoryDivider />

        <InfoWrapper>
          <Label>Pesquisadores</Label>
          {searchers.map((s) => (
            <Text key={s}>{s}</Text>
          ))}
        </InfoWrapper>

        <InfoWrapper>
          <Label>Discentes</Label>
          {students.map((s) => (
            <Text key={s}>{s}</Text>
          ))}
        </InfoWrapper>

        <InfoWrapper>
          {supports.length > 0 && (
            <>
              <Label>Apoiadores</Label>
              <ImageGallery images={supports} />
            </>
          )}
        </InfoWrapper>

        {loading && <Loading />}
        {error && <p>Não foi possível carregar as fotos da pesquisa.</p>}
        {images.length > 0 && (
          <>
            <Label>Fotos</Label>
            <ImageGallery images={images} />
          </>
        )}
      </Content>
    </Container>
  );
}

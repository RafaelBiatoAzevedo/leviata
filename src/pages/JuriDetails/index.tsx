import { useParams } from "react-router-dom";
import {
  Container,
  ContainerLoading,
  Content,
  MainImage,
  Subtitle,
  TestimoniesGrid,
  Title,
} from "./styles";
import { useEffect, useState } from "react";
import { Loading } from "../../components/Loading";
import { ParagraphText } from "../../components/ParagraphText";
import { HistoryDivider } from "../../components/HistotyDivider";
import { Carousel } from "../../components/Carousel";
import { SectionHeader } from "../../components/SectionHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { ImageCard } from "../../components/ImageCard";

import mainImage from "../../assets/images/jurisList/IIJuri/Main-II-Juri-2024.webp";
import image1 from "../../assets/images/jurisList/IIJuri/image1.webp";
import image2 from "../../assets/images/jurisList/IIJuri/image2.webp";
import image3 from "../../assets/images/jurisList/IIJuri/image3.webp";
import image4 from "../../assets/images/jurisList/IIJuri/image4.webp";
import image5 from "../../assets/images/jurisList/IIJuri/image5.webp";
import { TestimonyCard } from "../../components/TestimonyCard";

interface ITestimony {
  image?: string;
  name: string;
  subtitle?: string;
  text: string;
}

interface IImages {
  imageUrl: string;
  description: string;
}

interface IJuriData {
  title: string;
  date: string;
  mainImage: string;
  text: string;
  images?: IImages[];
  testimonies?: ITestimony[];
}

export function JuriDetails() {
  const { id } = useParams();
  const [juriData, setJuriData] = useState<null | IJuriData>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      //call api future

      setTimeout(() => {
        setJuriData({
          title: "II Júri Histórico",
          date: "2024",
          mainImage: mainImage,
          images: [
            {
              imageUrl: image1,
              description: "II Júri Histórico\n Unesp/Franca",
            },
            {
              imageUrl: image2,
              description: "II Júri Histórico\n Unesp/Franca",
            },
            {
              imageUrl: image3,
              description: "II Júri Histórico\n Unesp/Franca",
            },
            {
              imageUrl: image4,
              description: "II Júri Histórico\n Unesp/Franca",
            },
            {
              imageUrl: image5,
              description: "II Júri Histórico\n Unesp/Franca",
            },
          ],
          text: `No dia 23 de outubro ocorreu na UNESP/campus de Franca a 2ª edição dos Júris Históricos, projeto conduzido pelos professores doutores Paulo Cesar Corrêa Borges, do departamento de Direito, Ricardo Alexandre Ferreira, do departamento de História e pela professora doutora Larissa Biato de Azevedo, do Programa de Pós-Doutoramento da UNESP, em parceria com o Arquivo Histórico Municipal de Franca “Capitão Hipólito Antônio Pinheiro”.\n
          O julgamento da edição de 2024 foi preparado a partir de um processo criminal instaurado em 1878 na então Comarca da Franca do Imperador para a apuração do homicídio cometido por Damião contra sua mulher Adriana e sua filha Águida. O réu e sua esposa faziam parte da escravaria de José Esteves de Andrade, que também era tutor da filha do casal, uma ingênua de apenas 4 meses quando do crime. À época, a escravidão de africanos e descendentes vigorava na cidade de Franca, como de resto no Brasil, e havia dispositivos no Código Criminal do Império (1830) destinados especificamente aos escravos.\n
          A preparação da atividade envolveu diretamente os discentes dos cursos de Direito (3º ano) e de História (2º ano), que puderam conhecer o processo-crime original, participar de uma aula preparatória, estudar o caso e compor o Conselho de Jurados. A sessão do Júri Histórico contou com a audiência estimada de 200 pessoas, entre discentes de outros cursos da unidade, alunos da pós-graduação e o público externo à universidade.\n
           A próxima edição dos Júris Históricos, que passa a contar ativamente com historiadores e arquivistas do Arquivo Histórico Municipal “Capitão Hipólito Antônio Pinheiro e assessoria técnica/acadêmica da UNESP, já está em preparação e deve, novamente, conciliar o debate de temas candentes no país, como o racismo, a condição da mulher e os dilemas da justiça num diálogo permanente entre o presente e o passado, a universidade e a sociedade brasileira. \n
           `,
          testimonies: [
            {
              image: "",
              name: "Bianca Lopes de Sousa",
              subtitle: "Advogada do curso de Direito",
              text: "A proposta primeiro me gerou certo estranhamento, principalmente ao ligar o ocorrido a uma legislação recente, como o caso do feminicídio. Entretanto, após breve reconsideração pude perceber que a atividade é muito interessante por levar em conta a reflexão das relevantes raízes patriarcais históricas, e, neste caso, de maneira mais abrangente, entender que o direito provém de demandas da sociedade. E, sumariamente, por mais anacrônica que atividade possa parecer, o que acontece no passado reflete diretamente na sociedade que somos hoje.",
            },
            {
              image: "",
              name: "Pedro Pucci Focaccia",
              subtitle: "Juiz do curso de Direito",
              text: "Foi com grata satisfação que tive a oportunidade de participar da 2ª Edição dos Júris Históricos, uma colaboração entre as disciplinas de História Moderna e Direito Penal da Faculdade de Ciências Humanas e Sociais da UNESP. Sob os ditames do Código Penal e do Código de Processo Penal, vigentes à época do Império, o caso em tela contou com o julgamento de Damião, escravo de José de Esteves de Andrade, acusado do crime de homicídio perpetrado contra sua esposa e filha. Posto isso, cumpre salientar quão cara foi esta experiência para o aprendizado, não somente daqueles que atuaram na sessão, mas também dos ouvintes. Senão vejamos. A uma, de imediato ressalvo as lições obtidas com a minha própria atuação como Magistrado que permitiram uma maior compreensão dos diferentes elementos que circundam este cargo: a supra imparcialidade, o equilíbrio entre a firmeza e a cordialidade e, principalmente, a tomada decisória, inclusive diante de situações extraordinárias. A duas, há de se mencionar a importância do entendimento de nossos institutos jurídicos e como estes se aperfeiçoaram ao decorrer dos anos. Nesse limiar, fomos colocados em uma “nova” dinâmica, marcada pelas leis do Brasil Império, de modo que, por meio disto, pudemos formular teses, enredos e decisões pautadas neste momento histórico. Nesse sentido, veja-se que a atividade suscitou naqueles que nela figuraram, seja como Magistrado, Promotor, Curador ou juiz de fato, a adaptabilidade a um contexto inusual, no qual o estudo do caso obrigou per si a remontagem da jurisdição outrora empregada no enredo brasileiro. Neste viés, as diferenças quanto à contemporaneidade são notórias em toda a sessão do Tribunal: desde a formulação do actum trium personarum às penas cruéis cabíveis. A exemplo do acima exposto, não poderia deixar de invocar o juramento legal feito pelos juízes de fato: juro pronunciar bem e sinceramente nesta causa; haver-me com franqueza e verdade, só tendo diante dos meus olhos Deus e a Lei: e proferir o meu voto segundo a minha consciência. Por fim, tenho plena ciência de que esta experiência representou para os envolvidos uma rica prática, angariando simultaneamente noções jurídicas e históricas que construíram as bases do procedimento especial do Tribunal do Júri.",
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
        <p>Carregando Júri ....</p>
      </ContainerLoading>
    );
  }

  if (!juriData) {
    return (
      <ContainerLoading>
        <p>Não foi possível carregar o júri.</p>
      </ContainerLoading>
    );
  }

  return (
    <Container>
      <Content>
        <div>
          <Title>{`${juriData.title}`}</Title>
          <Subtitle>{`${juriData.date}`}</Subtitle>
        </div>
        <MainImage src={juriData.mainImage}></MainImage>
        <ParagraphText text={juriData.text} />
        <HistoryDivider />

        <SectionHeader
          title="Como foi participar do Júri Histórico?"
          subtitle="Veja o que alguns dos estudantes que participaram do Júri Histórico têm a dizer sobre essa experiência de aprendizado, pesquisa e debate."
        />
        {juriData.testimonies?.length && (
          <TestimoniesGrid>
            {juriData.testimonies.map((testimony) => (
              <TestimonyCard {...testimony} />
            ))}
          </TestimoniesGrid>
        )}

        <HistoryDivider />

        <SectionHeader title="Fotos do evento" />

        <Carousel>
          <Swiper
            modules={[Pagination, Navigation]}
            slidesPerView={"auto"}
            spaceBetween={50}
            loop
            navigation
            pagination={{
              clickable: true,
            }}
            style={{ alignItems: "stretch" }}
          >
            {(juriData?.images || []).map((imageMock, index) => (
              <SwiperSlide
                key={index}
                style={{
                  width: "400px",
                  height: "auto",
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                <ImageCard {...imageMock} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Carousel>
      </Content>
    </Container>
  );
}

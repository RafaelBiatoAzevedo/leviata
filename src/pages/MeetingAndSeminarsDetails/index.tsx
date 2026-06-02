import { useParams } from "react-router-dom";
import {
  Container,
  ContainerLoading,
  Content,
  MainImage,
  Subtitle,
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

import mainImage from "../../assets/images/MeetingList/IMeeting/mainImage.webp";
import image1 from "../../assets/images/jurisList/IIJuri/image1.webp";
import image2 from "../../assets/images/jurisList/IIJuri/image2.webp";
import image3 from "../../assets/images/jurisList/IIJuri/image3.webp";
import image4 from "../../assets/images/jurisList/IIJuri/image4.webp";
import image5 from "../../assets/images/jurisList/IIJuri/image5.webp";

interface IImage {
  imageUrl: string;
  description: string;
}

interface ILink {
  title: string;
  link: string;
}

interface IMeetingData {
  title: string;
  date: string;
  mainImage: string;
  text: string;
  images?: IImage[];
  links?: ILink[];
}

export function MeetingsAndSeminarsDetails() {
  const { id } = useParams();
  const [meetingData, setMeetingData] = useState<null | IMeetingData>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      //call api future

      setTimeout(() => {
        setMeetingData({
          title: "I Encontro Internacional",
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
          text: `O I Encontro Internacional do Grupo de Pesquisa foi realizado entre os dias 12 e 14 de março de 2024 em formato híbrido, online e nas dependências da Universidade Estadual Paulista “Júlio de Mesquita Filho” – UNESP/Câmpus de Franca.\n
          O objetivo do evento foi colocar em debate, a partir de conferências, mesas redondas, simpósios temáticos e minicursos, estudos que abordassem diferentes aspectos das relações entre o cativeiro de africanos e descendentes e as instituições provenientes da Monarquia portuguesa e dos Estados luso e brasileiro entre os séculos XVII e XIX.\n
           `,
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
        <p>Carregando Encontro ....</p>
      </ContainerLoading>
    );
  }

  if (!meetingData) {
    return (
      <ContainerLoading>
        <p>Não foi possível carregar o encontro.</p>
      </ContainerLoading>
    );
  }

  return (
    <Container>
      <Content>
        <div>
          <Title>{`${meetingData.title}`}</Title>
          <Subtitle>{`${meetingData.date}`}</Subtitle>
        </div>
        <MainImage src={meetingData.mainImage}></MainImage>
        <ParagraphText text={meetingData.text} />

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
            {(meetingData?.images || []).map((imageMock, index) => (
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

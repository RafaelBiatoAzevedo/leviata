import { SectionHeader } from "../../components/SectionHeader";
import { Carousel, Container, Content } from "./styles";

import groupLeviata from "../../assets/images/grupoLeviataEncontro.webp";
import projectJuris from "../../assets/images/ProjetoJuris.webp";
import simposio from "../../assets/images/Simposio.webp";
import meetLeviata from "../../assets/images/leviataEncrontro.webp";
import { NewsCard } from "../../components/NewsCard";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const newsMocks = [
  {
    image: groupLeviata,
    to: "https://leviataeocativeiro.com.br/2026/05/15/ii-encontro-internacional-do-grupo-leviata-e-o-cativeiro/",
    date: "15 de maio de 2026",
    title: "II Encontro Internacional do Grupo Leviatã e o Cativeiro",
    description:
      "Aconteceu, entre os dias 5 e 7 de maio de 2026, o II Encontro do Grupo de Pesquisa Leviatã e…",
  },
  {
    image: projectJuris,
    to: "https://leviataeocativeiro.com.br/2026/05/08/projeto-juris-historicos-recebe-certificacao-ods/",
    date: "8 de maio de 2026",
    title: "Projeto “Júris Históricos” recebe certificação ODS",
    description:
      "O Projeto de extensão universitária “Júris Históricos” recebeu o Selo ODS Educação pelas ações realizadas no ano de…",
  },
  {
    image: simposio,
    to: "https://leviataeocativeiro.com.br/2026/04/20/iii-simposio-do-lhpl-ufes/",
    date: "20 de abril de 2026",
    title: "III Simpósio do LHPL – UFES",
    description:
      "Entre os dias 14 e 15 de abril de 2026, Ricardo Alexandre Ferreira e Larissa Biato de Azevedo participaram…",
  },
  {
    image: meetLeviata,
    to: "https://leviataeocativeiro.com.br/2026/04/06/ii-encontro-internacional-do-grupo-de-pesquisa-leviata-e-o-cativeiro/",
    date: "8 de maio de 2026",
    title:
      "II Encontro Internacional do Grupo de Pesquisa Leviatã e o Cativeiro",
    description:
      "Encontram-se abertas as inscrições para o II Encontro Internacional do Grupo de Pesquisa Leviatã e o Cativeiro – Mobilidades, Experiências…",
  },
  {
    image: groupLeviata,
    to: "https://leviataeocativeiro.com.br/2026/05/15/ii-encontro-internacional-do-grupo-leviata-e-o-cativeiro/",
    date: "15 de maio de 2026",
    title: "II Encontro Internacional do Grupo Leviatã e o Cativeiro",
    description:
      "Aconteceu, entre os dias 5 e 7 de maio de 2026, o II Encontro do Grupo de Pesquisa Leviatã e…",
  },
  {
    image: projectJuris,
    to: "https://leviataeocativeiro.com.br/2026/05/08/projeto-juris-historicos-recebe-certificacao-ods/",
    date: "8 de maio de 2026",
    title: "Projeto “Júris Históricos” recebe certificação ODS",
    description:
      "O Projeto de extensão universitária “Júris Históricos” recebeu o Selo ODS Educação pelas ações realizadas no ano de…",
  },
  {
    image: simposio,
    to: "https://leviataeocativeiro.com.br/2026/04/20/iii-simposio-do-lhpl-ufes/",
    date: "20 de abril de 2026",
    title: "III Simpósio do LHPL – UFES",
    description:
      "Entre os dias 14 e 15 de abril de 2026, Ricardo Alexandre Ferreira e Larissa Biato de Azevedo participaram…",
  },
  {
    image: meetLeviata,
    to: "https://leviataeocativeiro.com.br/2026/04/06/ii-encontro-internacional-do-grupo-de-pesquisa-leviata-e-o-cativeiro/",
    date: "8 de maio de 2026",
    title:
      "II Encontro Internacional do Grupo de Pesquisa Leviatã e o Cativeiro",
    description:
      "Encontram-se abertas as inscrições para o II Encontro Internacional do Grupo de Pesquisa Leviatã e o Cativeiro – Mobilidades, Experiências…",
  },
];

export function News() {
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Notícias"
          subtitle="As notícias reúnem atualizações sobre as atividades, pesquisas, eventos e produções do grupo “Leviatã e o Cativeiro”, que desde 2019 investiga o Estado Moderno e a escravidão entre os séculos XVI e XIX, com foco nas instituições luso-brasileiras e suas relações com a experiência da escravização de africanos e seus descendentes."
        />
        <Carousel>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            slidesPerView={"auto"}
            spaceBetween={50}
            loop
            navigation
            speed={700}
            pagination={{
              clickable: true,
            }}
            // autoplay={{
            //   delay: 3000,
            //   disableOnInteraction: false,
            // }}
            style={{ alignItems: "stretch" }}
          >
            {newsMocks.map((newMock, index) => (
              <SwiperSlide
                key={index}
                style={{
                  width: "350px",
                  height: "auto",
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                <NewsCard {...newMock} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Carousel>
      </Content>
    </Container>
  );
}

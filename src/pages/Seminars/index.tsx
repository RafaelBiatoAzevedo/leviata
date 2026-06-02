import { SectionHeader } from "../../components/SectionHeader";

import {
  Container,
  Content,
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  EventTitle,
  EventDate,
  EventLink,
} from "./styles";

const seminars = [
  {
    title: "I Seminário Aberto do Grupo Leviatã e o Cativeiro",
    date: "13 de maio de 2025",
    link: "#",
  },
];

export function Seminars() {
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Seminários"
          subtitle="Nossos seminários ocorrem regularmente durante o ano letivo e alguns deles são abertos ao público externo. Acompanhe nossas notícias e redes sociais para participar."
        />

        <Timeline>
          {seminars.map((seminar, index) => (
            <TimelineItem key={index}>
              <TimelineDot />

              <TimelineContent>
                <EventDate>{seminar.date}</EventDate>

                <EventTitle>{seminar.title}</EventTitle>

                <EventLink href={seminar.link} target="_blank">
                  Saiba mais
                </EventLink>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>

        {/* <SocialLinks /> */}

        {/* <HistoryDivider /> */}
        {/* 
        <Intro>
          Os seminários promovem encontros de discussão acadêmica, circulação de
          pesquisas e debates relacionados aos estudos sobre Estado Moderno,
          escravidão e instituições luso-brasileiras.
        </Intro> */}
      </Content>
    </Container>
  );
}

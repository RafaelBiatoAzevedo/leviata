import { HistoryDivider } from "../../components/HistotyDivider";
import { SectionHeader } from "../../components/SectionHeader";

import {
  Container,
  Content,
  SectionTitle,
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  EventTitle,
  EventDate,
  EventDescription,
  YearBlock,
  YearTitle,
} from "./styles";

const upcomingEvents = [
  {
    title:
      "III Simpósio Internacional do Laboratório de História, Poder e Linguagens",
    subtitle:
      "“Senhoras de si: as lutas de mulheres pela liberdade no século XIX”",
    location: "UFES, Vitória",
    date: "14 e 15 de abril de 2026",
  },

  {
    title:
      "II Encontro Internacional do Grupo de Pesquisa Leviatã e o Cativeiro",
    subtitle:
      "“Mobilidades, Experiências e Normas no Atlântico (séculos XVII a XIX)”",
    location: "Híbrido (UNESP/Franca e online)",
    date: "05 a 07 de maio de 2026",
  },
];

const previousEvents = [
  {
    year: "2025",
    events: [
      {
        title: "I Seminário Aberto do Grupo Leviatã e o Cativeiro",
        date: "13 de maio",
      },

      {
        title: "I Mostra de Documentários do Grupo Leviatã e o Cativeiro",
        date: "14 e 15 de maio",
      },

      {
        title: "Simpósio Temático no 33º Simpósio Nacional da ANPUH",
        date: "13 a 18 de julho",
      },

      {
        title: "III Júri Histórico",
        date: "05 de novembro",
      },
    ],
  },

  {
    year: "2024",
    events: [
      {
        title:
          "I Encontro Internacional do Grupo Leviatã e o Cativeiro – Escravidão, Direito e Instituições Luso-brasileiras",
        date: "12 a 14 de março",
      },

      {
        title: "II Júri Histórico",
        date: "26 de outubro",
      },
    ],
  },
];

export function Schedule() {
  return (
    <Container>
      <Content>
        <SectionHeader
          title="Agenda"
          subtitle="Próximos eventos, encontros e atividades acadêmicas promovidas pelo grupo Leviatã e o Cativeiro."
        />

        <SectionTitle>Próximos Eventos</SectionTitle>

        <Timeline>
          {upcomingEvents.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineDot />

              <TimelineContent>
                <EventTitle>{event.title}</EventTitle>

                <EventDescription>{event.subtitle}</EventDescription>

                <EventDate>
                  {event.location} — {event.date}
                </EventDate>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>

        <HistoryDivider />

        <SectionTitle>Eventos Anteriores</SectionTitle>

        {previousEvents.map((year, index) => (
          <YearBlock key={index}>
            <YearTitle>{year.year}</YearTitle>

            <Timeline>
              {year.events.map((event, i) => (
                <TimelineItem key={i}>
                  <TimelineDot />

                  <TimelineContent>
                    <EventTitle>{event.title}</EventTitle>

                    <EventDate>{event.date}</EventDate>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </YearBlock>
        ))}
      </Content>
    </Container>
  );
}

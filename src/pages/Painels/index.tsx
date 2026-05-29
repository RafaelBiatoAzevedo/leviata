import { SectionHeader } from "../../components/SectionHeader";

export interface IPanels {
  id: string;
  tipo: "mestrado" | "defesa";
  data: string;
  titulo: string;
  candidata: string;
  banca: string[];
  link?: string;
}

export const painelsMock: IPanels[] = [
  {
    id: "1",
    tipo: "mestrado",
    data: "08/12/2025 às 14h",
    titulo:
      "Entre o abolicionismo britânico e o escravismo brasileiro: conexões entre a ‘British and Foreign Anti-Slavery Society’ e a imprensa fluminense em meados do século XIX",
    candidata: "Sofia Zambelli Menck",
    banca: [
      "Prof. Dr. Ricardo Alexandre Ferreira (Orientador – UNESP/Franca)",
      "Profa. Dra. Adriana Pereira Campos (UFES)",
      "Profa. Dra. Lúcia Helena Oliveira Silva (UNESP/Assis)",
    ],
    link: "http://meet.google.com/krw-mees-euk",
  },
  {
    id: "2",
    tipo: "mestrado",
    data: "11/12/2025 às 08h",
    titulo:
      "Olhares estrangeiros: a escravidão no Brasil presente nos relatos de viajantes ingleses (1740-1793)",
    candidata: "Maria Fernanda Minutti Teixeira",
    banca: [
      "Prof. Dr. Ricardo Alexandre Ferreira (UNESP/Franca) - Orientador",
      "Profa. Dra. Ana Paula Ribeiro F. M. Avelar (UAB/Portugal)",
      "Profa. Dra. Ana Carolina de Carvalho Viotti (UNESP/Marília)",
    ],
    link: "http://meet.google.com/kex-ryjo-hgy",
  },
];

import { FiExternalLink } from "react-icons/fi";
import {
  ActionLink,
  Actions,
  Container,
  Content,
  DateText,
  Label,
  Section,
  Text,
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  Title,
  TypeBadge,
} from "./styles";

export default function Painels() {
  return (
    <Container>
      <Content>
        {/* <SectionHeader center title="Bancas" /> */}
        <SectionHeader
          title="Exames de Qualificação"
          subtitle="  Acompanhe as bancas de qualificação e defesas vinculadas às
            pesquisas desenvolvidas pelo grupo."
        />

        <Timeline>
          {painelsMock.map((item) => (
            <TimelineItem key={item.id}>
              <TimelineDot $type={item.tipo} />

              <TimelineContent>
                <TypeBadge $type={item.tipo}>
                  {item.tipo === "mestrado"
                    ? "Qualificação de Mestrado"
                    : "Defesa"}
                </TypeBadge>

                <DateText>{item.data}</DateText>

                <Title>{item.titulo}</Title>

                <Section>
                  <Label>Candidata</Label>

                  <Text>{item.candidata}</Text>
                </Section>

                <Section>
                  <Label>Banca</Label>
                  {item.banca.map((b) => (
                    <Text>{b}</Text>
                  ))}
                </Section>

                {item.link && (
                  <Actions>
                    <ActionLink
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Acessar reunião
                      <FiExternalLink />
                    </ActionLink>
                  </Actions>
                )}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Content>
    </Container>
  );
}

import { usePublicList } from "../../hooks/usePublicData";
import type { BoardResponseDto } from "../../admin/dtos/boards/BoardResponseDto";
import { ImageGallery } from "../../components/ImageGallery";
import { Loading } from "../../components/Loading";
import { SectionHeader } from "../../components/SectionHeader";

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
  const {
    data: boards,
    loading,
    error,
  } = usePublicList<BoardResponseDto>("boards");
  return (
    <Container>
      <Content>
        {/* <SectionHeader center title="Bancas" /> */}
        <SectionHeader
          title="Exames de Qualificação"
          subtitle="  Acompanhe as bancas de qualificação e defesas vinculadas às
            pesquisas desenvolvidas pelo grupo."
        />

        {loading && <Loading />}
        {error && <p>Não foi possível carregar as bancas.</p>}
        {!loading && !error && boards.length === 0 && (
          <p>Nenhuma banca disponível.</p>
        )}
        <Timeline>
          {boards.map((item) => (
            <TimelineItem key={item.id}>
              <TimelineDot $type="mestrado" />

              <TimelineContent>
                <TypeBadge $type="mestrado">Banca</TypeBadge>

                <DateText>
                  {new Date(item.date).toLocaleString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                  })}
                </DateText>

                <Title>{item.title}</Title>

                <Section>
                  <Label>Candidato</Label>

                  <Text>{item.candidate.name}</Text>
                </Section>

                <Section>
                  <Label>Banca</Label>
                  {[item.advisor, ...item.members].map((person) => (
                    <Text key={person.id}>{person.name}</Text>
                  ))}
                </Section>

                {item.meetingUrl && (
                  <Actions>
                    <ActionLink
                      href={item.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Acessar reunião
                      <FiExternalLink />
                    </ActionLink>
                  </Actions>
                )}
                <ImageGallery images={item.images} />
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Content>
    </Container>
  );
}

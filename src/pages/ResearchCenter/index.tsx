import { usePublicList } from "../../hooks/usePublicData";
import type { SearchResponseDto } from "../../admin/dtos/research/SearchResponseDto";
import { ImageGallery } from "../../components/ImageGallery";
import { Comments } from "../../components/Comments";
import { ParagraphText } from "../../components/ParagraphText";
import { SectionHeader } from "../../components/SectionHeader";
import { PublicDataState } from "../../components/PublicDataState";
import { PublicPeople } from "../../components/PublicPeople";
import { PersonCategory } from "../../admin/types/TPersonCategory";
import { Container, Content } from "./styles";

export function ResearchCenter() {
  const { data, loading, error } = usePublicList<SearchResponseDto>(
    "research",
    { search: "costas" },
  );
  const research = data.filter((record) =>
    `${record.title} ${record.slug}`
      .toLowerCase()
      .replace(/-/g, " ")
      .includes("costas negras"),
  );
  const people = [
    ...new Map(
      research
        .flatMap((record) => record.people ?? [])
        .map((person) => [person.id, person]),
    ).values(),
  ];
  const images = [
    ...new Map(
      research
        .flatMap((record) => record.images ?? [])
        .map((image) => [image.id, image]),
    ).values(),
  ];
  const supports = [
    ...new Map(
      research
        .flatMap((record) => record.supports ?? [])
        .map((image) => [image.id, image]),
    ).values(),
  ];
  return (
    <Container>
      <Content>
        <SectionHeader
          center
          title={research[0]?.title || "Núcleo de pesquisa “Em costas negras”"}
        />
        <PublicDataState
          loading={loading}
          error={error}
          empty={!research.length}
          label="o núcleo de pesquisa"
        />
        {research.map(
          (record) =>
            record.content?.trim() && (
              <ParagraphText key={record.id} text={record.content} />
            ),
        )}
        <PublicPeople
          people={people.filter(
            (person) =>
              person.category !== PersonCategory.DISCENTE &&
              person.category !== PersonCategory.EXTERNO,
          )}
          title="Pesquisadores"
          showAcademicAbbreviation={false}
        />
        <PublicPeople
          people={people.filter(
            (person) => person.category === PersonCategory.DISCENTE,
          )}
          title="Discentes"
          showAcademicAbbreviation={false}
        />
        <PublicPeople
          people={people.filter(
            (person) => person.category === PersonCategory.EXTERNO,
          )}
          title="Participantes externos"
          showAcademicAbbreviation={false}
        />
        {supports.length > 0 && (
          <>
            <SectionHeader as="h2" small title="Apoiadores" />
            <ImageGallery images={supports} />
          </>
        )}
        {images.length > 0 && (
          <>
            <SectionHeader as="h2" small title="Fotos" />
            <ImageGallery images={images} />
          </>
        )}
        {!loading &&
          !error &&
          research.map((record) => (
            <Comments
              key={record.id}
              targetType="RESEARCH"
              targetId={record.id}
            />
          ))}
      </Content>
    </Container>
  );
}

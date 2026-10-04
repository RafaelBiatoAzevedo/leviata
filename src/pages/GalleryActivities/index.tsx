import { FiImage } from "react-icons/fi";
import { LinkCard } from "../../components/LinkCard";
import { SectionHeader } from "../../components/SectionHeader";
import { Loading } from "../../components/Loading";
import { usePublicList } from "../../hooks/usePublicData";
import type { GalleryResource } from "../../admin/services/gallery";
import { Container, Content, Grid } from "../Activities/styles";

interface Activity {
  id: string;
  slug: string;
  title: string;
  date?: string;
}

export function GalleryActivities({
  resource,
  title,
  path,
}: {
  resource: GalleryResource;
  title: string;
  path: string;
}) {
  const { data, loading, error } = usePublicList<Activity>(resource);
  return (
    <Container>
      <Content>
        <SectionHeader title={title} />
        {loading && <Loading />}
        {error && <p>Não foi possível carregar os registros.</p>}
        {!loading && !error && data.length === 0 && (
          <p>Nenhum registro disponível.</p>
        )}
        <Grid>
          {data.map((record) => (
            <LinkCard
              key={record.id}
              to={`${path}/${record.slug}`}
              icon={<FiImage />}
              title={record.title}
              description={
                record.date
                  ? new Date(record.date).toLocaleDateString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                    })
                  : ""
              }
            />
          ))}
        </Grid>
      </Content>
    </Container>
  );
}

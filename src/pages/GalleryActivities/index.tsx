import { FiImage } from "react-icons/fi";
import { TbFolderSearch } from "react-icons/tb";
import { SectionHeader } from "../../components/SectionHeader";
import { Loading } from "../../components/Loading";
import { usePublicList } from "../../hooks/usePublicData";
import type { GalleryResource } from "../../admin/services/gallery";
import { ActivityCard, Container, Content, Grid } from "../Activities/styles";

interface Activity {
  id: string;
  slug: string;
  title: string;
  date?: string;
  content?: string | null;
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
            <ActivityCard
              key={record.id}
              to={`${path}/${record.slug}`}
              icon={resource === "research" ? <TbFolderSearch /> : <FiImage />}
              title={record.title}
              description={
                record.content?.trim() ||
                (record.date
                  ? new Date(record.date).toLocaleDateString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                    })
                  : "")
              }
            />
          ))}
        </Grid>
      </Content>
    </Container>
  );
}

import { PublicDataState } from "../../components/PublicDataState";
import { SectionHeader } from "../../components/SectionHeader";
import { useActivities } from "../../contexts/activities-context";
import { ActivityCard, Container, Content, Grid } from "./styles";

export function Activities() {
  const { activities, loading, error } = useActivities();

  return (
    <Container>
      <Content>
        <SectionHeader
          title="Atividades"
          subtitle="Confira pelo menu nossas atividades e projetos regulares, desenvolvidos no âmbito das pesquisas e ações acadêmicas do grupo."
        />

        <PublicDataState
          loading={loading}
          error={error}
          empty={!activities.length}
          label="as atividades"
        />
        <Grid>
          {activities.map(({ path, Icon, label, description }) => (
            <ActivityCard
              key={path}
              to={path}
              icon={<Icon />}
              title={label}
              description={description}
            />
          ))}
        </Grid>
      </Content>
    </Container>
  );
}

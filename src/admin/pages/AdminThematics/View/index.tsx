import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import { Container, Header, HeaderActions, Title } from "./styles";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { thematicsService } from "../../../services/thematics";
import { useToast } from "../../../../hooks/useToast";
import type { ThematicResponseDto } from "../../../dtos/thematics/ThematicResponseDto";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminLoading } from "../../../components/AdminLoading";

export function ThematicView() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { slug } = useParams();

  const [thematic, setThematic] = useState<ThematicResponseDto | null>(null);

  const loadThematic = useCallback(async () => {
    try {
      const response = await thematicsService.getBySlug(slug!);
      setThematic(response.data);
    } catch (error) {
      showToast({
        title: "Ops! Não foi possível carregar a temática",
        description: `Ocorreu um erro ao buscar os dados. Tente novamente. \n ${error}`,
        type: "danger",
      });
    }
  }, [showToast, slug]);

  useEffect(() => {
    if (!thematic) {
      (async () => {
        await loadThematic();
      })();
    }
  }, [thematic, loadThematic]);

  if (!thematic) {
    return <AdminLoading text="Carregando temática..." />;
  }

  return (
    <Container>
      <Header>
        <HeaderActions>
          <AdminButton variant="outline" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Voltar
          </AdminButton>

          <AdminButton
            onClick={() => navigate(`/admin/tematicas/${slug}/editar`)}
          >
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>Temática</Title>
      </Header>

      <AdminFormCard>
        <AdminSection title="Dados Gerais">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Título" value={thematic.title} />

            <AdminDescriptionItem label="Slug" value={thematic.slug} />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>

      {/* <AdminFormCard>
        <AdminSection title="Participantes principais">
          <AdminDescriptionList>
            <AdminDescriptionItem
              label="Candidato"
              value={`${thematic.candidate.academicTitle.abbreviation} ${thematic.candidate.name} - ${thematic.candidate.institution.acronym}`}
            />

            <AdminDescriptionItem
              label="Orientador"
              value={`${thematic.advisor.academicTitle.abbreviation} ${thematic.advisor.name} - ${thematic.advisor.institution.acronym}`}
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard> */}

      {/* <AdminFormCard>
        <AdminSection
          title={`${thematic.members.length > 1 ? "Membros" : "Membro"}`}
        >
          {thematic.members.map((member, index) => (
            <AdminDescriptionItem
              key={index}
              value={`${member.academicTitle!.abbreviation} ${member.name} - ${member.institution!.acronym}`}
            />
          ))}
        </AdminSection>
      </AdminFormCard> */}

      <AdminFormCard>
        <AdminSection title="Fotos">
          <></>
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}

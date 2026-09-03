import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import {
  JuryTitle,
  Container,
  ContentWrapper,
  Cover,
  CoverWrapper,
  Header,
  HeaderActions,
  Subtitle,
  Title,
} from "./styles";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { juriesService } from "../../../services/juries";
import { useToast } from "../../../../hooks/useToast";
import type { JuryResponseDto } from "../../../dtos/juries/JuryResponseDto";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminLoading } from "../../../components/AdminLoading";
import { formatDate } from "../../../utils/formatDate";

export function JuryView() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { slug } = useParams();

  const [jury, setJury] = useState<JuryResponseDto | null>(null);

  const loadJury = useCallback(async () => {
    try {
      const response = await juriesService.getBySlug(slug!);
      setJury(response.data);
    } catch (error) {
      showToast({
        title: "Ops! Não foi possível carregar o júri",
        description: `Ocorreu um erro ao buscar os dados. Tente novamente. \n ${error}`,
        type: "danger",
      });
    }
  }, [showToast, slug]);

  useEffect(() => {
    if (!jury) {
      (async () => {
        await loadJury();
      })();
    }
  }, [jury, loadJury]);

  if (!jury) {
    return <AdminLoading text="Carregando júri..." />;
  }

  return (
    <Container>
      <Header>
        <HeaderActions>
          <AdminButton variant="outline" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Voltar
          </AdminButton>

          <AdminButton onClick={() => navigate(`/admin/juris/${slug}/editar`)}>
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>Júri</Title>
      </Header>

      <ContentWrapper>
        <CoverWrapper to={jury.recordingUrl!} target={"_blank"}>
          <Cover src={jury.coverUrl!} />

          <JuryTitle>{jury.title}</JuryTitle>

          <Subtitle>{formatDate(jury.date)}</Subtitle>
        </CoverWrapper>

        <AdminFormCard>
          <AdminSection title="Dados Gerais">
            <AdminDescriptionList>
              <AdminDescriptionItem label="Título" value={jury.title} />

              <AdminDescriptionItem label="Slug" value={jury.slug} />

              <AdminDescriptionItem
                label="Data"
                value={formatDate(jury.date)}
              />
            </AdminDescriptionList>
            <AdminDescriptionItem label="Local" value={jury.location} />
          </AdminSection>
        </AdminFormCard>
      </ContentWrapper>

      <AdminFormCard>
        <AdminSection title="Descrição">
          <AdminDescriptionItem label="Descrição" value={jury.description} />
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection title="Links">
          <AdminDescriptionItem
            label="Link da inscrição"
            value={jury.registrationUrl}
          />

          <AdminDescriptionItem
            label="Link da transmissão"
            value={jury.meetingUrl}
          />

          <AdminDescriptionItem
            label="Link da gravação"
            value={jury.recordingUrl}
          />

          <AdminDescriptionItem
            label="Link do documento"
            value={jury.documentUrl}
          />
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection title={`${jury.judges.length > 1 ? "Juízes" : "Juiz"}`}>
          {jury.judges.map((judge, index) => (
            <AdminDescriptionItem
              key={index}
              value={`${judge.academicTitle!.abbreviation} ${judge.name} - ${judge.institution!.acronym}`}
            />
          ))}
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection
          title={`${jury.jurors.length > 1 ? "Jurados" : "Jurado"}`}
        >
          {jury.jurors.map((juror, index) => (
            <AdminDescriptionItem
              key={index}
              value={`${juror.academicTitle!.abbreviation} ${juror.name} - ${juror.institution!.acronym}`}
            />
          ))}
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection
          title={`${jury.prosecutors.length > 1 ? "Promotores" : "Promotor"}`}
        >
          {jury.prosecutors.map((prosecutor, index) => (
            <AdminDescriptionItem
              key={index}
              value={`${prosecutor.academicTitle!.abbreviation} ${prosecutor.name} - ${prosecutor.institution!.acronym}`}
            />
          ))}
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection
          title={`${jury.defenders.length > 1 ? "Defensores" : "Defensor"}`}
        >
          {jury.defenders.map((defender, index) => (
            <AdminDescriptionItem
              key={index}
              value={`${defender.academicTitle!.abbreviation} ${defender.name} - ${defender.institution!.acronym}`}
            />
          ))}
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection
          title={`${jury.bailiffs.length > 1 ? "Oficiais de justiça" : "Ofical de justiça"}`}
        >
          {jury.bailiffs.map((bailiff, index) => (
            <AdminDescriptionItem
              key={index}
              value={`${bailiff.academicTitle!.abbreviation} ${bailiff.name} - ${bailiff.institution!.acronym}`}
            />
          ))}
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}

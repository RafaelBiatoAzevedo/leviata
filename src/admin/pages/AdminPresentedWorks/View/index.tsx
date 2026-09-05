import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import { Container, Header, HeaderActions, Title } from "./styles";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import type { PresentedWorkResponseDto } from "../../../dtos/presentedWorks/PresentedWorkResponseDto";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminLoading } from "../../../components/AdminLoading";
import { formatDate } from "../../../utils/formatDate";
import { presentedWorksService } from "../../../services/presentedWorks";

export function PresentedWorkView() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { slug } = useParams();

  const [presentedWork, setPresentedWork] =
    useState<PresentedWorkResponseDto | null>(null);

  const loadPresentedWork = useCallback(async () => {
    try {
      const response = await presentedWorksService.getBySlug(slug!);
      setPresentedWork(response.data);
    } catch (error) {
      showToast({
        title: "Ops! Não foi possível carregar a apresentação",
        description: `Ocorreu um erro ao buscar os dados. Tente novamente. \n ${error}`,
        type: "danger",
      });
    }
  }, [showToast, slug]);

  useEffect(() => {
    if (!presentedWork) {
      (async () => {
        await loadPresentedWork();
      })();
    }
  }, [presentedWork, loadPresentedWork]);

  if (!presentedWork) {
    return <AdminLoading text="Carregando apresentação..." />;
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
            onClick={() =>
              navigate(`/admin/apresentacoes-trabalhos/${slug}/editar`)
            }
          >
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>Apresentações de Trabalhos</Title>
      </Header>

      <AdminFormCard>
        <AdminSection title="Dados Gerais">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Título" value={presentedWork.title} />

            <AdminDescriptionItem label="Slug" value={presentedWork.slug} />

            <AdminDescriptionItem
              label="Data"
              value={formatDate(presentedWork.date)}
            />

            <AdminDescriptionItem
              label="Link da banca"
              value={presentedWork.meetingUrl}
            />
          </AdminDescriptionList>

          <AdminDescriptionItem label="Local" value={presentedWork.location} />
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection title="Links">
          <AdminDescriptionItem
            label="Link da inscrição"
            value={presentedWork.registrationUrl}
          />

          <AdminDescriptionItem
            label="Link da transmissão"
            value={presentedWork.meetingUrl}
          />

          <AdminDescriptionItem
            label="Link da gravação"
            value={presentedWork.recordingUrl}
          />

          <AdminDescriptionItem
            label="Link do documento"
            value={presentedWork.documentUrl}
          />
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection
          title={`${presentedWork.authors.length > 1 ? "Autores" : "Autor"}`}
        >
          {presentedWork.authors.map((author, index) => (
            <AdminDescriptionItem
              key={index}
              value={`${author.academicTitle!.abbreviation} ${author.name} - ${author.institution!.acronym}`}
            />
          ))}
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection title="Fotos">
          <></>
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}

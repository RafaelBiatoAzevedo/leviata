import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { AdminButton } from "../../../components/AdminButton";
import { Container, Header, HeaderActions, Title } from "./styles";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { boardsService } from "../../../services/boards";
import { useToast } from "../../../../hooks/useToast";
import type { BoardResponseDto } from "../../../dtos/boards/BoardResponseDto";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminLoading } from "../../../components/AdminLoading";
import { formatDate } from "../../../utils/formatDate";

export function BoardView() {
  const navigate = useNavigate();

  const { showToast } = useToast();

  const { slug } = useParams();

  const [board, setBoard] = useState<BoardResponseDto | null>(null);

  const loadBoard = useCallback(async () => {
    try {
      const response = await boardsService.getBySlug(slug!);
      setBoard(response.data);
    } catch (error) {
      showToast({
        title: "Ops! Não foi possível carregar a banca",
        description: `Ocorreu um erro ao buscar os dados. Tente novamente. \n ${error}`,
        type: "danger",
      });
    }
  }, [showToast, slug]);

  useEffect(() => {
    if (!board) {
      (async () => {
        await loadBoard();
      })();
    }
  }, [board, loadBoard]);

  if (!board) {
    return <AdminLoading text="Carregando banca..." />;
  }

  return (
    <Container>
      <Header>
        <HeaderActions>
          <AdminButton variant="outline" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Voltar
          </AdminButton>

          <AdminButton onClick={() => navigate(`/admin/bancas/${slug}/editar`)}>
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>

        <Title>Banca</Title>
      </Header>

      <AdminFormCard>
        <AdminSection title="Dados Gerais">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Título" value={board.title} />

            <AdminDescriptionItem label="Slug" value={board.slug} />

            <AdminDescriptionItem label="Data" value={formatDate(board.date)} />

            <AdminDescriptionItem
              label="Link da banca"
              value={board.meetingUrl}
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection title="Participantes principais">
          <AdminDescriptionList>
            <AdminDescriptionItem
              label="Candidato"
              value={`${board.candidate.academicTitle.abbreviation} ${board.candidate.name} - ${board.candidate.institution.acronym}`}
            />

            <AdminDescriptionItem
              label="Orientador"
              value={`${board.advisor.academicTitle.abbreviation} ${board.advisor.name} - ${board.advisor.institution.acronym}`}
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>

      <AdminFormCard>
        <AdminSection
          title={`${board.members.length > 1 ? "Membros" : "Membro"}`}
        >
          {board.members.map((member, index) => (
            <AdminDescriptionItem
              key={index}
              value={`${member.academicTitle!.abbreviation} ${member.name} - ${member.institution!.acronym}`}
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

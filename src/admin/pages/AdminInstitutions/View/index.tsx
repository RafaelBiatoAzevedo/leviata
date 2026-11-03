import { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { institutionService } from "../../../services/institution";
import type { InstitutionResponseDto } from "../../../dtos/InstitutionResponseDto";
import { institutionErrorMessage } from "../../../utils/institution";
import { formatDateTime } from "../../../utils/dateTime";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminButton } from "../../../components/AdminButton";
import { AdminLoading } from "../../../components/AdminLoading";
import { AdminError } from "../../../components/AdminError";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { Container, HeaderActions } from "../styles";

export function InstitutionView() {
  const { id } = useParams();
  return <InstitutionDetails key={id} id={id!} />;
}

function InstitutionDetails({ id }: { id: string }) {
  const navigate = useNavigate();
  const [item, setItem] = useState<InstitutionResponseDto | null>(null);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    institutionService
      .getById(id, controller.signal)
      .then(({ data }) => {
        if (!controller.signal.aborted) setItem(data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted)
          setError(institutionErrorMessage(error));
      });
    return () => controller.abort();
  }, [id, revision]);

  if (error)
    return (
      <Container>
        <AdminError>{error}</AdminError>
        <AdminButton
          onClick={() => {
            setError("");
            setRevision((value) => value + 1);
          }}
        >
          Tentar novamente
        </AdminButton>
        <AdminButton
          variant="outline"
          onClick={() => navigate("/admin/instituicoes")}
        >
          Voltar
        </AdminButton>
      </Container>
    );
  if (!item) return <AdminLoading text="Carregando instituição..." />;

  return (
    <Container>
      <HeaderActions>
        <AdminButton
          variant="outline"
          onClick={() => navigate("/admin/instituicoes")}
        >
          <FiArrowLeft /> Voltar
        </AdminButton>
        <AdminButton
          onClick={() => navigate(`/admin/instituicoes/${id}/editar`)}
        >
          <FiEdit2 /> Editar
        </AdminButton>
      </HeaderActions>
      <AdminPageHeader
        title={item.name}
        subtitle="Informações da instituição."
      />
      <AdminFormCard>
        <AdminSection title="Dados da instituição">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Nome" value={item.name} />
            <AdminDescriptionItem label="Sigla" value={item.acronym} />
            <AdminDescriptionItem
              label="País"
              value={item.country?.name ?? "Não informado"}
            />
            <AdminDescriptionItem
              label="Criado em"
              value={formatDateTime(item.createdAt)}
            />
            <AdminDescriptionItem
              label="Atualizado em"
              value={formatDateTime(item.updatedAt)}
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}

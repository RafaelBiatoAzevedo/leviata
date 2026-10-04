import { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { AdminButton } from "../../../components/AdminButton";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminError } from "../../../components/AdminError";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminLoading } from "../../../components/AdminLoading";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminSection } from "../../../components/AdminSection";
import type { ScheduleResponseDto } from "../../../dtos/schedule/ScheduleResponseDto";
import { scheduleService } from "../../../services/schedule";
import {
  formatScheduleDate,
  scheduleErrorMessage,
} from "../../../utils/schedule";
import { Container, Description, HeaderActions } from "./styles";

export function ScheduleView() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [item, setItem] = useState<ScheduleResponseDto | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    scheduleService
      .getBySlug(slug!)
      .then(({ data }) => {
        if (!cancelled) {
          setItem(data);
          setError("");
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) setError(scheduleErrorMessage(error));
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error)
    return (
      <Container>
        <AdminError>{error}</AdminError>
        <AdminButton
          variant="outline"
          onClick={() => navigate("/admin/agenda")}
        >
          Voltar à agenda
        </AdminButton>
      </Container>
    );
  if (!item) return <AdminLoading text="Carregando evento..." />;

  return (
    <Container>
      <HeaderActions>
        <AdminButton
          variant="outline"
          onClick={() => navigate("/admin/agenda")}
        >
          <FiArrowLeft />
          Voltar
        </AdminButton>
        <AdminButton
          onClick={() => navigate(`/admin/agenda/${item.slug}/editar`)}
        >
          <FiEdit2 />
          Editar
        </AdminButton>
      </HeaderActions>
      <AdminPageHeader
        title={item.title}
        subtitle={item.subtitle ?? "Evento da agenda"}
      />
      <AdminFormCard>
        <AdminSection title="Dados gerais">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Slug" value={item.slug} />
            <AdminDescriptionItem
              label="Data inicial"
              value={formatScheduleDate(item.date)}
            />
            <AdminDescriptionItem
              label="Data final"
              value={formatScheduleDate(item.endDate)}
            />
            <AdminDescriptionItem label="Local" value={item.location} />
            <AdminDescriptionItem
              label="Link do evento"
              value={
                item.externalUrl && (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.externalUrl}
                  </a>
                )
              }
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>
      <AdminFormCard>
        <AdminSection title="Descrição">
          <Description>
            {item.description || "Nenhuma descrição informada."}
          </Description>
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}

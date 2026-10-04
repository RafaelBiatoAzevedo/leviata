import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { AdminButton } from "../../../components/AdminButton";
import { AdminError } from "../../../components/AdminError";
import AdminFormActions from "../../../components/AdminFormActions";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminInput } from "../../../components/AdminInput";
import { AdminLoading } from "../../../components/AdminLoading";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminSection } from "../../../components/AdminSection";
import { AdminTextarea } from "../../../components/AdminTextarea";
import {
  mapScheduleToCreateDto,
  mapScheduleToForm,
} from "../../../mappers/schedule.mapper";
import { scheduleService } from "../../../services/schedule";
import { scheduleErrorMessage } from "../../../utils/schedule";
import {
  scheduleSchema,
  type ScheduleFormData,
} from "../../../validations/schedule.schema";
import { scheduleDefaultValues } from "./defaultValues";
import { Container, Form } from "./styles";

export function ScheduleForm() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { showToast } = useToast();
  const isEdit = Boolean(slug);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: scheduleDefaultValues,
  });

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    scheduleService
      .getBySlug(slug)
      .then(({ data }) => {
        if (!cancelled) reset(mapScheduleToForm(data));
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(scheduleErrorMessage(error));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reset, slug]);

  async function onSubmit(data: ScheduleFormData) {
    try {
      const dto = mapScheduleToCreateDto(data);
      if (slug) await scheduleService.updateBySlug(slug, dto);
      else await scheduleService.create(dto);
      showToast({
        title: isEdit ? "Evento atualizado" : "Evento cadastrado",
        description: "Os dados da agenda foram salvos com sucesso.",
        type: "success",
      });
      navigate("/admin/agenda");
    } catch (error) {
      showToast({
        title: "Erro ao salvar evento",
        description: scheduleErrorMessage(error),
        type: "danger",
      });
    }
  }

  if (loading) return <AdminLoading text="Carregando evento..." />;
  if (loadError)
    return (
      <Container>
        <AdminError>{loadError}</AdminError>
        <AdminButton
          variant="outline"
          onClick={() => navigate("/admin/agenda")}
        >
          Voltar à agenda
        </AdminButton>
      </Container>
    );

  return (
    <Container>
      <AdminPageHeader
        title={isEdit ? "Editar evento" : "Novo evento"}
        subtitle="Cadastre ou atualize os eventos da agenda."
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <AdminFormCard>
          <AdminSection title="Dados gerais">
            <AdminFormGrid>
              <AdminInput
                label="Título"
                placeholder="Título do evento"
                required
                error={errors.title?.message}
                {...register("title")}
              />
              <AdminInput
                label="Slug (gerado automaticamente)"
                value={slug ?? ""}
                disabled
              />
              <AdminInput
                label="Subtítulo"
                placeholder="Tema do evento"
                error={errors.subtitle?.message}
                {...register("subtitle")}
              />
              <AdminInput
                label="Local"
                placeholder="Instituição, cidade ou evento online"
                error={errors.location?.message}
                {...register("location")}
              />
              <AdminInput
                label="Link do evento"
                placeholder="https://..."
                error={errors.externalUrl?.message}
                {...register("externalUrl")}
              />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>
        <AdminFormCard>
          <AdminSection title="Período do evento">
            <AdminFormGrid>
              <AdminInput
                type="datetime-local"
                label="Data e hora inicial"
                required
                error={errors.date?.message}
                {...register("date")}
              />
              <AdminInput
                type="datetime-local"
                label="Data e hora final"
                description="Opcional. Informe para eventos com duração ou vários dias."
                error={errors.endDate?.message}
                {...register("endDate")}
              />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>
        <AdminFormCard>
          <AdminSection title="Descrição">
            <AdminTextarea
              label="Descrição do evento"
              placeholder="Descreva o evento..."
              error={errors.description?.message}
              {...register("description")}
            />
          </AdminSection>
        </AdminFormCard>
        <AdminFormActions isSubmitting={isSubmitting} />
      </Form>
    </Container>
  );
}

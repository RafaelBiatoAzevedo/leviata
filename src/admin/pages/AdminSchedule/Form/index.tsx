import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminTextarea } from "../../../components/AdminTextarea";
import {
  mapScheduleToCreateDto,
  mapScheduleToForm,
} from "../../../mappers/schedule.mapper";
import { scheduleService } from "../../../services/schedule";
import {
  loadNewsRelatedOptions,
  type NewsRelatedOption,
} from "../../../services/newsRelated";
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
  const [meetingOptions, setMeetingOptions] = useState<NewsRelatedOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");
  const [optionsVersion, setOptionsVersion] = useState(0);
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: scheduleDefaultValues,
  });
  const destination = useWatch({ control, name: "destination" });
  const meetingId = useWatch({ control, name: "meetingId" });

  useEffect(() => {
    const controller = new AbortController();
    // The same complete list (including external events) is available to news and agenda.
    loadNewsRelatedOptions("MEETING", controller.signal)
      .then((options) => {
        if (!controller.signal.aborted) setMeetingOptions(options);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setOptionsError("Não foi possível carregar os eventos.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setOptionsLoading(false);
      });
    return () => controller.abort();
  }, [optionsVersion]);

  function reloadOptions() {
    setOptionsLoading(true);
    setOptionsError("");
    setOptionsVersion((value) => value + 1);
  }

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
    if (
      data.destination === "MEETING" &&
      (optionsLoading ||
        optionsError ||
        !meetingOptions.some((option) => option.value === data.meetingId))
    ) {
      setError("meetingId", {
        message: optionsLoading
          ? "Aguarde o carregamento dos eventos."
          : "Atualize as opções e selecione um evento disponível.",
      });
      return;
    }
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
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>
        <AdminFormCard>
          <AdminSection title="Destino do botão no portal">
            <AdminSelect
              label="Ao acessar o evento"
              description="Divulgue o link de inscrição agora. Depois da realização, edite a agenda e selecione o evento cadastrado para abrir seus registros no portal."
              options={[
                {
                  value: "EXTERNAL",
                  label: "Link de inscrição ou site externo",
                },
                { value: "MEETING", label: "Evento cadastrado no portal" },
              ]}
              {...register("destination")}
            />
            {destination === "MEETING" ? (
              <>
                <AdminSelect
                  label="Evento vinculado"
                  required
                  disabled={optionsLoading || Boolean(optionsError)}
                  description="Encontros, seminários, simpósios e mostras, internos ou externos."
                  error={errors.meetingId?.message}
                  options={[
                    {
                      value: "",
                      label: optionsLoading
                        ? "Carregando eventos..."
                        : "Selecione o evento",
                    },
                    ...(meetingId &&
                    !meetingOptions.some((option) => option.value === meetingId)
                      ? [
                          {
                            value: meetingId,
                            label: optionsLoading
                              ? "Carregando evento vinculado..."
                              : "Evento indisponível — selecione outro",
                            disabled: true,
                          },
                        ]
                      : []),
                    ...meetingOptions,
                  ]}
                  {...register("meetingId")}
                />
                {optionsError && <AdminError>{optionsError}</AdminError>}
                {!optionsLoading &&
                  !optionsError &&
                  meetingOptions.length === 0 && (
                    <p>
                      Nenhum evento cadastrado. Cadastre em Atividades → Eventos
                      e atualize as opções.
                    </p>
                  )}
                <AdminButton
                  type="button"
                  variant="outline"
                  disabled={optionsLoading}
                  onClick={reloadOptions}
                >
                  {optionsError ? "Tentar novamente" : "Atualizar eventos"}
                </AdminButton>
              </>
            ) : (
              <AdminInput
                label="Link de inscrição ou site externo"
                placeholder="https://..."
                description="Opcional. O botão aparece no portal quando houver um link."
                error={errors.externalUrl?.message}
                {...register("externalUrl")}
              />
            )}
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
                labelHint="Opcional. Informe para eventos com duração ou vários dias."
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

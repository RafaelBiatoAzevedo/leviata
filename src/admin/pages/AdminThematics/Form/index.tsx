import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { isAxiosError } from "axios";
import { useToast } from "../../../../hooks/useToast";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminInput } from "../../../components/AdminInput";
import { AdminButton } from "../../../components/AdminButton";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminTextarea } from "../../../components/AdminTextarea";
import { AdminError } from "../../../components/AdminError";
import { AdminLoading } from "../../../components/AdminLoading";
import AdminFormActions from "../../../components/AdminFormActions";
import { peopleService } from "../../../services/people";
import { videosService } from "../../../services/videos";
import { thematicsService } from "../../../services/thematics";
import type { PersonResponseDto } from "../../../dtos/people/PersonResponseDto";
import type { VideoResponseDto } from "../../../dtos/videos/VideoResponseDto";
import {
  thematicSchema,
  type ThematicFormData,
} from "../../../validations/thematic.schema";
import { thematicDefaultValues } from "./defaultValues";
import {
  mapThematicToCreateDto,
  mapThematicToForm,
} from "../../../mappers/thematic.mapper";
import { loadAllPages } from "../../../../utils/loadAllPages";
import {
  Container,
  Form,
  VideoItem,
  VideoItemHeader,
  VideoList,
  Empty,
} from "./styles";

export function ThematicForm() {
  const { slug } = useParams();
  return <ThematicEditor key={slug ?? "new"} slug={slug} />;
}

function ThematicEditor({ slug }: { slug?: string }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [people, setPeople] = useState<PersonResponseDto[]>([]);
  const [videos, setVideos] = useState<VideoResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const isEdit = Boolean(slug);
  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ThematicFormData>({
    resolver: zodResolver(thematicSchema),
    defaultValues: thematicDefaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalVideos",
  });

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      loadAllPages((params) => peopleService.getAll(params, controller.signal)),
      loadAllPages((params) => videosService.getAll(params, controller.signal)),
      slug
        ? thematicsService.getDetails(slug, controller.signal)
        : Promise.resolve(null),
    ])
      .then(([peopleData, videosData, response]) => {
        if (controller.signal.aborted) return;
        setPeople(peopleData);
        setVideos(videosData);
        if (response) reset(mapThematicToForm(response.data));
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("Não foi possível carregar os dados da temática.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [slug, reset, attempt]);

  const personOptions = [
    { value: "", label: "Nenhuma pessoa selecionada" },
    ...people.map((person) => ({ value: person.id, label: person.name })),
  ];
  const videoOptions = [
    { value: "", label: "Selecione um vídeo" },
    ...videos.map((video) => ({ value: video.id, label: video.title })),
  ];

  async function onSubmit(data: ThematicFormData) {
    try {
      const dto = mapThematicToCreateDto(data);
      if (slug) await thematicsService.updateBySlug(slug, dto);
      else await thematicsService.create(dto);
      showToast({
        title: isEdit ? "Temática atualizada" : "Temática criada",
        description: "Os dados e os vídeos foram salvos com sucesso.",
        type: "success",
      });
      navigate("/admin/tematicas");
    } catch (error) {
      const message = isAxiosError<{ message?: string | string[] }>(error)
        ? error.response?.data.message
        : undefined;
      showToast({
        title: isEdit ? "Erro ao atualizar temática" : "Erro ao criar temática",
        description: Array.isArray(message)
          ? message.join(" ")
          : (message ?? "Não foi possível salvar os dados. Tente novamente."),
        type: "danger",
      });
    }
  }

  if (loading) return <AdminLoading text="Carregando temática e vídeos..." />;
  if (error)
    return (
      <Container>
        <AdminError>{error}</AdminError>
        <AdminButton
          type="button"
          onClick={() => {
            setError("");
            setLoading(true);
            setAttempt((value) => value + 1);
          }}
        >
          Tentar novamente
        </AdminButton>
      </Container>
    );

  return (
    <Container>
      <AdminPageHeader
        title={isEdit ? "Editar temática" : "Nova temática"}
        subtitle="Cadastre ou atualize os dados da temática."
      />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <AdminFormCard>
          <AdminSection title="Dados gerais">
            <AdminFormGrid>
              <AdminInput
                label="Título"
                placeholder="Título da temática"
                required
                error={errors.title?.message}
                {...register("title")}
              />
              <AdminInput
                label="Slug (gerado automaticamente)"
                value={slug ?? ""}
                disabled
              />
              <AdminSelect
                label="Coordenador"
                error={errors.coordinatorId?.message}
                {...register("coordinatorId")}
                options={personOptions}
              />
              <AdminSelect
                label="Vídeo principal"
                error={errors.mainVideoId?.message}
                {...register("mainVideoId")}
                options={[
                  { value: "", label: "Nenhum vídeo principal" },
                  ...videoOptions.slice(1),
                ]}
              />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>
        <AdminFormCard>
          <AdminSection title="Descrição">
            <AdminTextarea
              placeholder="Escreva uma descrição..."
              error={errors.description?.message}
              {...register("description")}
            />
          </AdminSection>
        </AdminFormCard>
        <AdminFormCard>
          <AdminSection
            title="Vídeos adicionais"
            action={
              <AdminButton
                size="medium"
                type="button"
                disabled={isSubmitting}
                onClick={() =>
                  append({
                    videoId: "",
                    personId: "",
                    title: "",
                    description: "",
                  })
                }
              >
                <FiPlus /> Adicionar vídeo
              </AdminButton>
            }
          >
            <VideoList>
              {fields.map((field, index) => (
                <VideoItem key={field.id}>
                  <VideoItemHeader>
                    <strong>Vídeo {index + 1}</strong>
                    <AdminButton
                      variant="danger"
                      size="small"
                      type="button"
                      disabled={isSubmitting}
                      aria-label={`Remover vídeo ${index + 1}`}
                      onClick={() => remove(index)}
                    >
                      <FiTrash2 /> Remover
                    </AdminButton>
                  </VideoItemHeader>
                  <AdminFormGrid>
                    <AdminSelect
                      id={`thematic-video-${field.id}`}
                      label="Vídeo"
                      required
                      options={videoOptions}
                      error={errors.additionalVideos?.[index]?.videoId?.message}
                      {...register(`additionalVideos.${index}.videoId`, {
                        onChange: (event) => {
                          const video = videos.find(
                            (item) => item.id === event.target.value,
                          );
                          if (
                            video &&
                            !getValues(`additionalVideos.${index}.title`)
                          )
                            setValue(
                              `additionalVideos.${index}.title`,
                              video.title,
                              { shouldDirty: true, shouldValidate: true },
                            );
                        },
                      })}
                    />
                    <AdminSelect
                      id={`thematic-person-${field.id}`}
                      label="Pessoa vinculada (opcional)"
                      options={personOptions}
                      error={
                        errors.additionalVideos?.[index]?.personId?.message
                      }
                      {...register(`additionalVideos.${index}.personId`)}
                    />
                    <AdminInput
                      id={`thematic-title-${field.id}`}
                      label="Título na temática"
                      required
                      placeholder="Título deste vídeo na temática"
                      error={errors.additionalVideos?.[index]?.title?.message}
                      {...register(`additionalVideos.${index}.title`)}
                    />
                  </AdminFormGrid>
                  <AdminTextarea
                    id={`thematic-description-${field.id}`}
                    label="Descrição (opcional)"
                    placeholder="Descreva a contribuição deste vídeo..."
                    error={
                      errors.additionalVideos?.[index]?.description?.message
                    }
                    {...register(`additionalVideos.${index}.description`)}
                  />
                </VideoItem>
              ))}
              {!fields.length && (
                <Empty>
                  Nenhum vídeo adicional. Adicione vídeos já cadastrados no
                  painel.
                </Empty>
              )}
              {errors.additionalVideos?.message && (
                <AdminError>{errors.additionalVideos.message}</AdminError>
              )}
            </VideoList>
          </AdminSection>
        </AdminFormCard>
        <AdminFormActions isSubmitting={isSubmitting} />
      </Form>
    </Container>
  );
}

import { useNavigate, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import {
  Actions,
  AuthorItem,
  SpeakerList,
  MeetingTopWrapper,
  Container,
  Form,
} from "./styles";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import { meetingsService } from "../../../services/meetings";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminImageUpload } from "../../../components/AdminImageUpload";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminInput } from "../../../components/AdminInput";
import { AdminTextarea } from "../../../components/AdminTextarea";
import { FiArrowLeft, FiPlus, FiSave, FiTrash2, FiVideo } from "react-icons/fi";
import { peopleService } from "../../../services/people";
import type { PersonResponseDto } from "../../../dtos/people/PersonResponseDto";
import { AdminButton } from "../../../components/AdminButton";
import { useModal } from "../../../../hooks/useModal";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminError } from "../../../components/AdminError";
import {
  meetingSchema,
  type MeetingFormData,
} from "../../../validations/meeting.schem";
import { meetingDefaultValues } from "./defaultValues";
import { mapMeetingToForm } from "../../../mappers/meeting.mapper";
import { mapMeetingToCreateDto } from "../../../mappers/meetingToCreate.mapper";
import { meetingTypeOptions } from "../../../utils/meetingTypes";
import { AdminDateInput } from "../../../components/AdminDateInput";

export function MeetingForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showModal, updateModal } = useModal();

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  const selectedSpeakerIdRef = useRef("");

  const [people, setPeople] = useState<PersonResponseDto[]>(
    [] as PersonResponseDto[],
  );

  const { slug } = useParams();

  const isEdit = Boolean(slug);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: meetingDefaultValues,
  });

  const speakers = useWatch({
    control,
    name: "speakers",
  });

  const loadMeeting = useCallback(async () => {
    if (!slug) return;

    const response = await meetingsService.getBySlug(slug);
    const formData = mapMeetingToForm(response.data);

    if (response.data.coverUrl) {
      setCoverPreview(response.data.coverUrl);
    }

    reset(formData);
  }, [reset, slug]);

  const loadPeople = useCallback(async () => {
    const response = await peopleService.getAll();

    setPeople(response.data);
  }, []);

  useEffect(() => {
    (async () => {
      await loadPeople();
    })();

    if (!isEdit) return;

    (async () => {
      await loadMeeting();
    })();
  }, [isEdit, loadMeeting, loadPeople]);

  function handleModal() {
    showModal({
      title: "Adicionar participante",

      content: (
        <div style={{ padding: "2rem 0rem" }}>
          <p>Selecione um </p>

          <br />

          <AdminSelect
            options={[
              {
                value: "",
                label: "Participentes",
              },
              ...people
                .filter((person) => !speakers.includes(person.id))
                .map((person) => ({
                  value: person.id,
                  label: person.name,
                })),
            ]}
            onChange={(event) => {
              selectedSpeakerIdRef.current = event.target.value;

              updateModal({
                confirmDisabled: !event.target.value,
              });
            }}
          />
        </div>
      ),

      confirmText: "Adicionar",

      cancelText: "Cancelar",

      confirmVariant: "success",

      confirmDisabled: !selectedSpeakerIdRef.current,

      onConfirm: () => {
        handleAddSpeaker(selectedSpeakerIdRef.current);
      },

      onCancel: () => {
        selectedSpeakerIdRef.current = "";
      },
    });
  }

  function handleAddSpeaker(personId: string) {
    if (speakers.includes(personId)) return;

    setValue("speakers", [...speakers, personId], {
      shouldValidate: true,
      shouldDirty: true,
    });

    selectedSpeakerIdRef.current = "";
  }

  function handleRemoveSpeaker(personId: string) {
    setValue(
      "speakers",
      speakers.filter((id) => id !== personId),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  }

  async function onSubmit(data: MeetingFormData) {
    try {
      if (isEdit) {
        await meetingsService.updateBySlug(slug!, data);

        showToast({
          title: "Encontro atualizado",
          description: "Os dados foram atualizados com sucesso.",
          type: "success",
        });
      } else {
        await meetingsService.create(mapMeetingToCreateDto(data), coverFile!);

        showToast({
          title: "Encontro criado",
          description: "O encontro foi cadastrado com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/encontros");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: isEdit ? "Erro ao atualizar encontro" : "Erro ao criar encontro",
        description:
          message ?? "Não foi possível salvar os dados. Tente novamente.",
        type: "danger",
      });
    }
  }

  async function handleUploadCover(file: File | null) {
    if (!file) return;

    if (isEdit) {
      const response = await meetingsService.updateCover(slug!, file);

      setCoverPreview(response.data.url);

      setValue("coverUrl", response.data.url);

      showToast({
        title: "Capa atualizada com sucesso",
        description: "A Capa do encontro foi atualizada.",
        type: "success",
      });

      return;
    }

    setCoverFile(file);

    setCoverPreview(URL.createObjectURL(file));
  }

  return (
    <Container>
      <AdminPageHeader
        title={isEdit ? "Editar encontro" : "Novo encontro"}
        subtitle="Cadastre ou atualize os dados do encontro."
      />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <MeetingTopWrapper>
          <AdminFormGrid columns={1}>
            <AdminImageUpload
              icon={<FiVideo size={42} />}
              label="Capa"
              variant="square"
              imageUrl={coverPreview}
              onChange={handleUploadCover}
            />
          </AdminFormGrid>

          <AdminFormCard>
            <AdminSection title="Dados Gerais">
              <AdminFormGrid>
                <AdminInput
                  label="Título"
                  placeholder="Título do encontro"
                  required
                  error={errors.title?.message}
                  {...register("title")}
                />

                <AdminInput
                  label="Slug (Gerado automaticamente)"
                  value={slug ?? ""}
                  disabled
                />

                <AdminDateInput
                  label="Data da publicação"
                  placeholder="02/10/2025"
                  required
                  {...register("date")}
                  error={errors.date?.message}
                />

                <AdminSelect
                  options={meetingTypeOptions}
                  label="Tipo"
                  required
                  error={errors.type?.message}
                  {...register("type")}
                ></AdminSelect>
              </AdminFormGrid>

              <AdminInput
                label="Local"
                error={errors.location?.message}
                {...register("location")}
              />
            </AdminSection>
          </AdminFormCard>
        </MeetingTopWrapper>

        <AdminFormCard>
          <AdminSection title="Links">
            <AdminInput
              label="Link de inscrições"
              placeholder="ex: https://eventos.unicamp.br/inscricao"
              error={errors.registrationUrl?.message}
              {...register("registrationUrl")}
            />
            <AdminInput
              label="Link do conteúdo"
              placeholder=" ex: https://meet.google.com/abc-defg-hij"
              error={errors.recordingUrl?.message}
              {...register("recordingUrl")}
            />
            <AdminInput
              label="Link da transmissão"
              placeholder="ex: https://www.youtube.com/watch?v=abc123"
              error={errors.meetingUrl?.message}
              {...register("meetingUrl")}
            />
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection title="Descrição">
            <AdminTextarea
              placeholder="Escreva uma descrição..."
              error={errors.description?.message}
              {...register("description")}
            ></AdminTextarea>
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection
            title="Participantes"
            action={
              <AdminButton size="medium" type="button" onClick={handleModal}>
                <FiPlus />
              </AdminButton>
            }
          >
            <SpeakerList>
              {speakers.map((speakerId) => {
                const speaker = people.find(
                  (person) => person.id === speakerId,
                );

                if (!speaker) return null;

                return (
                  <AuthorItem key={speaker.id}>
                    <span>{`${speaker.academicTitle?.abbreviation} ${speaker.name} - ${speaker.institution?.acronym} `}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveSpeaker(speaker.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </AuthorItem>
                );
              })}
            </SpeakerList>

            {errors.speakers && (
              <AdminError>{errors.speakers.message}</AdminError>
            )}
          </AdminSection>
        </AdminFormCard>

        <Actions>
          <AdminButton
            variant="outline"
            type="button"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft />
            Cancelar
          </AdminButton>

          <AdminButton type="submit" disabled={isSubmitting}>
            <FiSave />
            Salvar
          </AdminButton>
        </Actions>
      </Form>
    </Container>
  );
}

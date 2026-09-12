import { useNavigate, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { Actions, MemberItem, MemberList, Container, Form } from "./styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminInput } from "../../../components/AdminInput";
import { FiArrowLeft, FiPlus, FiSave, FiTrash2 } from "react-icons/fi";
import { peopleService } from "../../../services/people";
import type { PersonResponseDto } from "../../../dtos/people/PersonResponseDto";
import { AdminButton } from "../../../components/AdminButton";
import { useModal } from "../../../../hooks/useModal";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminError } from "../../../components/AdminError";

import { videosService } from "../../../services/videos";

import {
  videoSchema,
  type VideoFormData,
} from "../../../validations/video.schema";
import { videoDefaultVideoValues } from "./defaultValues";
import {
  mapVideoToCreateDto,
  mapVideoToForm,
} from "../../../mappers/video.mapper";
import { AdminTextarea } from "../../../components/AdminTextarea";

export function VideoForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showModal, updateModal } = useModal();

  const selectedMemberIdRef = useRef("");

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
  } = useForm<VideoFormData>({
    resolver: zodResolver(videoSchema),
    defaultValues: videoDefaultVideoValues,
  });

  const _people = useWatch({
    control,
    name: "people",
  });

  const loadVideo = useCallback(async () => {
    if (!slug) return;

    const response = await videosService.getBySlug(slug);
    const formData = mapVideoToForm(response.data);

    reset(formData);
  }, [reset, slug]);

  const loadPeople = useCallback(async () => {
    const response = await peopleService.getAll();

    setPeople(response.data);
  }, []);

  useEffect(() => {
    (async () => {
      await loadPeople();

      if (isEdit) {
        await loadVideo();
      }
    })();
  }, [isEdit, loadVideo, loadPeople]);

  function handleModal() {
    showModal({
      title: "Adicionar Participante",

      content: (
        <div style={{ padding: "2rem 0rem" }}>
          <br />

          <AdminSelect
            options={[
              {
                value: "",
                label: "Selecione um Participante",
              },
              ...people
                .filter((person) => !(_people || []).includes(person.id))
                .map((person) => ({
                  value: person.id,
                  label: person.name,
                })),
            ]}
            label="Participantes"
            required
            onChange={(event) => {
              selectedMemberIdRef.current = event.target.value;

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

      confirmDisabled: !selectedMemberIdRef.current,

      onConfirm: () => {
        handleAddMember(selectedMemberIdRef.current);
      },

      onCancel: () => {
        selectedMemberIdRef.current = "";
      },
    });
  }

  function handleAddMember(personId: string) {
    if ((_people || []).includes(personId)) return;

    setValue("people", [...(_people || []), personId], {
      shouldValidate: true,
      shouldDirty: true,
    });

    selectedMemberIdRef.current = "";
  }

  function handleRemoveMember(personId: string) {
    setValue(
      "people",
      (_people || []).filter((id) => id !== personId),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  }

  async function onSubmit(data: VideoFormData) {
    try {
      if (isEdit) {
        await videosService.updateBySlug(slug!, data);

        showToast({
          title: "Video atualizada",
          description: "Os dados foram atualizados com sucesso.",
          type: "success",
        });
      } else {
        await videosService.create(mapVideoToCreateDto(data));

        showToast({
          title: "Video criada",
          description: "A video foi cadastrada com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/videos");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: isEdit ? "Erro ao atualizar video" : "Erro ao criar video",
        description:
          message ?? "Não foi possível salvar os dados. Tente novamente.",
        type: "danger",
      });
    }
  }

  return (
    <Container>
      <AdminPageHeader
        title={isEdit ? "Editar video" : "Nova video"}
        subtitle="Cadastre ou atualize os dados da video."
      />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <AdminFormCard>
          <AdminSection title="Dados Gerais">
            <AdminFormGrid>
              <AdminInput
                label="Título"
                placeholder="Título da video"
                required
                error={errors.title?.message}
                {...register("title")}
              />

              <AdminInput
                label="Slug (Gerado automaticamente)"
                value={slug ?? ""}
                disabled
              />
            </AdminFormGrid>
            <AdminInput
              label="Link do video"
              required
              placeholder="ex: https://www.youtube.com/watch?v=abc123"
              error={errors.videoUrl?.message}
              {...register("videoUrl")}
            />
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection title="Descrição">
            <AdminTextarea
              placeholder="Escreva uma breve descrição..."
              error={errors.description?.message}
              {...register("description")}
            ></AdminTextarea>
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection
            title="Participantes do video"
            action={
              <AdminButton size="medium" type="button" onClick={handleModal}>
                <FiPlus />
              </AdminButton>
            }
          >
            <MemberList>
              {(_people || []).map((memberId) => {
                const member = people.find((person) => person.id === memberId);

                if (!member) return null;

                return (
                  <MemberItem key={member.id}>
                    <span>{`${member.academicTitle?.abbreviation} ${member.name} - ${member.institution?.acronym} `}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </MemberItem>
                );
              })}
            </MemberList>

            {errors.people && <AdminError>{errors.people.message}</AdminError>}
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

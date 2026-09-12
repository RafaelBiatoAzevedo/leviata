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
import {
  thematicSchema,
  type ThematicFormData,
} from "../../../validations/thematic.schema";
import { thematicsService } from "../../../services/thematics";
import { thematicDefaultValues } from "./defaultValues";
import {
  mapThematicToCreateDto,
  mapThematicToForm,
} from "../../../mappers/thematic.mapper";
import { AdminTextarea } from "../../../components/AdminTextarea";
import type { VideoResponseDto } from "../../../dtos/videos/VideoResponseDto";
import { videosService } from "../../../services/videos";

export function ThematicForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showModal, updateModal } = useModal();

  const selectedMemberIdRef = useRef("");

  const [people, setPeople] = useState<PersonResponseDto[]>(
    [] as PersonResponseDto[],
  );

  const [videos, setVideos] = useState<VideoResponseDto[]>(
    [] as VideoResponseDto[],
  );

  const { slug } = useParams();

  const isEdit = Boolean(slug);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ThematicFormData>({
    resolver: zodResolver(thematicSchema),
    defaultValues: thematicDefaultValues,
  });

  // const additionalVideos = useWatch({
  //   control,
  //   name: "additionalVideos",
  // });

  const loadThematic = useCallback(async () => {
    if (!slug) return;

    const response = await thematicsService.getBySlug(slug);
    const formData = mapThematicToForm(response.data);

    reset(formData);
  }, [reset, slug]);

  const load = useCallback(async () => {
    const responsePepople = await peopleService.getAll();
    const responseVideos = await videosService.getAll();

    setPeople(responsePepople.data);
    setVideos(responseVideos.data);
  }, []);

  useEffect(() => {
    (async () => {
      await load();

      if (isEdit) {
        await loadThematic();
      }
    })();
  }, [isEdit, loadThematic, load]);

  // function handleModal() {
  //   showModal({
  //     title: "Adicionar integrante",

  //     content: (
  //       <div style={{ padding: "2rem 0rem" }}>
  //         <br />

  //         <AdminSelect
  //           options={[
  //             {
  //               value: "",
  //               label: "Selecione um integrante",
  //             },
  //             ...people
  //               .filter(
  //                 (person) =>
  //                   !members.includes(person.id) &&
  //                   person.id !== advisorId &&
  //                   person.id !== candidateId,
  //               )
  //               .map((person) => ({
  //                 value: person.id,
  //                 label: person.name,
  //               })),
  //           ]}
  //           label="Integrantes"
  //           required
  //           onChange={(event) => {
  //             selectedMemberIdRef.current = event.target.value;

  //             updateModal({
  //               confirmDisabled: !event.target.value,
  //             });
  //           }}
  //         />
  //       </div>
  //     ),

  //     confirmText: "Adicionar",

  //     cancelText: "Cancelar",

  //     confirmVariant: "success",

  //     confirmDisabled: !selectedMemberIdRef.current,

  //     onConfirm: () => {
  //       handleAddMember(selectedMemberIdRef.current);
  //     },

  //     onCancel: () => {
  //       selectedMemberIdRef.current = "";
  //     },
  //   });
  // }

  // function handleAddMember(personId: string) {
  //   if (members.includes(personId)) return;

  //   setValue("members", [...members, personId], {
  //     shouldValidate: true,
  //     shouldDirty: true,
  //   });

  //   selectedMemberIdRef.current = "";
  // }

  // function handleRemoveMember(personId: string) {
  //   setValue(
  //     "members",
  //     members.filter((id) => id !== personId),
  //     {
  //       shouldValidate: true,
  //       shouldDirty: true,
  //     },
  //   );
  // }

  const optionsCoordenator = [
    {
      value: "",
      label: "Selecione o coordenador(a)",
    },
    ...people.map((person) => ({
      value: person.id,
      label: person.name,
    })),
  ];

  const optionsMainVideo = [
    {
      value: "",
      label: "Selecione o video",
    },
    ...videos.map((video) => ({
      value: video.id,
      label: video.title,
    })),
  ];

  async function onSubmit(data: ThematicFormData) {
    try {
      if (isEdit) {
        await thematicsService.updateBySlug(slug!, data);

        showToast({
          title: "Temática atualizada",
          description: "Os dados foram atualizados com sucesso.",
          type: "success",
        });
      } else {
        await thematicsService.create(mapThematicToCreateDto(data));

        showToast({
          title: "Temática criada",
          description: "A temática foi cadastrada com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/tematicas");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: isEdit ? "Erro ao atualizar temática" : "Erro ao criar temática",
        description:
          message ?? "Não foi possível salvar os dados. Tente novamente.",
        type: "danger",
      });
    }
  }

  return (
    <Container>
      <AdminPageHeader
        title={isEdit ? "Editar temática" : "Nova temática"}
        subtitle="Cadastre ou atualize os dados da temática."
      />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <AdminFormCard>
          <AdminSection title="Dados Gerais">
            <AdminFormGrid>
              <AdminInput
                label="Título"
                placeholder="Título da temática"
                required
                error={errors.title?.message}
                {...register("title")}
              />

              <AdminInput
                label="Slug (Gerado automaticamente)"
                value={slug ?? ""}
                disabled
              />

              {/* <AdminInput
                label="Link da temática"
                placeholder="Url da temática"
                required
                error={errors.meetingUrl?.message}
                {...register("meetingUrl")}
              /> */}
            </AdminFormGrid>
            <AdminSelect
              label="Coordenador"
              required
              error={errors.coordinatorId?.message}
              {...register("coordinatorId")}
              options={optionsCoordenator}
            ></AdminSelect>

            <AdminSelect
              label="Video Principal"
              required
              error={errors.mainVideoId?.message}
              {...register("mainVideoId")}
              options={optionsMainVideo}
            ></AdminSelect>
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
            title="Videos adicionais"
            action={
              <AdminButton size="medium" type="button" onClick={() => {}}>
                <FiPlus />
              </AdminButton>
            }
          >
            <></>
          </AdminSection>
        </AdminFormCard>

        {/* <AdminFormCard>
          <AdminSection
            title="Integrantes da temática"
            action={
              <AdminButton size="medium" type="button" onClick={handleModal}>
                <FiPlus />
              </AdminButton>
            }
          >
            <MemberList>
              {members.map((memberId) => {
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

            {errors.members && (
              <AdminError>{errors.members.message}</AdminError>
            )}
          </AdminSection>
        </AdminFormCard> */}

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

import { useNavigate, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import {
  Actions,
  MemberItem,
  MemberList,
  JuryTopWrapper,
  Container,
  Form,
} from "./styles";
import {
  jurySchema,
  type JuryFormData,
} from "../../../validations/jury.schema";
import { juryDefaultValues } from "./defaultValues";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import { juriesService } from "../../../services/juries";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminImageUpload } from "../../../components/AdminImageUpload";
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
import { GiInjustice } from "react-icons/gi";
import { mapJuryToForm } from "../../../mappers/jury.mapper";
import { mapJuryToCreateDto } from "../../../mappers/juryToCreate.mapper";
import { AdminDateInput } from "../../../components/AdminDateInput";
import { AdminTextarea } from "../../../components/AdminTextarea";

type TJuryRole = "judges" | "jurors" | "prosecutors" | "defenders" | "bailiffs";

interface AddPersonModalConfig {
  title: string;
  label: string;
  selectedIds: string[];
  selectedIdRef: React.MutableRefObject<string>;
  onAdd: (personId: string) => void;
}

export function JuryForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showModal, updateModal } = useModal();

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  const selectedJudgeIdRef = useRef("");
  const selectedJurorIdRef = useRef("");
  const selectedProsecutorIdRef = useRef("");
  const selectedDefenderIdRef = useRef("");
  const selectedBailiffIdRef = useRef("");

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
  } = useForm<JuryFormData>({
    resolver: zodResolver(jurySchema),
    defaultValues: juryDefaultValues,
  });

  const judges = useWatch({
    control,
    name: "judges",
  });

  const jurors = useWatch({
    control,
    name: "jurors",
  });

  const prosecutors = useWatch({
    control,
    name: "prosecutors",
  });

  const defenders = useWatch({
    control,
    name: "defenders",
  });

  const bailiffs = useWatch({
    control,
    name: "bailiffs",
  });

  const juryMembers: Record<TJuryRole, string[]> = {
    judges,
    jurors,
    prosecutors,
    defenders,
    bailiffs,
  };

  const loadJury = useCallback(async () => {
    if (!slug) return;

    const response = await juriesService.getBySlug(slug);
    const formData = mapJuryToForm(response.data);

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
      await loadJury();
    })();
  }, [isEdit, loadJury, loadPeople]);

  function handleAddPersonModal({
    title,
    label,
    selectedIds,
    selectedIdRef,
    onAdd,
  }: AddPersonModalConfig) {
    selectedIdRef.current = "";

    showModal({
      title,

      content: (
        <div style={{ padding: "2rem 0rem" }}>
          <p>{label}</p>

          <br />

          <AdminSelect
            options={[
              {
                value: "",
                label: "Selecione um",
              },

              ...people
                .filter((person) => !selectedIds.includes(person.id))
                .map((person) => ({
                  value: person.id,
                  label: person.name,
                })),
            ]}
            onChange={(event) => {
              selectedIdRef.current = event.target.value;

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

      confirmDisabled: !selectedIdRef.current,

      onConfirm: () => {
        if (!selectedIdRef.current) return;

        onAdd(selectedIdRef.current);
      },

      onCancel: () => {
        selectedIdRef.current = "";
      },
    });
  }

  function handleAddMember(field: TJuryRole, personId: string) {
    const currentIds = juryMembers[field];

    if (currentIds.includes(personId)) return;

    setValue(field, [...currentIds, personId], {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  function handleRemoveMember(field: TJuryRole, personId: string) {
    const currentIds = juryMembers[field];

    setValue(
      field,
      currentIds.filter((id) => id !== personId),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  }

  async function onSubmit(data: JuryFormData) {
    try {
      if (isEdit) {
        await juriesService.updateBySlug(slug!, data);

        showToast({
          title: "Júri atualizado",
          description: "Os dados foram atualizados com sucesso.",
          type: "success",
        });
      } else {
        await juriesService.create(mapJuryToCreateDto(data), coverFile!);

        showToast({
          title: "Júri criado",
          description: "O júri foi cadastrado com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/juris");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: isEdit ? "Erro ao atualizar júri" : "Erro ao criar júri",
        description:
          message ?? "Não foi possível salvar os dados. Tente novamente.",
        type: "danger",
      });
    }
  }

  async function handleUploadCover(file: File | null) {
    if (!file) return;

    if (isEdit) {
      const response = await juriesService.updateCover(slug!, file);

      setCoverPreview(response.data.url);

      setValue("coverUrl", response.data.url);

      showToast({
        title: "Capa atualizada com sucesso",
        description: "A Capa do júri foi atualizada.",
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
        title={isEdit ? "Editar júri" : "Novo júri"}
        subtitle="Cadastre ou atualize os dados do júri."
      />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <JuryTopWrapper>
          <AdminFormGrid columns={1}>
            <AdminImageUpload
              icon={<GiInjustice size={42} />}
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
                  placeholder="Título do júri"
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
                  label="Data"
                  placeholder="10/02/2025"
                  required
                  {...register("date")}
                  error={errors.date?.message}
                />
              </AdminFormGrid>
              <AdminInput
                label="Local"
                error={errors.location?.message}
                {...register("location")}
              />
            </AdminSection>
          </AdminFormCard>
        </JuryTopWrapper>

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
          <AdminSection title="Links">
            <AdminInput
              label="Link da inscrição"
              placeholder="ex: https://eventos.unicamp.br/inscricao"
              error={errors.registrationUrl?.message}
              {...register("registrationUrl")}
            />
            <AdminInput
              label="Link da transmissão"
              placeholder=" ex: https://meet.google.com/abc-defg-hij"
              error={errors.meetingUrl?.message}
              {...register("meetingUrl")}
            />

            <AdminInput
              label="Link da gravação"
              placeholder="ex: https://www.youtube.com/watch?v=abc123"
              error={errors.recordingUrl?.message}
              {...register("recordingUrl")}
            />

            <AdminInput
              label="Link do documento"
              placeholder="ex: https://eventos.unicamp.br/documento222"
              error={errors.documentUrl?.message}
              {...register("documentUrl")}
            />
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection
            title="Juízes"
            action={
              <AdminButton
                size="medium"
                type="button"
                onClick={() =>
                  handleAddPersonModal({
                    title: "Adicionar juiz",
                    label: "Juízes",
                    selectedIds: judges,
                    selectedIdRef: selectedJudgeIdRef,
                    onAdd: (personId: string) =>
                      handleAddMember("judges", personId),
                  })
                }
              >
                <FiPlus />
              </AdminButton>
            }
          >
            <MemberList>
              {judges.map((judgeId) => {
                const judge = people.find((person) => person.id === judgeId);

                if (!judge) return null;

                return (
                  <MemberItem key={judge.id}>
                    <span>{`${judge.academicTitle?.abbreviation} ${judge.name} - ${judge.institution?.acronym} `}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveMember("judges", judge.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </MemberItem>
                );
              })}
            </MemberList>

            {errors.judges && <AdminError>{errors.judges.message}</AdminError>}
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection
            title="Jurados"
            action={
              <AdminButton
                size="medium"
                type="button"
                onClick={() =>
                  handleAddPersonModal({
                    title: "Adicionar jurado",
                    label: "Jurados",
                    selectedIds: jurors,
                    selectedIdRef: selectedJurorIdRef,
                    onAdd: (personId: string) =>
                      handleAddMember("jurors", personId),
                  })
                }
              >
                <FiPlus />
              </AdminButton>
            }
          >
            <MemberList>
              {jurors.map((jurorId) => {
                const juror = people.find((person) => person.id === jurorId);

                if (!juror) return null;

                return (
                  <MemberItem key={juror.id}>
                    <span>{`${juror.academicTitle?.abbreviation} ${juror.name} - ${juror.institution?.acronym} `}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveMember("jurors", juror.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </MemberItem>
                );
              })}
            </MemberList>

            {errors.jurors && <AdminError>{errors.jurors.message}</AdminError>}
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection
            title="Promotores"
            action={
              <AdminButton
                size="medium"
                type="button"
                onClick={() =>
                  handleAddPersonModal({
                    title: "Adicionar promotor",
                    label: "Promotores",
                    selectedIds: prosecutors,
                    selectedIdRef: selectedProsecutorIdRef,
                    onAdd: (personId: string) =>
                      handleAddMember("prosecutors", personId),
                  })
                }
              >
                <FiPlus />
              </AdminButton>
            }
          >
            <MemberList>
              {prosecutors.map((prosecutorId) => {
                const prosecutor = people.find(
                  (person) => person.id === prosecutorId,
                );

                if (!prosecutor) return null;

                return (
                  <MemberItem key={prosecutor.id}>
                    <span>{`${prosecutor.academicTitle?.abbreviation} ${prosecutor.name} - ${prosecutor.institution?.acronym} `}</span>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveMember("prosecutors", prosecutor.id)
                      }
                    >
                      <FiTrash2 />
                    </button>
                  </MemberItem>
                );
              })}
            </MemberList>

            {errors.prosecutors && (
              <AdminError>{errors.prosecutors.message}</AdminError>
            )}
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection
            title="Defensores"
            action={
              <AdminButton
                size="medium"
                type="button"
                onClick={() =>
                  handleAddPersonModal({
                    title: "Adicionar defensor",
                    label: "Defensores",
                    selectedIds: defenders,
                    selectedIdRef: selectedDefenderIdRef,
                    onAdd: (personId: string) =>
                      handleAddMember("defenders", personId),
                  })
                }
              >
                <FiPlus />
              </AdminButton>
            }
          >
            <MemberList>
              {defenders.map((defenderId) => {
                const defender = people.find(
                  (person) => person.id === defenderId,
                );

                if (!defender) return null;

                return (
                  <MemberItem key={defender.id}>
                    <span>{`${defender.academicTitle?.abbreviation} ${defender.name} - ${defender.institution?.acronym} `}</span>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveMember("defenders", defender.id)
                      }
                    >
                      <FiTrash2 />
                    </button>
                  </MemberItem>
                );
              })}
            </MemberList>

            {errors.defenders && (
              <AdminError>{errors.defenders.message}</AdminError>
            )}
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection
            title="oficial de justiça"
            action={
              <AdminButton
                size="medium"
                type="button"
                onClick={() =>
                  handleAddPersonModal({
                    title: "Adicionar Oficial de justiça",
                    label: "Oficiais de justiça",
                    selectedIds: bailiffs,
                    selectedIdRef: selectedBailiffIdRef,
                    onAdd: (personId: string) =>
                      handleAddMember("bailiffs", personId),
                  })
                }
              >
                <FiPlus />
              </AdminButton>
            }
          >
            <MemberList>
              {bailiffs.map((bailiffId) => {
                const bailiff = people.find(
                  (person) => person.id === bailiffId,
                );

                if (!bailiff) return null;

                return (
                  <MemberItem key={bailiff.id}>
                    <span>{`${bailiff.academicTitle?.abbreviation} ${bailiff.name} - ${bailiff.institution?.acronym} `}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveMember("bailiffs", bailiff.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </MemberItem>
                );
              })}
            </MemberList>

            {errors.bailiffs && (
              <AdminError>{errors.bailiffs.message}</AdminError>
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

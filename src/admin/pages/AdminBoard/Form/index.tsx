import { useNavigate, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { Actions, AuthorItem, MemberList, Container, Form } from "./styles";
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
import {
  boardSchema,
  type BoardFormData,
} from "../../../validations/board,schema";
import { boardsService } from "../../../services/boards";
import { mapBoardToCreateDto } from "../../../mappers/boardToCreate.mapper";
import { mapBoardToForm } from "../../../mappers/board.mapper";
import { boardDefaultValues } from "./defaultValues";
import { AdminDateInput } from "../../../components/AdminDateInput";

export function BoardForm() {
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
  } = useForm<BoardFormData>({
    resolver: zodResolver(boardSchema),
    defaultValues: boardDefaultValues,
  });

  const members = useWatch({
    control,
    name: "members",
  });

  const candidateId = useWatch({
    control,
    name: "candidateId",
  });

  const advisorId = useWatch({
    control,
    name: "advisorId",
  });

  const loadBoard = useCallback(async () => {
    if (!slug) return;

    const response = await boardsService.getBySlug(slug);
    const formData = mapBoardToForm(response.data);

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
      await loadBoard();
    })();
  }, [isEdit, loadBoard, loadPeople]);

  function handleModal() {
    showModal({
      title: "Adicionar membro",

      content: (
        <div style={{ padding: "2rem 0rem" }}>
          <p>Selecione um membro</p>

          <br />

          <AdminSelect
            options={[
              {
                value: "",
                label: "Membros",
              },
              ...people
                .filter(
                  (person) =>
                    !members.includes(person.id) &&
                    person.id !== advisorId &&
                    person.id !== candidateId,
                )
                .map((person) => ({
                  value: person.id,
                  label: person.name,
                })),
            ]}
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
        handleAddAuthor(selectedMemberIdRef.current);
      },

      onCancel: () => {
        selectedMemberIdRef.current = "";
      },
    });
  }

  function handleAddAuthor(personId: string) {
    if (members.includes(personId)) return;

    setValue("members", [...members, personId], {
      shouldValidate: true,
      shouldDirty: true,
    });

    selectedMemberIdRef.current = "";
  }

  function handleRemoveAuthor(personId: string) {
    setValue(
      "members",
      members.filter((id) => id !== personId),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  }

  const optionsAdvisor = [
    {
      value: "",
      label: "Selecione um orientador",
    },
    ...people
      .filter(
        (person) => !members.includes(person.id) && person.id !== candidateId,
      )
      .map((person) => ({
        value: person.id,
        label: person.name,
      })),
  ];

  const optionsCandidate = [
    {
      value: "",
      label: "Selecione um candidato",
    },
    ...people
      .filter(
        (person) => !members.includes(person.id) && person.id !== advisorId,
      )
      .map((person) => ({
        value: person.id,
        label: person.name,
      })),
  ];

  async function onSubmit(data: BoardFormData) {
    try {
      if (isEdit) {
        await boardsService.updateBySlug(slug!, data);

        showToast({
          title: "Banca atualizada",
          description: "Os dados foram atualizados com sucesso.",
          type: "success",
        });
      } else {
        await boardsService.create(mapBoardToCreateDto(data));

        showToast({
          title: "Banca criada",
          description: "A banca foi cadastrada com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/bancas");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: isEdit ? "Erro ao atualizar banca" : "Erro ao criar banca",
        description:
          message ?? "Não foi possível salvar os dados. Tente novamente.",
        type: "danger",
      });
    }
  }

  return (
    <Container>
      <AdminPageHeader
        title={isEdit ? "Editar banca" : "Nova banca"}
        subtitle="Cadastre ou atualize os dados da banca."
      />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <AdminFormCard>
          <AdminSection title="Dados Gerais">
            <AdminFormGrid>
              <AdminInput
                label="Título"
                placeholder="Título da banca"
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

              <AdminInput
                label="Link da banca"
                placeholder="Url da banca"
                required
                error={errors.meetingUrl?.message}
                {...register("meetingUrl")}
              />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection title="Participantes principais">
            <AdminFormGrid>
              <AdminSelect
                label="Candidato"
                required
                error={errors.candidateId?.message}
                {...register("candidateId")}
                options={optionsCandidate}
              ></AdminSelect>
              <AdminSelect
                label="Orientador"
                required
                error={errors.advisorId?.message}
                {...register("advisorId")}
                options={optionsAdvisor}
              ></AdminSelect>
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection
            title="Membros da banca"
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
                  <AuthorItem key={member.id}>
                    <span>{`${member.academicTitle?.abbreviation} ${member.name} - ${member.institution?.acronym} `}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveAuthor(member.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </AuthorItem>
                );
              })}
            </MemberList>

            {errors.members && (
              <AdminError>{errors.members.message}</AdminError>
            )}
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection title="Fotos">
            <></>
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

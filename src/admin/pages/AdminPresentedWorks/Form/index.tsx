import { useNavigate, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { Actions, Container, Form, AuthorItem, AuthorList } from "./styles";
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

import { presentedWorksService } from "../../../services/presentedWorks";

import { AdminDateInput } from "../../../components/AdminDateInput";
import { presentedWorkDefaultValues } from "./defaultValues";
import {
  presentedWorkSchema,
  type PresentedWorkFormData,
} from "../../../validations/presentedWork.schema";
import { mapPresentedWorkToForm } from "../../../mappers/presentedWork.mapper";
import { mapPresentedWorkToCreateDto } from "../../../mappers/presentedWorkToCreate.mapper";

export function PresentedWorkForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showModal, updateModal } = useModal();

  const selectedAuthorIdRef = useRef("");

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
  } = useForm<PresentedWorkFormData>({
    resolver: zodResolver(presentedWorkSchema),
    defaultValues: presentedWorkDefaultValues,
  });

  const authors = useWatch({
    control,
    name: "authors",
  });

  const loadPresentedWork = useCallback(async () => {
    if (!slug) return;

    const response = await presentedWorksService.getBySlug(slug);
    const formData = mapPresentedWorkToForm(response.data);

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
      await loadPresentedWork();
    })();
  }, [isEdit, loadPresentedWork, loadPeople]);

  function handleModal() {
    showModal({
      title: "Adicionar autor",

      content: (
        <div style={{ padding: "2rem 0rem" }}>
          <p>Selecione um autor</p>

          <br />

          <AdminSelect
            options={[
              {
                value: "",
                label: "Autores",
              },
              ...people
                .filter((person) => !authors.includes(person.id))
                .map((person) => ({
                  value: person.id,
                  label: person.name,
                })),
            ]}
            onChange={(event) => {
              selectedAuthorIdRef.current = event.target.value;

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

      confirmDisabled: !selectedAuthorIdRef.current,

      onConfirm: () => {
        handleAddAuthor(selectedAuthorIdRef.current);
      },

      onCancel: () => {
        selectedAuthorIdRef.current = "";
      },
    });
  }

  function handleAddAuthor(personId: string) {
    if (authors.includes(personId)) return;

    setValue("authors", [...authors, personId], {
      shouldValidate: true,
      shouldDirty: true,
    });

    selectedAuthorIdRef.current = "";
  }

  function handleRemoveAuthor(personId: string) {
    setValue(
      "authors",
      authors.filter((id) => id !== personId),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  }

  async function onSubmit(data: PresentedWorkFormData) {
    try {
      if (isEdit) {
        //temp next line
        data.meetingId = data.meetingId === "" ? undefined : data.meetingId;
        await presentedWorksService.updateBySlug(slug!, data);

        showToast({
          title: "Apresentação atualizada",
          description: "Os dados foram atualizados com sucesso.",
          type: "success",
        });
      } else {
        await presentedWorksService.create(mapPresentedWorkToCreateDto(data));

        showToast({
          title: "Apresentação criada",
          description: "A apresentação foi cadastrada com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/apresentacoes-trabalhos");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: isEdit
          ? "Erro ao atualizar apresentação"
          : "Erro ao criar apresentação",
        description:
          message ?? "Não foi possível salvar os dados. Tente novamente.",
        type: "danger",
      });
    }
  }

  return (
    <Container>
      <AdminPageHeader
        title={isEdit ? "Editar apresentação" : "Nova apresentação"}
        subtitle="Cadastre ou atualize os dados da apresentação."
      />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <AdminFormCard>
          <AdminSection title="Dados Gerais">
            <AdminFormGrid>
              <AdminInput
                label="Título"
                placeholder="Título da apresentação"
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
              {/* temp */}
              <AdminSelect
                label="Relacionada com encontro"
                options={[]}
                // error={errors.institutionId?.message}
                // required
                // {...register("institutionId")}
              />
            </AdminFormGrid>
            <AdminInput
              label="Local"
              error={errors.location?.message}
              {...register("location")}
            />
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
            title="Autores"
            action={
              <AdminButton size="medium" type="button" onClick={handleModal}>
                <FiPlus />
              </AdminButton>
            }
          >
            <AuthorList>
              {authors.map((authorId) => {
                const author = people.find((person) => person.id === authorId);

                if (!author) return null;

                return (
                  <AuthorItem key={author.id}>
                    <span>{`${author.academicTitle?.abbreviation} ${author.name} - ${author.institution?.acronym} `}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveAuthor(author.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </AuthorItem>
                );
              })}
            </AuthorList>

            {errors.authors && (
              <AdminError>{errors.authors.message}</AdminError>
            )}
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection title="Imagens">
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

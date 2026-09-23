import { useNavigate, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import {
  Actions,
  AuthorItem,
  AuthorList,
  Container,
  Form,
  InstrumentTopWrapper,
} from "./styles";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminInput } from "../../../components/AdminInput";
import { AdminYearInput } from "../../../components/AdminYearInput";
import { AdminTextarea } from "../../../components/AdminTextarea";
import {
  FiArrowLeft,
  FiFileText,
  FiPlus,
  FiSave,
  FiTrash2,
} from "react-icons/fi";

import { peopleService } from "../../../services/people";
import type { PersonResponseDto } from "../../../dtos/people/PersonResponseDto";
import { AdminButton } from "../../../components/AdminButton";
import { useModal } from "../../../../hooks/useModal";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminError } from "../../../components/AdminError";
import {
  researchInstrumentSchema,
  type ResearchInstrumentFormData,
} from "../../../validations/researchInstrument.schema";
import { researchInstrumentDefaultValues } from "./defaultValues";
import { researchInstrumentsService } from "../../../services/researchInstruments";
import {
  mapResearchInstrumentToCreateDto,
  mapResearchInstrumentToForm,
} from "../../../mappers/researchInstrument.mapper";
import { AdminFileUpload } from "../../../components/AdminFileUpload";
import { researchInstrumentTypeOptions } from "../../../utils/researchInstrument";

export function ResearchInstrumentForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showModal, updateModal } = useModal();

  const selectedAuthorIdRef = useRef("");

  const [pdfPreview, setPdfPreview] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

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
  } = useForm<ResearchInstrumentFormData>({
    resolver: zodResolver(researchInstrumentSchema),
    defaultValues: researchInstrumentDefaultValues,
  });

  const _people = useWatch({
    control,
    name: "people",
  });

  const loadResearchInstrument = useCallback(async () => {
    if (!slug) return;

    const response = await researchInstrumentsService.getBySlug(slug);
    const formData = mapResearchInstrumentToForm(response.data);

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
        await loadResearchInstrument();
      }
    })();
  }, [isEdit, loadResearchInstrument, loadPeople]);

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
                .filter((person) => !(_people || []).includes(person.id))
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
    if (_people.includes(personId)) return;

    setValue("people", [..._people, personId], {
      shouldValidate: true,
      shouldDirty: true,
    });

    selectedAuthorIdRef.current = "";
  }

  function handleRemoveAuthor(personId: string) {
    setValue(
      "people",
      _people.filter((id) => id !== personId),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  }

  async function handleUploadPdf(file: File | null) {
    if (!file) return;

    if (isEdit) {
      const response = await researchInstrumentsService.updatePdf(slug!, file);

      setPdfPreview(response.data.url);

      setValue("pdfUrl", response.data.url);

      showToast({
        title: "PDF atualizado com sucesso",
        description: "O arquivo PDF foi atualizado.",
        type: "success",
      });

      return;
    }

    setPdfFile(file);
  }

  async function onSubmit(data: ResearchInstrumentFormData) {
    try {
      if (isEdit) {
        await researchInstrumentsService.updateBySlug(slug!, data);

        showToast({
          title: "Instrumento de pesquisa atualizado",
          description: "Os dados foram atualizados com sucesso.",
          type: "success",
        });
      } else {
        await researchInstrumentsService.create(
          mapResearchInstrumentToCreateDto(data),
          pdfFile!,
        );

        showToast({
          title: "Instrumento de pesquisa criado",
          description: "O instrumento de pesquisa foi cadastrado com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/instrumentos-pesquisa");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: isEdit
          ? "Erro ao atualizar instrumento de pesquisa"
          : "Erro ao criar instrumento de pesquisa",
        description:
          message ?? "Não foi possível salvar os dados. Tente novamente.",
        type: "danger",
      });
    }
  }

  return (
    <Container>
      <AdminPageHeader
        title={
          isEdit
            ? "Editar instrumento de pesquisa"
            : "Novo instrumento de pesquisa"
        }
        subtitle="Cadastre ou atualize os dados do instrumento de pesquisa."
      />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <InstrumentTopWrapper>
          <AdminFormGrid columns={1}>
            <AdminFileUpload
              icon={<FiFileText size={42} />}
              label="Arquivo PDF"
              fileUrl={pdfPreview}
              onChange={handleUploadPdf}
              accept="application/pdf"
            />
          </AdminFormGrid>

          <AdminFormCard>
            <AdminSection title="Dados Gerais">
              <AdminFormGrid>
                <AdminInput
                  label="Título"
                  placeholder="Título do instrumento de pesquisa"
                  required
                  error={errors.title?.message}
                  {...register("title")}
                />

                <AdminInput
                  label="Slug (Gerado automaticamente)"
                  value={slug ?? ""}
                  disabled
                />

                <AdminYearInput
                  label="Ano inicial"
                  placeholder="1882"
                  required
                  {...register("startYear", { valueAsNumber: true })}
                  error={errors.startYear?.message}
                />

                <AdminYearInput
                  label="Ano final"
                  placeholder="1940"
                  required
                  {...register("endYear", { valueAsNumber: true })}
                  error={errors.endYear?.message}
                />

                <AdminSelect
                  label="Tipo"
                  options={researchInstrumentTypeOptions}
                  error={errors.type?.message}
                  required
                  {...register("type")}
                />
              </AdminFormGrid>
            </AdminSection>
          </AdminFormCard>
        </InstrumentTopWrapper>

        <AdminFormCard>
          <AdminSection title="Links">
            <AdminInput
              label="Link do conteúdo"
              placeholder="Url do instrumento de pesquisa"
              required
              error={errors.externalUrl?.message}
              {...register("externalUrl")}
            />
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection title="Conteúdo">
            <AdminTextarea
              placeholder="Escreva o conteúdo..."
              error={errors.content?.message}
              {...register("content")}
            ></AdminTextarea>
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
              {_people.map((authorId) => {
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

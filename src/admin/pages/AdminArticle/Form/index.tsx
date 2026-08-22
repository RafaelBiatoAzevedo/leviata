import { useCallback, useEffect, useRef, useState } from "react";
import { articlesService } from "../../../services/articles";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { useModal } from "../../../../hooks/useModal";
import {
  articleSchema,
  type ArticleFormData,
} from "../../../validations/article.schema";
import { articleDefaultValues } from "./defaultValues";
import { mapArticleToForm } from "../../../mappers/article.mapper";
import { mapArticleToCreateDto } from "../../../mappers/articleToCreate.mapper";
import { AdminSelect } from "../../../components/AdminSelect";
import {
  Actions,
  AuthorItem,
  AuthorList,
  BookTopWrapper,
  Container,
  Form,
} from "./styles";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminImageUpload } from "../../../components/AdminImageUpload";
import {
  FiArrowLeft,
  FiFolder,
  FiPlus,
  FiSave,
  FiTrash2,
} from "react-icons/fi";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminInput } from "../../../components/AdminInput";
import { AdminYearInput } from "../../../components/AdminYearInput";
import { AdminTextarea } from "../../../components/AdminTextarea";
import { AdminButton } from "../../../components/AdminButton";
import { AdminError } from "../../../components/AdminError";
import type { PersonResponseDto } from "../../../dtos/people/PersonResponseDto";
import { peopleService } from "../../../services/people";
import { articleTypesOptions } from "../../../utils/articleTypes";

export function ArticleForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showModal, updateModal } = useModal();

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

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
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: articleDefaultValues,
  });

  const authors = useWatch({
    control,
    name: "authors",
  });

  const load = useCallback(async () => {
    if (!slug) return;

    const response = await articlesService.getBySlug(slug);
    const formData = mapArticleToForm(response.data);

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
      await load();
    })();
  }, [isEdit, load, loadPeople]);

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

  async function onSubmit(data: ArticleFormData) {
    try {
      if (isEdit) {
        await articlesService.updateBySlug(slug!, data);

        showToast({
          title: "Artigo atualizado",
          description: "Os dados foram atualizados com sucesso.",
          type: "success",
        });
      } else {
        await articlesService.create(mapArticleToCreateDto(data), coverFile!);

        showToast({
          title: "Artigo criado",
          description: "O artigo foi cadastrado com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/artigos");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: isEdit ? "Erro ao atualizar artigo" : "Erro ao criar artigo",
        description:
          message ?? "Não foi possível salvar os dados. Tente novamente.",
        type: "danger",
      });
    }
  }

  async function handleUploadCover(file: File | null) {
    if (!file) return;

    if (isEdit) {
      const response = await articlesService.updateCover(slug!, file);

      setCoverPreview(response.data.url);

      setValue("coverUrl", response.data.url);

      showToast({
        title: "Capa atualizada com sucesso",
        description: "A Capa do artigo foi atualizada.",
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
        title={isEdit ? "Editar artigo ou dossiê" : "Novo artigo ou dossiê"}
        subtitle="Cadastre ou atualize os dados do artigo."
      />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <BookTopWrapper>
          <AdminFormGrid columns={1}>
            <AdminImageUpload
              icon={<FiFolder size={42} />}
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
                  placeholder="Título do artigo ou dossiê"
                  required
                  error={errors.title?.message}
                  {...register("title")}
                />

                <AdminInput
                  label="Slug (Gerado automaticamente)"
                  value={slug ?? ""}
                  disabled
                />

                <AdminSelect
                  label="Tipo"
                  options={articleTypesOptions}
                  error={errors.type?.message}
                  required
                  {...register("type")}
                />

                <AdminInput
                  label="Volume"
                  placeholder="Volume do artigo ou dossiê"
                  error={errors.volume?.message}
                  {...register("volume")}
                />

                <AdminYearInput
                  label="Ano de publicação"
                  placeholder="ex: 2025"
                  required
                  {...register("year", { valueAsNumber: true })}
                  error={errors.year?.message}
                />

                <AdminInput
                  label="Editora"
                  placeholder="Nome da editora ou jornal"
                  required
                  error={errors.journal?.message}
                  {...register("journal")}
                />

                <AdminInput
                  label="Link"
                  placeholder="Url do artigo ou dossiê"
                  required
                  error={errors.externalUrl?.message}
                  {...register("externalUrl")}
                />

                <AdminInput
                  label="DOI"
                  placeholder="10.1234/exemplo.2025"
                  error={errors.doi?.message}
                  {...register("doi")}
                />
              </AdminFormGrid>
            </AdminSection>
          </AdminFormCard>
        </BookTopWrapper>

        <AdminFormCard>
          <AdminSection title="Resumo">
            <AdminTextarea
              placeholder="Escreva um resumo..."
              error={errors.summary?.message}
              {...register("summary")}
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

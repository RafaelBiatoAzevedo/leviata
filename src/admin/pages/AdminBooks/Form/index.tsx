import { useNavigate, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import {
  Actions,
  AuthorItem,
  AuthorList,
  BookTopWrapper,
  Container,
  Form,
} from "./styles";
import {
  bookSchema,
  type BookFormData,
} from "../../../validations/book.schema";
import { bookDefaultValues } from "./defaultValues";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import { booksService } from "../../../services/books";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminImageUpload } from "../../../components/AdminImageUpload";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminInput } from "../../../components/AdminInput";
import { AdminYearInput } from "../../../components/AdminYearInput";
import { AdminTextarea } from "../../../components/AdminTextarea";
import { FiArrowLeft, FiBook, FiPlus, FiSave, FiTrash2 } from "react-icons/fi";
import { mapBookToForm } from "../../../mappers/book.mapper";
import { mapBookToCreateDto } from "../../../mappers/bookToCreate.mapper";
import { peopleService } from "../../../services/people";
import type { PersonResponseDto } from "../../../dto/people/PersonResponseDto";
import { AdminButton } from "../../../components/AdminButton";
import { useModal } from "../../../../hooks/useModal";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminError } from "../../../components/AdminError";

export function BookForm() {
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

  // showToast({
  //   title: "Capa atualizada com sucesso",
  //   description: "A capa do livro foi atualizada.",
  //   type: "success",
  // });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: bookDefaultValues,
  });

  const authors = useWatch({
    control,
    name: "authors",
  });

  const loadBook = useCallback(async () => {
    if (!slug) return;

    const response = await booksService.getBySlug(slug);
    const formData = mapBookToForm(response.data);

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
      await loadBook();
    })();
  }, [isEdit, loadBook, loadPeople]);

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

  async function onSubmit(data: BookFormData) {
    try {
      if (isEdit) {
        await booksService.updateBySlug(slug!, data);

        showToast({
          title: "Livro atualizado",
          description: "Os dados foram atualizados com sucesso.",
          type: "success",
        });
      } else {
        await booksService.create(mapBookToCreateDto(data), coverFile!);

        showToast({
          title: "Livro criado",
          description: "O livro foi cadastrado com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/livros");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: isEdit ? "Erro ao atualizar livro" : "Erro ao criar livro",
        description:
          message ?? "Não foi possível salvar os dados. Tente novamente.",
        type: "danger",
      });
    }
  }

  async function handleUploadCover(file: File | null) {
    if (!file) return;

    if (isEdit) {
      const response = await booksService.updateCover(slug!, file);

      setCoverPreview(response.data.url);

      setValue("coverUrl", response.data.url);

      showToast({
        title: "Capa atualizada com sucesso",
        description: "A Capa do livro foi atualizada.",
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
        title={isEdit ? "Editar livro" : "Novo livro"}
        subtitle="Cadastre ou atualize os dados do livro."
      />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <BookTopWrapper>
          <AdminFormGrid columns={1}>
            <AdminImageUpload
              icon={<FiBook size={42} />}
              label="Capa"
              variant="portrait"
              imageUrl={coverPreview}
              onChange={handleUploadCover}
            />
          </AdminFormGrid>

          <AdminFormCard>
            <AdminSection title="Dados Gerais">
              <AdminFormGrid>
                <AdminInput
                  label="Título"
                  placeholder="Título do livro"
                  required
                  error={errors.title?.message}
                  {...register("title")}
                />

                <AdminInput
                  label="Slug (Gerado automaticamente)"
                  value={slug ?? ""}
                  disabled
                />

                <AdminInput
                  label="Subtítulo"
                  placeholder="Subtítulo do livro"
                  error={errors.subtitle?.message}
                  {...register("subtitle")}
                />

                <AdminInput
                  label="Isbn"
                  type="number"
                  placeholder="Número isbn"
                  error={errors.isbn?.message}
                  {...register("isbn")}
                />

                <AdminYearInput
                  label="Ano de publicação"
                  placeholder="2025"
                  required
                  {...register("year", { valueAsNumber: true })}
                  error={errors.year?.message}
                />

                <AdminInput
                  label="Editora"
                  placeholder="Nome da editora"
                  required
                  error={errors.publisher?.message}
                  {...register("publisher")}
                />

                <AdminInput
                  label="Link"
                  placeholder="Url do livro"
                  required
                  error={errors.externalUrl?.message}
                  {...register("externalUrl")}
                />
              </AdminFormGrid>
            </AdminSection>
          </AdminFormCard>
        </BookTopWrapper>

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

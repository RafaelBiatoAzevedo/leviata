import { AdminGallery } from "../../../components/AdminGallery";
import { useGallery } from "../../../hooks/useGallery";
import { useNavigate, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import {
  AuthorItem,
  AuthorList,
  SearchTopWrapper,
  Container,
  Form,
} from "./styles";
import {
  searchSchema,
  type SearchFormData,
} from "../../../validations/search.schema";
import { searchDefaultValues } from "./defaultValues";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import { researchService } from "../../../services/research";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminImageUpload } from "../../../components/AdminImageUpload";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminInput } from "../../../components/AdminInput";
import { AdminTextarea } from "../../../components/AdminTextarea";
import { FiSearch, FiPlus, FiTrash2 } from "react-icons/fi";
import { peopleService } from "../../../services/people";
import type { PersonResponseDto } from "../../../dtos/people/PersonResponseDto";
import { AdminButton } from "../../../components/AdminButton";
import { useModal } from "../../../../hooks/useModal";
import { AdminSelect } from "../../../components/AdminSelect";
import { AdminError } from "../../../components/AdminError";
import {
  mapSearchToCreateDto,
  mapSearchToForm,
} from "../../../mappers/search.mapper";
import AdminFormActions from "../../../components/AdminFormActions";

export function SearchForm() {
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
  const [recordId, setRecordId] = useState<string | null>(null);
  const gallery = useGallery("research");
  const loadGallery = gallery.load;
  const supportsGallery = useGallery("research", "supports");
  const loadSupportsGallery = supportsGallery.load;

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: searchDefaultValues,
  });

  const _people = useWatch({
    control,
    name: "people",
  });

  const loadSearch = useCallback(async () => {
    if (!slug) return;

    const response = await researchService.getBySlug(slug);
    const formData = mapSearchToForm(response.data);
    setRecordId(response.data.id);
    loadGallery(response.data.images);
    loadSupportsGallery(response.data.supports);

    if (response.data.coverUrl) {
      setCoverPreview(response.data.coverUrl);
    }

    reset(formData);
  }, [reset, slug, loadGallery, loadSupportsGallery]);

  const loadPeople = useCallback(async () => {
    const response = await peopleService.getAll();

    setPeople(response.data);
  }, []);

  useEffect(() => {
    (async () => {
      await loadPeople();

      if (isEdit) {
        await loadSearch();
      }
    })();
  }, [isEdit, loadSearch, loadPeople]);

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
    if ((_people || []).includes(personId)) return;

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

  async function onSubmit(data: SearchFormData) {
    try {
      if (isEdit && !recordId)
        throw new Error("Aguarde o carregamento do registro antes de salvar.");
      const saved = recordId
        ? await researchService.updateById(recordId, mapSearchToCreateDto(data))
        : await researchService.create(
            mapSearchToCreateDto(data),
            coverFile ?? undefined,
          );
      setRecordId(saved.data.id);
      await gallery.save(saved.data.id);
      await supportsGallery.save(saved.data.id);

      if (isEdit) {
        showToast({
          title: "Pesquisa atualizado",
          description: "Os dados foram atualizados com sucesso.",
          type: "success",
        });
      } else {
        showToast({
          title: "Pesquisa criado",
          description: "O pesquisa foi cadastrado com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/pesquisas");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: isEdit ? "Erro ao atualizar pesquisa" : "Erro ao criar pesquisa",
        description:
          message ?? "Não foi possível salvar os dados. Tente novamente.",
        type: "danger",
      });
    }
  }

  async function handleUploadCover(file: File | null) {
    if (!file) return;

    if (isEdit) {
      const response = await researchService.updateCover(slug!, file);

      setCoverPreview(response.data.url);

      setValue("coverUrl", response.data.url);

      showToast({
        title: "Capa atualizada com sucesso",
        description: "A Capa do pesquisa foi atualizada.",
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
        title={isEdit ? "Editar pesquisa" : "Nova pesquisa"}
        subtitle="Cadastre ou atualize os dados da pesquisa."
      />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <SearchTopWrapper>
          <AdminFormGrid columns={1}>
            <AdminImageUpload
              icon={<FiSearch size={42} />}
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
                  placeholder="Título do pesquisa"
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
            </AdminSection>
          </AdminFormCard>
        </SearchTopWrapper>

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
            title="Participantes"
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

        <AdminGallery
          gallery={gallery}
          title="Imagens"
          disabled={isSubmitting}
        />

        <AdminGallery
          gallery={supportsGallery}
          title="Apoiadores"
          disabled={isSubmitting}
        />

        <AdminFormActions isSubmitting={isSubmitting} />
      </Form>
    </Container>
  );
}

import { useNavigate, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { NewsTopWrapper, Container, Form } from "./styles";
import {
  newsSchema,
  type NewsFormData,
} from "../../../validations/news.schema";
import { newsDefaultValues } from "./defaultValues";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import { newsService } from "../../../services/news";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminImageUpload } from "../../../components/AdminImageUpload";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminInput } from "../../../components/AdminInput";
import { AdminTextarea } from "../../../components/AdminTextarea";
import {
  mapNewsToCreateDto,
  mapNewsToForm,
} from "../../../mappers/news.mapper";
import { AdminSelect } from "../../../components/AdminSelect";
import { BiNews } from "react-icons/bi";
import { newsCategoryOptions } from "../../../utils/newsCategory";
import { AdminDateInput } from "../../../components/AdminDateInput";
import { AdminSwitch } from "../../../components/AdminSwitch";
import { newsRelatedTypeOptions } from "../../../utils/newsRelatedType";
import AdminFormActions from "../../../components/AdminFormActions";
import { AdminError } from "../../../components/AdminError";
import { newsErrorDetails } from "../../../utils/newsErrors";
import {
  loadNewsRelatedOptions,
  type NewsRelatedOption,
} from "../../../services/newsRelated";
import type { TNewsRelatedType } from "../../../types/TNewsRelatedType";
import { AdminButton } from "../../../components/AdminButton";

export function NewsForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [relatedCatalog, setRelatedCatalog] = useState<{
    type: TNewsRelatedType | null;
    options: NewsRelatedOption[];
    loading: boolean;
    error: string;
  }>({ type: null, options: [], loading: false, error: "" });
  const [relatedRetry, setRelatedRetry] = useState(0);

  const { slug } = useParams();

  const isEdit = Boolean(slug);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: newsDefaultValues,
  });
  const [isInternal, relatedType, relatedId] = useWatch({
    control,
    name: ["isInternal", "relatedType", "relatedId"],
  });
  const relatedOptions =
    relatedCatalog.type === relatedType ? relatedCatalog.options : [];
  const relatedLoading =
    !!isInternal &&
    !!relatedType &&
    (relatedCatalog.type !== relatedType || relatedCatalog.loading);
  const relatedError =
    relatedCatalog.type === relatedType ? relatedCatalog.error : "";

  const loadNews = useCallback(async () => {
    if (!slug) return;

    const response = await newsService.getBySlug(slug);
    const formData = mapNewsToForm(response.data);

    if (response.data.coverUrl) {
      setCoverPreview(response.data.coverUrl);
    }

    reset(formData);
  }, [reset, slug]);

  useEffect(() => {
    (async () => {
      if (isEdit) await loadNews();
    })();
  }, [isEdit, loadNews]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadRelated() {
      if (!isInternal || !relatedType) {
        setRelatedCatalog({
          type: null,
          options: [],
          loading: false,
          error: "",
        });
        return;
      }
      setRelatedCatalog({
        type: relatedType,
        options: [],
        loading: true,
        error: "",
      });
      try {
        const options = await loadNewsRelatedOptions(
          relatedType,
          controller.signal,
        );
        if (!controller.signal.aborted)
          setRelatedCatalog({
            type: relatedType,
            options,
            loading: false,
            error: "",
          });
      } catch {
        if (!controller.signal.aborted)
          setRelatedCatalog({
            type: relatedType,
            options: [],
            loading: false,
            error: "Não foi possível carregar os itens desta categoria.",
          });
      }
    }
    void loadRelated();
    return () => controller.abort();
  }, [isInternal, relatedType, relatedRetry]);

  async function onSubmit(data: NewsFormData) {
    clearErrors("root.server");
    if (
      data.isInternal &&
      (relatedLoading ||
        relatedError ||
        !relatedOptions.some((option) => option.value === data.relatedId))
    ) {
      setError(
        "relatedId",
        {
          type: "validate",
          message: relatedLoading
            ? "Aguarde o carregamento dos itens."
            : relatedError || "Selecione um item disponível nesta categoria.",
        },
        { shouldFocus: true },
      );
      return;
    }

    try {
      const dto = mapNewsToCreateDto(data);
      if (isEdit) {
        await newsService.updateBySlug(slug!, dto);

        showToast({
          title: "Notícia atualizada",
          description: "Os dados foram atualizados com sucesso.",
          type: "success",
        });
      } else {
        await newsService.create(dto, coverFile ?? undefined);

        showToast({
          title: "Notícia criada",
          description: "A notícia foi cadastrada com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/noticias");
    } catch (error) {
      const { message, fieldErrors } = newsErrorDetails(error);

      fieldErrors.forEach(({ field, message }, index) => {
        setError(
          field,
          { type: "server", message },
          { shouldFocus: index === 0 },
        );
      });
      setError("root.server", { type: "server", message });

      showToast({
        title: isEdit ? "Erro ao atualizar notícia" : "Erro ao criar notícia",
        description: message,
        type: "danger",
      });
    }
  }

  async function handleUploadCover(file: File | null) {
    if (!file) return;

    if (isEdit) {
      const response = await newsService.updateCover(slug!, file);

      setCoverPreview(response.data.url);

      setValue("coverUrl", response.data.url);

      showToast({
        title: "Capa atualizada com sucesso",
        description: "A Capa do notícia foi atualizada.",
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
        title={isEdit ? "Editar notícia" : "Nova notícia"}
        subtitle="Cadastre ou atualize os dados da notícia."
      />

      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <NewsTopWrapper>
          <AdminFormGrid columns={1}>
            <AdminImageUpload
              icon={<BiNews size={42} />}
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
                  placeholder="Título do notícia"
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
                  label="Categoria"
                  options={newsCategoryOptions}
                  required
                  error={errors.category?.message}
                  {...register("category")}
                ></AdminSelect>
              </AdminFormGrid>
            </AdminSection>
          </AdminFormCard>
        </NewsTopWrapper>

        <AdminFormCard>
          <AdminSection title="Destino da notícia">
            <AdminSwitch
              label="Interna"
              {...register("isInternal", {
                onChange: () => {
                  setValue("externalUrl", "");
                  setValue("relatedType", null);
                  setValue("relatedId", "");
                  clearErrors(["externalUrl", "relatedType", "relatedId"]);
                  clearErrors("root.server");
                },
              })}
            />

            {isInternal ? (
              <>
                <AdminFormGrid>
                  <AdminSelect
                    id="news-related-type"
                    label="Categoria"
                    options={[
                      { value: "", label: "Selecione uma categoria" },
                      ...newsRelatedTypeOptions,
                    ]}
                    required
                    error={errors.relatedType?.message}
                    {...register("relatedType", {
                      onChange: () => {
                        setValue("relatedId", "", { shouldDirty: true });
                        clearErrors(["relatedType", "relatedId"]);
                        clearErrors("root.server");
                      },
                    })}
                    value={relatedType ?? ""}
                  ></AdminSelect>

                  <AdminSelect
                    label="Relacionada com"
                    required
                    disabled={!relatedType || relatedLoading || !!relatedError}
                    error={errors.relatedId?.message || relatedError}
                    {...register("relatedId")}
                    value={relatedId ?? ""}
                    options={[
                      {
                        value: "",
                        label: !relatedType
                          ? "Selecione a categoria primeiro"
                          : relatedLoading
                            ? "Carregando itens..."
                            : relatedError
                              ? "Itens indisponíveis"
                              : !relatedOptions.length
                                ? "Nenhum item cadastrado nesta categoria"
                                : "Selecione o conteúdo relacionado",
                      },
                      ...relatedOptions,
                    ]}
                  ></AdminSelect>
                </AdminFormGrid>
                {relatedError && (
                  <AdminButton
                    type="button"
                    variant="outline"
                    onClick={() => setRelatedRetry((value) => value + 1)}
                  >
                    Tentar novamente
                  </AdminButton>
                )}
              </>
            ) : (
              <AdminInput
                label="Link"
                type="url"
                inputMode="url"
                placeholder="https://exemplo.com/noticia"
                required
                aria-invalid={!!errors.externalUrl}
                error={errors.externalUrl?.message}
                {...register("externalUrl")}
              />
            )}
          </AdminSection>
        </AdminFormCard>

        <AdminFormCard>
          <AdminSection title="Resumo">
            <AdminTextarea
              placeholder="Escreva uma breve descrição..."
              error={errors.description?.message}
              {...register("description")}
            ></AdminTextarea>
          </AdminSection>
        </AdminFormCard>

        <AdminError>{errors.root?.server?.message}</AdminError>
        <AdminFormActions isSubmitting={isSubmitting} />
      </Form>
    </Container>
  );
}

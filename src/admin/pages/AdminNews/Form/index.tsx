import { useNavigate, useParams } from "react-router-dom";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import {
  Actions,
  // AuthorItem,
  // AuthorList,
  NewsTopWrapper,
  Container,
  Form,
} from "./styles";
import {
  newsSchema,
  type NewsFormData,
} from "../../../validations/news.schema";
import { newsDefaultValues } from "./defaultValues";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import { newsService } from "../../../services/news";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminImageUpload } from "../../../components/AdminImageUpload";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminSection } from "../../../components/AdminSection";
import { AdminInput } from "../../../components/AdminInput";
import { AdminTextarea } from "../../../components/AdminTextarea";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { mapNewsToForm } from "../../../mappers/news.mapper";
import { AdminButton } from "../../../components/AdminButton";
import { AdminSelect } from "../../../components/AdminSelect";
import { mapNewsToCreateDto } from "../../../mappers/newsToCreate.mapper";
import { BiNews } from "react-icons/bi";
import { newsCategoryOptions } from "../../../utils/newsCategory";
import { AdminDateInput } from "../../../components/AdminDateInput";
import { AdminSwitch } from "../../../components/AdminSwitch";
import { newsRelatedTypeOptions } from "../../../utils/newsRelatedType";

export function NewsForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  //const { showModal, updateModal } = useModal();

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  const { slug } = useParams();

  const isEdit = Boolean(slug);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: newsDefaultValues,
  });

  const loadNews = useCallback(async () => {
    if (!slug) return;

    const response = await newsService.getBySlug(slug);
    const formData = mapNewsToForm(response.data);

    if (response.data.coverUrl) {
      setCoverPreview(response.data.coverUrl);
    }

    reset(formData);
  }, [reset, slug]);

  const loadEventRelated = useCallback(async () => {
    //load events, jury, meeting ....
  }, []);

  useEffect(() => {
    (async () => {
      await loadEventRelated();
    })();

    if (!isEdit) return;

    (async () => {
      await loadNews();
    })();
  }, [isEdit, loadNews, loadEventRelated]);

  async function onSubmit(data: NewsFormData) {
    try {
      if (isEdit) {
        await newsService.updateBySlug(slug!, data);

        showToast({
          title: "Notícia atualizado",
          description: "Os dados foram atualizados com sucesso.",
          type: "success",
        });
      } else {
        await newsService.create(mapNewsToCreateDto(data), coverFile!);

        showToast({
          title: "Notícia criada",
          description: "O notícia foi cadastrada com sucesso.",
          type: "success",
        });
      }

      navigate("/admin/noticias");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";

      showToast({
        title: isEdit ? "Erro ao atualizar notícia" : "Erro ao criar notícia",
        description:
          message ?? "Não foi possível salvar os dados. Tente novamente.",
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

      <Form onSubmit={handleSubmit(onSubmit)}>
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
          <AdminSection title="Relacionamento">
            <AdminSwitch label="Interna" required {...register("isInternal")} />

            <AdminFormGrid>
              <AdminSelect
                label="Categoria"
                options={newsRelatedTypeOptions}
                required
                error={errors.relatedType?.message}
                {...register("relatedType")}
              ></AdminSelect>

              <AdminSelect
                label="Relacionada com"
                required
                error={errors.relatedId?.message}
                {...register("relatedId")}
                options={newsRelatedTypeOptions}
              ></AdminSelect>
            </AdminFormGrid>

            <AdminInput
              label="Link"
              placeholder="Url do notícia"
              required
              error={errors.externalUrl?.message}
              {...register("externalUrl")}
            />
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

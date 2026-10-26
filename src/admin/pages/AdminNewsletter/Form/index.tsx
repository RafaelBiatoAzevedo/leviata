import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { AdminDateInput } from "../../../components/AdminDateInput";
import AdminFormActions from "../../../components/AdminFormActions";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminImageUpload } from "../../../components/AdminImageUpload";
import { AdminInput } from "../../../components/AdminInput";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminSection } from "../../../components/AdminSection";
import { AdminSplitLayout } from "../../../components/AdminResponsive";
import { AdminTextarea } from "../../../components/AdminTextarea";
import { AdminSwitch } from "../../../components/AdminSwitch";
import { newsletterService } from "../../../services/newsletter";
import { newsletterMailService } from "../../../services/newsletterMail";
import type { NewsletterMailSettings } from "../../../dtos/newsletter/NewsletterMailDto";
import type { NewsletterResponseDto } from "../../../dtos/newsletter/NewsletterResponseDto";
import {
  newsletterMailError,
  newsletterSendAvailability,
} from "../../../utils/newsletterDelivery";
import {
  newsletterSchema,
  type NewsletterFormData,
} from "../../../validations/newsletter.schema";
import { Container, Form } from "./styles";

const defaultValues: NewsletterFormData = {
  title: "",
  subject: "",
  htmlContent: "",
  coverUrl: "",
  pdfUrl: "",
  publishedAt: "",
  sentAt: "",
};
const dateValue = (value: string | null) => (value ? value.slice(0, 10) : "");

export function NewsletterForm() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { showToast } = useToast();
  const isEdit = Boolean(slug);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [sendAfterSave, setSendAfterSave] = useState(false);
  const [mailSettings, setMailSettings] =
    useState<NewsletterMailSettings | null>();
  const saving = useRef(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues,
  });
  const coverUrl = useWatch({ control, name: "coverUrl" });
  const publishedAt = useWatch({ control, name: "publishedAt" });
  const sentAt = useWatch({ control, name: "sentAt" });
  const mailUnavailable = newsletterSendAvailability(
    mailSettings,
    "2000-01-01",
  );
  const sendUnavailable = newsletterSendAvailability(
    mailSettings,
    publishedAt,
    sentAt,
  );

  useEffect(() => {
    if (isEdit) return;
    const controller = new AbortController();
    newsletterMailService
      .settings(controller.signal)
      .then(({ data }) => {
        if (!controller.signal.aborted) setMailSettings(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setMailSettings(null);
      });
    return () => controller.abort();
  }, [isEdit]);

  useEffect(() => {
    if (!isEdit || !slug) return;
    let active = true;
    newsletterService
      .getBySlug(slug)
      .then(({ data }) => {
        if (!active) return;
        reset({
          title: data.title,
          subject: data.subject,
          htmlContent: data.htmlContent,
          coverUrl: data.coverUrl ?? "",
          pdfUrl: data.pdfUrl ?? "",
          publishedAt: dateValue(data.publishedAt),
          sentAt: dateValue(data.sentAt),
        });
        setCoverFile(null);
        setCoverPreview("");
      })
      .catch((error) => {
        if (active)
          showToast({
            title: "Erro ao carregar newsletter",
            description:
              error instanceof Error ? error.message : "Tente novamente.",
            type: "danger",
          });
      });
    return () => {
      active = false;
    };
  }, [isEdit, slug, reset, showToast]);

  async function handleUploadCover(file: File | null) {
    if (!file) return;
    if (isEdit) {
      const { data } = await newsletterService.updateCover(slug!, file);
      setValue("coverUrl", data.url, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setCoverPreview("");
      showToast({
        title: "Capa atualizada",
        description: "O recorte da capa foi salvo.",
        type: "success",
      });
      return data.url;
    }
    const url = URL.createObjectURL(file);
    setCoverFile(file);
    setCoverPreview(url);
    setValue("coverUrl", "", { shouldDirty: true, shouldValidate: true });
    return url;
  }

  async function onSubmit(form: NewsletterFormData) {
    if (saving.current) return;
    if (!isEdit && sendAfterSave && sendUnavailable) {
      setError("publishedAt", { type: "validate", message: sendUnavailable });
      return;
    }
    saving.current = true;
    const data = Object.fromEntries(
      Object.entries(form).filter(
        ([key, value]) => key !== "sentAt" && value !== "",
      ),
    ) as NewsletterFormData;
    let saved: NewsletterResponseDto;
    try {
      const response = isEdit
        ? await newsletterService.updateBySlug(slug!, data)
        : await newsletterService.create(data, coverFile ?? undefined);
      saved = response.data;
    } catch (error) {
      saving.current = false;
      showToast({
        title: "Erro ao salvar newsletter",
        description:
          error instanceof Error ? error.message : "Tente novamente.",
        type: "danger",
      });
      return;
    }
    try {
      if (!isEdit && sendAfterSave) {
        await newsletterMailService.send(saved.id);
      }
      showToast({
        title: isEdit ? "Newsletter atualizada" : "Newsletter criada",
        description:
          !isEdit && sendAfterSave
            ? "Edição salva e envio iniciado para os inscritos. Acompanhe as entregas nesta tela."
            : "Os dados foram salvos com sucesso.",
        type: "success",
      });
    } catch (error) {
      showToast({
        title: "Newsletter salva; confira o envio",
        description: newsletterMailError(error),
        type: "danger",
      });
    } finally {
      saving.current = false;
      navigate(
        isEdit
          ? "/admin/newsletter"
          : `/admin/newsletter/${saved.slug}${sendAfterSave ? "#envio" : ""}`,
      );
    }
  }

  return (
    <Container>
      <AdminPageHeader
        title={isEdit ? "Editar newsletter" : "Nova newsletter"}
        subtitle="Cadastre ou atualize os dados da newsletter."
      />
      <Form onSubmit={(event) => handleSubmit(onSubmit)(event)}>
        <AdminSplitLayout>
          <AdminFormGrid columns={1}>
            <AdminImageUpload
              label="Capa"
              variant="portrait"
              imageUrl={coverPreview || coverUrl || ""}
              onChange={handleUploadCover}
              error={errors.coverUrl?.message}
            />
          </AdminFormGrid>
          <AdminFormCard>
            <AdminSection title="Dados gerais">
              <AdminFormGrid>
                <AdminInput
                  label="Título"
                  required
                  error={errors.title?.message}
                  {...register("title")}
                />
                <AdminInput
                  label="Slug (gerado automaticamente)"
                  value={slug ?? ""}
                  disabled
                />
                <AdminInput
                  label="Assunto"
                  required
                  error={errors.subject?.message}
                  {...register("subject")}
                />
                <AdminInput
                  label="URL da capa"
                  labelHint="Opcional, para usar uma imagem por link"
                  error={errors.coverUrl?.message}
                  {...register("coverUrl", {
                    onChange: () => {
                      setCoverFile(null);
                      setCoverPreview("");
                    },
                  })}
                />
                <AdminInput
                  label="URL do PDF"
                  error={errors.pdfUrl?.message}
                  {...register("pdfUrl")}
                />
              </AdminFormGrid>
            </AdminSection>
          </AdminFormCard>
        </AdminSplitLayout>
        <AdminFormCard>
          <AdminSection title="Publicação">
            <AdminFormGrid>
              <AdminDateInput
                label="Data de publicação"
                error={errors.publishedAt?.message}
                {...register("publishedAt")}
              />
              <AdminInput
                label="Último envio"
                value={sentAt || "Ainda não enviado"}
                description="Atualizado automaticamente quando o envio aos inscritos é concluído."
                readOnly
              />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>
        <AdminFormCard>
          <AdminSection title="Conteúdo HTML">
            <AdminTextarea
              placeholder="Insira o conteúdo HTML da newsletter"
              error={errors.htmlContent?.message}
              {...register("htmlContent")}
            />
          </AdminSection>
        </AdminFormCard>
        {!isEdit && (
          <AdminFormCard>
            <AdminSection title="Envio aos inscritos">
              <AdminSwitch
                label="Enviar para todos os inscritos após salvar"
                checked={sendAfterSave}
                onChange={(event) => setSendAfterSave(event.target.checked)}
                disabled={isSubmitting || !!mailUnavailable}
                description={
                  mailSettings === undefined
                    ? "Verificando a disponibilidade do envio por e-mail…"
                    : sendUnavailable ||
                      "A edição será enviada aos cadastros ativos que autorizaram e-mail. Você também pode deixar esta opção desmarcada e enviar depois."
                }
              />
            </AdminSection>
          </AdminFormCard>
        )}
        <AdminFormActions isSubmitting={isSubmitting} />
      </Form>
    </Container>
  );
}

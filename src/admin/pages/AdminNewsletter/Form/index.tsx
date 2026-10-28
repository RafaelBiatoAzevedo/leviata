import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FiCode, FiEye, FiFileText, FiLoader } from "react-icons/fi";
import { useToast } from "../../../../hooks/useToast";
import { AdminDateInput } from "../../../components/AdminDateInput";
import { AdminButton } from "../../../components/AdminButton";
import { AdminNewsletterPreview } from "../../../components/AdminNewsletterPreview";
import { NewsletterComposer } from "../../../components/NewsletterComposer";
import { AdminError } from "../../../components/AdminError";
import { defaultNewsletterContent } from "../../../utils/newsletterComposer";
import { newsletterCoverDataUrl } from "../../../utils/newsletterPreview";
import type { NewsletterContentDto } from "../../../dtos/newsletter/NewsletterContentDto";
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
import { Advanced, Container, Form, ModeNotice, PdfNotice } from "./styles";

const defaultValues: NewsletterFormData = {
  title: "",
  subject: "",
  htmlContent: "",
  coverUrl: "",
  publishedAt: "",
  sentAt: "",
  contentData: defaultNewsletterContent(),
};
const dateValue = (value: string | null) => (value ? value.slice(0, 10) : "");

export function NewsletterForm() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { showToast } = useToast();
  const isEdit = Boolean(slug);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [preview, setPreview] = useState<NewsletterFormData | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [switchingMode, setSwitchingMode] = useState(false);
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
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues,
  });
  const coverUrl = useWatch({ control, name: "coverUrl" });
  const publishedAt = useWatch({ control, name: "publishedAt" });
  const sentAt = useWatch({ control, name: "sentAt" });
  const contentData =
    useWatch({ control, name: "contentData" }) ?? defaultValues.contentData!;
  const htmlContent = useWatch({ control, name: "htmlContent" });
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
          htmlContent: data.contentData?.customHtml ?? data.htmlContent,
          contentData: data.contentData ?? {
            ...defaultNewsletterContent(),
            mode: "html",
            customHtml: data.htmlContent,
          },
          coverUrl: data.coverUrl ?? "",
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

  function updateContent(
    update: (current: NewsletterContentDto) => NewsletterContentDto,
  ) {
    setValue(
      "contentData",
      update(getValues().contentData ?? defaultNewsletterContent()),
      { shouldDirty: true },
    );
  }

  async function openPreview() {
    if (previewing) return;
    setPreviewing(true);
    const current = getValues();
    const draft = {
      ...current,
      coverUrl: coverPreview || current.coverUrl || "",
    };
    try {
      // A sandboxed reader cannot resolve the editor's temporary blob URL.
      // Render a placeholder on the API, then embed the local crop in the preview only.
      const localCover = coverFile
        ? await newsletterCoverDataUrl(coverFile)
        : null;
      const { data } = await newsletterService.preview({
        ...draft,
        coverUrl: localCover ? "{{newsletterCover}}" : draft.coverUrl,
      });
      setPreview({
        ...draft,
        htmlContent: localCover
          ? data.htmlContent.replaceAll("{{newsletterCover}}", localCover)
          : data.htmlContent,
      });
    } catch {
      showToast({
        title: "Não foi possível abrir a prévia",
        description:
          "Confira a conexão e os links das imagens e tente novamente.",
        type: "danger",
      });
    } finally {
      setPreviewing(false);
    }
  }

  async function enableHtml(regenerate = false) {
    const previous = getValues().contentData?.customHtml;
    if (previous && !regenerate) {
      setValue("htmlContent", previous, { shouldDirty: true });
      updateContent((current) => ({ ...current, mode: "html" }));
      return;
    }
    setSwitchingMode(true);
    try {
      const { data } = await newsletterService.preview({
        ...getValues(),
        coverUrl: "{{newsletterCover}}",
      });
      setValue("htmlContent", data.htmlContent, { shouldDirty: true });
      updateContent((current) => ({
        ...current,
        mode: "html",
        customHtml: data.htmlContent,
      }));
    } catch {
      showToast({
        title: "Não foi possível gerar o código",
        description: "Tente novamente em instantes.",
        type: "danger",
      });
    } finally {
      setSwitchingMode(false);
    }
  }

  function enableVisual() {
    if (
      !window.confirm(
        "O editor visual usará os campos das seções para gerar a edição. As alterações feitas diretamente no HTML ficarão guardadas no modo avançado. Continuar?",
      )
    )
      return;
    updateContent((current) => ({ ...current, mode: "visual" }));
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
              allowVariantSelection
              formatPlacement="left"
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
                  labelHint="Título do e-mail recebido pelos inscritos"
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
                <PdfNotice>
                  <FiFileText aria-hidden="true" />
                  <p>
                    O PDF será gerado automaticamente ao salvar, com o mesmo
                    conteúdo da edição, e acompanhará o e-mail como anexo.
                  </p>
                </PdfNotice>
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
                labelHint="Atualizado automaticamente quando o envio aos inscritos é concluído."
                readOnly
              />
            </AdminFormGrid>
          </AdminSection>
        </AdminFormCard>
        <AdminError>
          {errors.contentData
            ? "Revise os campos do conteúdo: use links completos e respeite os limites de texto."
            : errors.htmlContent?.message}
        </AdminError>
        {contentData.mode === "visual" ? (
          <NewsletterComposer
            value={contentData}
            onChange={updateContent}
            errors={errors.contentData}
            disabled={isSubmitting || switchingMode}
          />
        ) : (
          <AdminFormCard>
            <AdminSection title="Código HTML da edição">
              <ModeNotice>
                <FiCode aria-hidden="true" />
                <div>
                  <strong>Edição avançada</strong>
                  <p>
                    O código desta edição está preservado. Para criar com campos
                    simples, use o editor visual.
                  </p>
                </div>
                <AdminButton
                  type="button"
                  variant="outline"
                  onClick={enableVisual}
                >
                  Usar editor visual
                </AdminButton>
              </ModeNotice>
              <AdminTextarea
                id="newsletter-html-source"
                label="Código HTML"
                value={htmlContent ?? ""}
                spellCheck={false}
                rows={18}
                error={errors.htmlContent?.message}
                onChange={(event) => {
                  setValue("htmlContent", event.target.value, {
                    shouldDirty: true,
                  });
                  updateContent((current) => ({
                    ...current,
                    customHtml: event.target.value,
                  }));
                }}
              />
            </AdminSection>
          </AdminFormCard>
        )}
        {contentData.mode === "visual" && (
          <Advanced>
            <summary>
              <FiCode aria-hidden="true" /> Avançado · editar código HTML
            </summary>
            <p>
              O HTML é gerado automaticamente. Use esta opção se precisar
              personalizar o código; os campos da edição continuarão guardados.
            </p>
            <AdminButton
              type="button"
              variant="outline"
              disabled={isSubmitting || switchingMode}
              onClick={() => void enableHtml()}
            >
              <FiCode aria-hidden="true" />
              {switchingMode
                ? "Gerando código…"
                : contentData.customHtml
                  ? "Retomar código guardado"
                  : "Editar código HTML"}
            </AdminButton>
            {contentData.customHtml && (
              <AdminButton
                type="button"
                variant="outline"
                disabled={isSubmitting || switchingMode}
                onClick={() => void enableHtml(true)}
              >
                Gerar código com a versão visual atual
              </AdminButton>
            )}
          </Advanced>
        )}
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
        <AdminFormActions isSubmitting={isSubmitting}>
          <AdminButton
            type="button"
            variant="outline"
            disabled={isSubmitting || previewing || switchingMode}
            aria-haspopup="dialog"
            onClick={() => void openPreview()}
          >
            {previewing ? (
              <FiLoader aria-hidden="true" />
            ) : (
              <FiEye aria-hidden="true" />
            )}
            {previewing ? "Abrindo prévia…" : "Prévia"}
          </AdminButton>
        </AdminFormActions>
      </Form>
      {preview && (
        <AdminNewsletterPreview
          data={preview}
          onClose={() => setPreview(null)}
        />
      )}
    </Container>
  );
}

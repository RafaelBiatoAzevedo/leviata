import { useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { AdminDateInput } from "../../../components/AdminDateInput";
import AdminFormActions from "../../../components/AdminFormActions";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminFormGrid } from "../../../components/AdminFormGrid";
import { AdminInput } from "../../../components/AdminInput";
import { AdminPageHeader } from "../../../components/AdminPageHeader";
import { AdminSection } from "../../../components/AdminSection";
import { AdminTextarea } from "../../../components/AdminTextarea";
import { newsletterService } from "../../../services/newsletter";
import { newsletterSchema, type NewsletterFormData } from "../../../validations/newsletter.schema";
import { Container, Form } from "./styles";

const defaultValues: NewsletterFormData = {
  title: "", subject: "", htmlContent: "", coverUrl: "", pdfUrl: "", publishedAt: "", sentAt: "",
};

const dateValue = (value: string | null) => value ? value.slice(0, 10) : "";

export function NewsletterForm() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { showToast } = useToast();
  const isEdit = Boolean(slug);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema), defaultValues,
  });

  const load = useCallback(async () => {
    if (!slug) return;
    const { data } = await newsletterService.getBySlug(slug);
    reset({
      title: data.title, subject: data.subject, htmlContent: data.htmlContent,
      coverUrl: data.coverUrl ?? "", pdfUrl: data.pdfUrl ?? "",
      publishedAt: dateValue(data.publishedAt), sentAt: dateValue(data.sentAt),
    });
  }, [reset, slug]);

  useEffect(() => { if (isEdit) void load(); }, [isEdit, load]);

  async function onSubmit(form: NewsletterFormData) {
    const data = Object.fromEntries(Object.entries(form).filter(([, value]) => value !== "")) as NewsletterFormData;
    try {
      if (isEdit) await newsletterService.updateBySlug(slug!, data);
      else await newsletterService.create(data);
      showToast({ title: isEdit ? "Newsletter atualizada" : "Newsletter criada", description: "Os dados foram salvos com sucesso.", type: "success" });
      navigate("/admin/newsletter");
    } catch (error) {
      showToast({ title: "Erro ao salvar newsletter", description: error instanceof Error ? error.message : "Tente novamente.", type: "danger" });
    }
  }

  return <Container>
    <AdminPageHeader title={isEdit ? "Editar newsletter" : "Nova newsletter"} subtitle="Cadastre ou atualize os dados da newsletter." />
    <Form onSubmit={handleSubmit(onSubmit)}>
      <AdminFormCard><AdminSection title="Dados gerais"><AdminFormGrid>
        <AdminInput label="Título" required error={errors.title?.message} {...register("title")} />
        <AdminInput label="Slug (gerado automaticamente)" value={slug ?? ""} disabled />
        <AdminInput label="Assunto" required error={errors.subject?.message} {...register("subject")} />
        <AdminInput label="URL da capa" error={errors.coverUrl?.message} {...register("coverUrl")} />
        <AdminInput label="URL do PDF" error={errors.pdfUrl?.message} {...register("pdfUrl")} />
      </AdminFormGrid></AdminSection></AdminFormCard>
      <AdminFormCard><AdminSection title="Publicação"><AdminFormGrid>
        <AdminDateInput label="Data de publicação" error={errors.publishedAt?.message} {...register("publishedAt")} />
        <AdminDateInput label="Data de envio" error={errors.sentAt?.message} {...register("sentAt")} />
      </AdminFormGrid></AdminSection></AdminFormCard>
      <AdminFormCard><AdminSection title="Conteúdo HTML">
        <AdminTextarea placeholder="Insira o conteúdo HTML da newsletter" error={errors.htmlContent?.message} {...register("htmlContent")} />
      </AdminSection></AdminFormCard>
      <AdminFormActions isSubmitting={isSubmitting} />
    </Form>
  </Container>;
}

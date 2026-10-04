import { useEffect, useState } from "react";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { AdminButton } from "../../../components/AdminButton";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminLoading } from "../../../components/AdminLoading";
import { AdminSection } from "../../../components/AdminSection";
import type { NewsletterResponseDto } from "../../../dtos/newsletter/NewsletterResponseDto";
import { newsletterService } from "../../../services/newsletter";
import { Container, Header, HeaderActions, HtmlPreview, Title } from "./styles";

export function NewsletterView() {
  const [item, setItem] = useState<NewsletterResponseDto | null>(null); const { slug } = useParams(); const navigate = useNavigate(); const { showToast } = useToast();
  useEffect(() => {
    newsletterService.getBySlug(slug!).then(({ data }) => setItem(data)).catch((error) => {
      showToast({ title: "Erro ao carregar newsletter", description: String(error), type: "danger" });
    });
  }, [showToast, slug]);
  if (!item) return <AdminLoading text="Carregando newsletter..." />;
  const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(value)) : "—";
  return <Container><Header><HeaderActions><AdminButton variant="outline" onClick={() => navigate(-1)}><FiArrowLeft />Voltar</AdminButton><AdminButton onClick={() => navigate(`/admin/newsletter/${slug}/editar`)}><FiEdit2 />Editar</AdminButton></HeaderActions><Title>{item.title}</Title></Header>
    <AdminFormCard><AdminSection title="Dados gerais"><AdminDescriptionList><AdminDescriptionItem label="Slug" value={item.slug} /><AdminDescriptionItem label="Assunto" value={item.subject} /><AdminDescriptionItem label="Publicação" value={formatDate(item.publishedAt)} /><AdminDescriptionItem label="Envio" value={formatDate(item.sentAt)} /><AdminDescriptionItem label="URL da capa" value={item.coverUrl ?? "—"} /><AdminDescriptionItem label="URL do PDF" value={item.pdfUrl ?? "—"} /></AdminDescriptionList></AdminSection></AdminFormCard>
    <AdminFormCard><AdminSection title="Prévia do conteúdo"><HtmlPreview dangerouslySetInnerHTML={{ __html: item.htmlContent }} /></AdminSection></AdminFormCard>
  </Container>;
}

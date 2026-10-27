import { useCallback, useEffect, useState } from "react";
import { FiArrowLeft, FiDownload, FiEdit2, FiLoader } from "react-icons/fi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../../../hooks/useToast";
import { AdminButton } from "../../../components/AdminButton";
import { AdminDescriptionItem } from "../../../components/AdminDescriptionItem";
import { AdminDescriptionList } from "../../../components/AdminDescriptionList";
import { AdminFormCard } from "../../../components/AdminFormCard";
import { AdminLoading } from "../../../components/AdminLoading";
import { AdminSection } from "../../../components/AdminSection";
import { NewsletterSendPanel } from "../../../components/NewsletterSendPanel";
import type { NewsletterResponseDto } from "../../../dtos/newsletter/NewsletterResponseDto";
import { newsletterService } from "../../../services/newsletter";
import { newsletterReaderDocument } from "../../../../utils/newsletterEditions";
import { Container, Header, HeaderActions, HtmlPreview, Title } from "./styles";

export function NewsletterView() {
  const [item, setItem] = useState<NewsletterResponseDto | null>(null);
  const [downloading, setDownloading] = useState(false);
  const { slug } = useParams();
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const itemId = item?.id;
  useEffect(() => {
    let active = true;
    newsletterService
      .getBySlug(slug!)
      .then(({ data }) => {
        if (active) setItem(data);
      })
      .catch((error) => {
        if (active)
          showToast({
            title: "Erro ao carregar newsletter",
            description: String(error),
            type: "danger",
          });
      });
    return () => {
      active = false;
    };
  }, [showToast, slug]);
  useEffect(() => {
    if (itemId && hash === "#envio")
      document.getElementById("envio")?.scrollIntoView({ block: "start" });
  }, [itemId, hash]);
  const completed = useCallback((sentAt: string) => {
    setItem((current) =>
      current && !current.sentAt ? { ...current, sentAt } : current,
    );
  }, []);
  async function downloadPdf() {
    if (!item || downloading) return;
    setDownloading(true);
    try {
      const response = await newsletterService.pdf(item.id);
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${item.slug}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      showToast({
        title: "Não foi possível baixar o PDF",
        description: "Tente novamente em instantes.",
        type: "danger",
      });
    } finally {
      setDownloading(false);
    }
  }
  if (!item) return <AdminLoading text="Carregando newsletter..." />;
  const formatDate = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(
          new Date(value),
        )
      : "—";
  return (
    <Container>
      <Header>
        <HeaderActions>
          <AdminButton variant="outline" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            Voltar
          </AdminButton>
          <AdminButton
            variant="outline"
            disabled={downloading}
            onClick={() => void downloadPdf()}
          >
            {downloading ? (
              <FiLoader aria-hidden="true" />
            ) : (
              <FiDownload aria-hidden="true" />
            )}
            {downloading ? "Preparando PDF…" : "Baixar PDF"}
          </AdminButton>
          <AdminButton
            onClick={() => navigate(`/admin/newsletter/${slug}/editar`)}
          >
            <FiEdit2 />
            Editar
          </AdminButton>
        </HeaderActions>
        <Title>{item.title}</Title>
      </Header>
      <AdminFormCard>
        <AdminSection title="Dados gerais">
          <AdminDescriptionList>
            <AdminDescriptionItem label="Slug" value={item.slug} />
            <AdminDescriptionItem label="Assunto" value={item.subject} />
            <AdminDescriptionItem
              label="Publicação"
              value={formatDate(item.publishedAt)}
            />
            <AdminDescriptionItem
              label="Envio"
              value={formatDate(item.sentAt)}
            />
            <AdminDescriptionItem
              label="URL da capa"
              value={item.coverUrl ?? "—"}
            />
            <AdminDescriptionItem
              label="PDF da edição"
              value={
                item.pdfGeneratedAt
                  ? `Gerado em ${formatDate(item.pdfGeneratedAt)}`
                  : "Gerado automaticamente a partir do conteúdo"
              }
            />
          </AdminDescriptionList>
        </AdminSection>
      </AdminFormCard>
      <NewsletterSendPanel
        key={item.id}
        newsletter={item}
        onCompleted={completed}
      />
      <AdminFormCard>
        <AdminSection title="Prévia do conteúdo">
          <HtmlPreview
            title={`Prévia de ${item.title}`}
            srcDoc={newsletterReaderDocument(item.htmlContent)}
            sandbox="allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer"
          />
        </AdminSection>
      </AdminFormCard>
    </Container>
  );
}

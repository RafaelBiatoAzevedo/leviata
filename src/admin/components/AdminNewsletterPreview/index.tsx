import { FiCalendar, FiMail } from "react-icons/fi";
import { NewsletterReader } from "../../../components/NewsletterReader";
import { timelineExternalUrl } from "../../../utils/timeline";
import type { NewsletterFormData } from "../../validations/newsletter.schema";
import { Cover, Details, Metadata, Summary } from "./styles";

export function AdminNewsletterPreview({
  data,
  onClose,
}: {
  data: NewsletterFormData;
  onClose: () => void;
}) {
  const title = data.title.trim() || "Newsletter sem título";
  const coverUrl = data.coverUrl?.startsWith("blob:")
    ? data.coverUrl
    : timelineExternalUrl(data.coverUrl);
  const date = data.publishedAt ? new Date(data.publishedAt) : null;
  const publication =
    date && !Number.isNaN(date.getTime())
      ? new Intl.DateTimeFormat("pt-BR", {
          dateStyle: "long",
          timeZone: "UTC",
        }).format(date)
      : "Sem data de publicação";

  return (
    <NewsletterReader
      heading="Prévia da newsletter"
      edition={{
        title,
        htmlContent: data.htmlContent.trim()
          ? data.htmlContent
          : "<p>O conteúdo da newsletter aparecerá aqui.</p>",
      }}
      onClose={onClose}
    >
      {data.contentData?.mode !== "visual" && (
        <Summary>
          {coverUrl && (
            <Cover>
              <img src={coverUrl} alt={`Capa de ${title}`} />
            </Cover>
          )}
          <Details>
            <span>Dados atuais do formulário</span>
            <h3>{title}</h3>
            <Metadata>
              <FiMail aria-hidden="true" />
              <span>{data.subject.trim() || "Sem assunto"}</span>
            </Metadata>
            <Metadata>
              <FiCalendar aria-hidden="true" />
              <span>{publication}</span>
            </Metadata>
          </Details>
        </Summary>
      )}
    </NewsletterReader>
  );
}

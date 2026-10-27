import { useEffect, useId, useState } from "react";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiDownload,
  FiMail,
  FiSend,
} from "react-icons/fi";
import type { NewsletterResponseDto } from "../../admin/dtos/newsletter/NewsletterResponseDto";
import { Loading } from "../../components/Loading";
import { NewsletterForm } from "../../components/NewsletterForm";
import { NewsletterReader } from "../../components/NewsletterReader";
import { SectionHeader } from "../../components/SectionHeader";
import { usePublicList } from "../../hooks/usePublicData";
import {
  groupNewsletterEditions,
  newsletterEditionDate,
  newsletterEditionStatus,
  type NewsletterEditionStatus,
} from "../../utils/newsletterEditions";
import { timelineExternalUrl } from "../../utils/timeline";
import { newsletterPdfUrl } from "../../utils/newsletterPdf";
import { api } from "../../services/api";
import {
  ActionLink,
  Availability,
  Container,
  Content,
  EditionActions,
  EditionBody,
  EditionCover,
  EditionDate,
  EditionGrid,
  EditionItem,
  EditionSubject,
  EditionTitle,
  EmptyState,
  Library,
  LibrarySummary,
  PlaceholderCover,
  ReadButton,
  Section,
  SectionHeading,
  StatusBadge,
  SubscribeCopy,
  SubscribeSection,
  SummaryCopy,
  SummaryIcon,
  SummaryStats,
  YearBlock,
  YearHeading,
} from "./styles";

function EditionCard({
  edition,
  status,
  featured = false,
  headingAs = "h3",
  onRead,
}: {
  edition: NewsletterResponseDto;
  status: NewsletterEditionStatus;
  featured?: boolean;
  headingAs?: "h3" | "h4";
  onRead: (edition: NewsletterResponseDto) => void;
}) {
  const [coverFailed, setCoverFailed] = useState(false);
  const coverUrl = timelineExternalUrl(edition.coverUrl);
  const pdfUrl = newsletterPdfUrl(edition.pdfUrl, api.defaults.baseURL);
  const available = status === "published";
  const hasHtml = !!edition.htmlContent.trim();

  return (
    <EditionItem $featured={featured}>
      <EditionCover $featured={featured}>
        {coverUrl && !coverFailed ? (
          <img
            src={coverUrl}
            alt=""
            loading={featured ? "eager" : "lazy"}
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <PlaceholderCover aria-hidden="true">
            <FiMail />
            <strong>Leviatã e o Cativeiro</strong>
            <span>Newsletter do grupo</span>
          </PlaceholderCover>
        )}
      </EditionCover>
      <EditionBody $featured={featured}>
        <StatusBadge $status={status}>
          {available
            ? "Publicada"
            : status === "upcoming"
              ? "Em breve"
              : "Em preparação"}
        </StatusBadge>
        <EditionDate
          as={status === "preparing" ? "span" : "time"}
          dateTime={
            status === "preparing"
              ? undefined
              : (edition.publishedAt ?? undefined)
          }
        >
          <FiCalendar aria-hidden="true" />
          {status === "upcoming" && "Prevista para "}
          {newsletterEditionDate(edition)}
        </EditionDate>
        <EditionTitle as={headingAs} $featured={featured}>
          {edition.title}
        </EditionTitle>
        {edition.subject !== edition.title && (
          <EditionSubject>{edition.subject}</EditionSubject>
        )}
        {available ? (
          <EditionActions>
            {hasHtml ? (
              <ReadButton
                type="button"
                onClick={() => onRead(edition)}
                aria-label={`Ler edição: ${edition.title}`}
              >
                <FiBookOpen aria-hidden="true" /> Ler edição{" "}
                <FiArrowUpRight aria-hidden="true" />
              </ReadButton>
            ) : pdfUrl ? (
              <ActionLink
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                $primary
                aria-label={`Visualizar PDF: ${edition.title}`}
              >
                <FiBookOpen aria-hidden="true" /> Visualizar PDF{" "}
                <FiArrowUpRight aria-hidden="true" />
              </ActionLink>
            ) : (
              <Availability>Conteúdo indisponível no momento.</Availability>
            )}
            {hasHtml && pdfUrl && (
              <ActionLink
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir PDF: ${edition.title}`}
              >
                <FiDownload aria-hidden="true" /> PDF
              </ActionLink>
            )}
          </EditionActions>
        ) : (
          <Availability>
            <FiClock aria-hidden="true" />
            {status === "upcoming"
              ? "Leitura disponível na data de publicação."
              : "Uma nova edição está a caminho."}
          </Availability>
        )}
      </EditionBody>
    </EditionItem>
  );
}

export function Newsletter() {
  const { data, loading, error } =
    usePublicList<NewsletterResponseDto>("newsletter");
  const [now, setNow] = useState(() => new Date());
  const [reading, setReading] = useState<NewsletterResponseDto | null>(null);
  const pageId = useId();
  const signupId = `${pageId}-subscribe`;
  const groups = groupNewsletterEditions(data, now);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <Container>
      <Content>
        <SectionHeader
          title="Newsletter"
          subtitle="As pesquisas, os encontros e as produções do Leviatã e o Cativeiro, edição por edição. Explore nossos boletins e acompanhe o que vem a seguir."
        />
        <Library>
          <LibrarySummary>
            <SummaryCopy>
              <SummaryIcon aria-hidden="true">
                <FiMail />
              </SummaryIcon>
              <div>
                <span>O boletim do grupo</span>
                <h2>Um espaço para acompanhar e revisitar.</h2>
                <p>
                  Conheça as edições publicadas e fique por dentro das próximas
                  novidades.
                </p>
              </div>
            </SummaryCopy>
            {!loading && !error && data.length > 0 ? (
              <SummaryStats role="group" aria-label="Edições da newsletter">
                <div>
                  <strong>
                    {String(groups.publishedCount).padStart(2, "0")}
                  </strong>
                  <span>Publicadas</span>
                </div>
                <div>
                  <strong>
                    {String(groups.upcoming.length).padStart(2, "0")}
                  </strong>
                  <span>Próximas</span>
                </div>
              </SummaryStats>
            ) : (
              <ActionLink href={`#${signupId}`} $onDark>
                Quero receber <FiArrowUpRight aria-hidden="true" />
              </ActionLink>
            )}
          </LibrarySummary>

          {loading ? (
            <EmptyState role="status">
              <Loading />
              <p>Carregando as edições...</p>
            </EmptyState>
          ) : error ? (
            <EmptyState role="alert">
              <FiMail aria-hidden="true" />
              <h2>Não foi possível carregar os boletins.</h2>
              <p>Atualize a página para tentar novamente.</p>
            </EmptyState>
          ) : data.length === 0 ? (
            <EmptyState>
              <FiBookOpen aria-hidden="true" />
              <h2>Nosso arquivo de boletins começa por aqui.</h2>
              <p>
                Nenhuma edição disponível no momento. Inscreva-se para
                acompanhar as novidades do grupo.
              </p>
              <ActionLink href={`#${signupId}`}>
                Receber novidades <FiArrowUpRight aria-hidden="true" />
              </ActionLink>
            </EmptyState>
          ) : (
            <>
              {groups.latest && (
                <Section aria-labelledby={`${pageId}-latest`}>
                  <SectionHeading>
                    <FiBookOpen aria-hidden="true" />
                    <div>
                      <h2 id={`${pageId}-latest`}>Última edição</h2>
                      <p>O boletim mais recente, em destaque.</p>
                    </div>
                  </SectionHeading>
                  <EditionCard
                    key={groups.latest.id}
                    edition={groups.latest}
                    status="published"
                    featured
                    onRead={setReading}
                  />
                </Section>
              )}
              {groups.archive.length > 0 && (
                <Section aria-labelledby={`${pageId}-archive`}>
                  <SectionHeading>
                    <FiCalendar aria-hidden="true" />
                    <div>
                      <h2 id={`${pageId}-archive`}>Edições anteriores</h2>
                      <p>
                        Um arquivo de leituras, das mais recentes às anteriores.
                      </p>
                    </div>
                  </SectionHeading>
                  {groups.archive.map(({ year, items }) => (
                    <YearBlock key={year}>
                      <YearHeading>
                        <h3>{year}</h3>
                        <span>
                          {items.length}{" "}
                          {items.length === 1 ? "edição" : "edições"}
                        </span>
                      </YearHeading>
                      <EditionGrid>
                        {items.map((edition) => (
                          <EditionCard
                            key={edition.id}
                            edition={edition}
                            status="published"
                            headingAs="h4"
                            onRead={setReading}
                          />
                        ))}
                      </EditionGrid>
                    </YearBlock>
                  ))}
                </Section>
              )}
              {groups.upcoming.length > 0 && (
                <Section aria-labelledby={`${pageId}-upcoming`}>
                  <SectionHeading>
                    <FiClock aria-hidden="true" />
                    <div>
                      <h2 id={`${pageId}-upcoming`}>Próximas edições</h2>
                      <p>
                        Novos boletins para continuar o diálogo. Inscreva-se
                        para acompanhar.
                      </p>
                    </div>
                  </SectionHeading>
                  <EditionGrid>
                    {groups.upcoming.map((edition) => (
                      <EditionCard
                        key={edition.id}
                        edition={edition}
                        status={newsletterEditionStatus(edition, now)}
                        onRead={setReading}
                      />
                    ))}
                  </EditionGrid>
                </Section>
              )}
            </>
          )}

          <SubscribeSection
            id={signupId}
            aria-labelledby={`${pageId}-subscribe-title`}
          >
            <SubscribeCopy>
              <FiSend aria-hidden="true" />
              <span>Continue acompanhando</span>
              <h2 id={`${pageId}-subscribe-title`}>
                As próximas novidades podem chegar ao seu e-mail.
              </h2>
              <p>
                Receba notícias sobre pesquisas, publicações e atividades do
                grupo. Basta informar seu e-mail para fazer parte da nossa
                lista.
              </p>
            </SubscribeCopy>
            <NewsletterForm type="middle" />
          </SubscribeSection>
        </Library>
      </Content>
      {reading && (
        <NewsletterReader edition={reading} onClose={() => setReading(null)} />
      )}
    </Container>
  );
}

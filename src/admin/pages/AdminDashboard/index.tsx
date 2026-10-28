import {
  FiArrowRight,
  FiArrowUpRight,
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiCompass,
  FiExternalLink,
  FiFileText,
  FiMail,
  FiMapPin,
  FiMic,
  FiPlus,
} from "react-icons/fi";
import { newsCategoryLabels } from "../../types/TNewsCategory";
import { useDashboard } from "./useDashboard";
import { DashboardOverview } from "./Overview";
import {
  ActionLink,
  Banner,
  BannerActions,
  BannerCopy,
  BannerLabel,
  BannerNumber,
  BannerSummary,
  BannerTitle,
  Container,
  DateLabel,
  DateTile,
  EmptyState,
  ErrorState,
  EventDetails,
  EventItem,
  EventList,
  Eyebrow,
  Footer,
  Header,
  HeaderActions,
  NewsDetails,
  NewsItem,
  NewsList,
  NewsThumbnail,
  Panel,
  PanelGrid,
  PanelHeader,
  PanelLink,
  SectionHeading,
  Shortcut,
  ShortcutGrid,
  Skeleton,
  Subtitle,
  Title,
} from "./styles";

const shortcuts = [
  {
    title: "Cadastrar um livro",
    description: "Amplie o acervo de publicações.",
    to: "/admin/livros/novo",
    icon: FiBookOpen,
  },
  {
    title: "Criar uma pesquisa",
    description: "Dê espaço a um novo projeto.",
    to: "/admin/pesquisas/novo",
    icon: FiCompass,
  },
  {
    title: "Adicionar um encontro",
    description: "Conecte pessoas e ideias.",
    to: "/admin/encontros/novo",
    icon: FiMic,
  },
  {
    title: "Preparar uma newsletter",
    description: "Compartilhe o que acontece no grupo.",
    to: "/admin/newsletter/novo",
    icon: FiMail,
  },
];

function formatDate(date: string | Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    ...options,
  }).format(new Date(date));
}

function LoadingRows() {
  return (
    <div role="status" aria-label="Carregando registros">
      {[0, 1, 2].map((item) => (
        <Skeleton key={item} $height="72px" $spacing aria-hidden="true" />
      ))}
    </div>
  );
}

export function AdminDashboard() {
  const { summary, events, news, errors, loading, retry } = useDashboard();
  const today = new Date();

  return (
    <Container>
      <Header>
        <div>
          <Eyebrow>Leviatã e o Cativeiro / Administração</Eyebrow>
          <Title>Visão geral</Title>
          <Subtitle>Acompanhe o acervo e cuide do que vem a seguir.</Subtitle>
        </div>
        <HeaderActions>
          <DateLabel>
            <FiCalendar aria-hidden="true" />
            {formatDate(today, { day: "numeric", month: "long" })}
          </DateLabel>
          <ActionLink to="/" target="_blank" rel="noreferrer">
            <FiExternalLink aria-hidden="true" />
            Ver portal
          </ActionLink>
        </HeaderActions>
      </Header>

      <Banner aria-labelledby="dashboard-banner-title">
        <BannerCopy>
          <BannerLabel>
            <span aria-hidden="true" /> Pesquisa · Memória · Conexões
          </BannerLabel>
          <BannerTitle id="dashboard-banner-title">
            Conhecimento
            <br />
            em <em>movimento.</em>
          </BannerTitle>
          <p>
            Um espaço para organizar o acervo, dar visibilidade às pesquisas e
            aproximar pessoas.
          </p>
          <BannerActions>
            <ActionLink to="/admin/noticias/novo" $variant="gold">
              <FiPlus aria-hidden="true" />
              Publicar uma notícia
            </ActionLink>
            <ActionLink to="/admin/agenda/novo" $variant="ghost">
              Adicionar à agenda
              <FiArrowUpRight aria-hidden="true" />
            </ActionLink>
          </BannerActions>
        </BannerCopy>
        <BannerSummary aria-busy={loading}>
          <span>O panorama do portal</span>
          <BannerNumber>
            {loading ? (
              <Skeleton
                $height="80px"
                $width="150px"
                aria-label="Carregando total"
              />
            ) : summary ? (
              summary.totalRecords.toLocaleString("pt-BR")
            ) : (
              "—"
            )}
          </BannerNumber>
          <p>
            {summary
              ? `registros em ${summary.items.length} áreas de conteúdo`
              : "registros de conteúdo do portal"}
          </p>
          <small>
            <FiClock aria-hidden="true" />
            {summary
              ? `Atualizado às ${formatDate(summary.generatedAt, { hour: "2-digit", minute: "2-digit" })}`
              : loading
                ? "Carregando o panorama…"
                : "Indicadores indisponíveis"}
          </small>
        </BannerSummary>
      </Banner>

      <DashboardOverview
        summary={summary}
        loading={loading}
        error={errors.summary}
        onRetry={retry}
      />

      <PanelGrid>
        <Panel aria-labelledby="dashboard-events-title" aria-busy={loading}>
          <PanelHeader>
            <div>
              <Eyebrow>No horizonte</Eyebrow>
              <SectionHeading id="dashboard-events-title">
                Próximos na agenda
              </SectionHeading>
            </div>
            <PanelLink to="/admin/agenda">
              Ver agenda
              <FiArrowRight aria-hidden="true" />
            </PanelLink>
          </PanelHeader>
          {loading ? (
            <LoadingRows />
          ) : errors.events ? (
            <ErrorState role="alert">
              Não foi possível carregar a agenda.
              <button type="button" onClick={retry}>
                Tentar novamente
              </button>
            </ErrorState>
          ) : events.length === 0 ? (
            <EmptyState>
              <FiCalendar aria-hidden="true" />
              <h3>Espaço para o próximo encontro</h3>
              <p>
                Nenhum evento futuro na agenda. Que tal adicionar o próximo?
              </p>
              <PanelLink to="/admin/agenda/novo">
                Criar evento
                <FiPlus aria-hidden="true" />
              </PanelLink>
            </EmptyState>
          ) : (
            <EventList>
              {events.map((event) => (
                <li key={event.id}>
                  <EventItem to={`/admin/agenda/${event.slug}`}>
                    <DateTile>
                      <strong>
                        {formatDate(event.date, { day: "2-digit" })}
                      </strong>
                      <span>
                        {formatDate(event.date, { month: "short" }).replace(
                          ".",
                          "",
                        )}
                      </span>
                    </DateTile>
                    <EventDetails>
                      <small>
                        {formatDate(event.date, {
                          weekday: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                      <h3>{event.title}</h3>
                      <p>
                        <FiMapPin aria-hidden="true" />
                        {event.location || "Local a definir"}
                      </p>
                    </EventDetails>
                    <FiArrowUpRight aria-hidden="true" />
                  </EventItem>
                </li>
              ))}
            </EventList>
          )}
        </Panel>

        <Panel aria-labelledby="dashboard-news-title" aria-busy={loading}>
          <PanelHeader>
            <div>
              <Eyebrow>Em circulação</Eyebrow>
              <SectionHeading id="dashboard-news-title">
                Notícias recentes
              </SectionHeading>
            </div>
            <PanelLink to="/admin/noticias">
              Ver todas
              <FiArrowRight aria-hidden="true" />
            </PanelLink>
          </PanelHeader>
          {loading ? (
            <LoadingRows />
          ) : errors.news ? (
            <ErrorState role="alert">
              Não foi possível carregar as notícias.
              <button type="button" onClick={retry}>
                Tentar novamente
              </button>
            </ErrorState>
          ) : news.length === 0 ? (
            <EmptyState>
              <FiFileText aria-hidden="true" />
              <h3>A próxima história começa aqui</h3>
              <p>
                Compartilhe uma publicação, um evento ou uma conquista do grupo.
              </p>
              <PanelLink to="/admin/noticias/novo">
                Criar notícia
                <FiPlus aria-hidden="true" />
              </PanelLink>
            </EmptyState>
          ) : (
            <NewsList>
              {news.map((item) => (
                <li key={item.id}>
                  <NewsItem to={`/admin/noticias/${item.slug}`}>
                    <NewsThumbnail>
                      {item.coverUrl ? (
                        <img src={item.coverUrl} alt="" loading="lazy" />
                      ) : (
                        <FiFileText aria-hidden="true" />
                      )}
                    </NewsThumbnail>
                    <NewsDetails>
                      <small>
                        {newsCategoryLabels[item.category]}
                        <span aria-hidden="true"> · </span>
                        {formatDate(item.date, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </small>
                      <h3>{item.title}</h3>
                    </NewsDetails>
                    <FiArrowUpRight aria-hidden="true" />
                  </NewsItem>
                </li>
              ))}
            </NewsList>
          )}
        </Panel>
      </PanelGrid>

      <section aria-labelledby="dashboard-shortcuts-title">
        <PanelHeader>
          <div>
            <Eyebrow>Faça acontecer</Eyebrow>
            <SectionHeading id="dashboard-shortcuts-title">
              O próximo passo está aqui
            </SectionHeading>
          </div>
          <span>Atalhos de criação</span>
        </PanelHeader>
        <ShortcutGrid>
          {shortcuts.map(({ title, description, to, icon: Icon }) => (
            <Shortcut key={to} to={to}>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <p>{description}</p>
              <span>
                Criar agora
                <FiArrowRight aria-hidden="true" />
              </span>
            </Shortcut>
          ))}
        </ShortcutGrid>
      </section>

      <Footer>
        <FiCompass aria-hidden="true" />
        <span>Leviatã e o Cativeiro</span>
        <span>Pesquisa, história e conhecimento compartilhado.</span>
      </Footer>
    </Container>
  );
}

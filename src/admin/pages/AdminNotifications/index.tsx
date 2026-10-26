import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiInbox,
  FiMessageSquare,
  FiPlus,
  FiRefreshCw,
  FiShield,
  FiTrash2,
} from "react-icons/fi";
import { useNotifications } from "../../contexts/NotificationsContext";
import { useAuth } from "../../hooks/useAuth";
import {
  notificationsService,
  type AdminNotification,
  type NotificationQuery,
  type NotificationsPage,
} from "../../services/notifications";
import {
  Action,
  Composer,
  Detail,
  Empty,
  Grid,
  ListItem,
  Notice,
  Page,
  PageHeader,
  Pagination,
  Panel,
  Summary,
  Tabs,
  Tag,
} from "./styles";

type Filter = "all" | "unread" | "pending" | "INFO" | "REMINDER" | "scheduled";
const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "unread", label: "Não lidas" },
  { value: "pending", label: "Para moderar" },
  { value: "INFO", label: "Avisos" },
  { value: "REMINDER", label: "Lembretes" },
  { value: "scheduled", label: "Agendadas" },
];
const date = (value: string) =>
  new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

export function AdminNotifications() {
  const { unreadCount, pendingCount, revision, changed } = useNotifications();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("item");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<NotificationsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);
  const [composing, setComposing] = useState(false);
  const [success, setSuccess] = useState("");
  const [retry, setRetry] = useState(0);
  const title = useRef<HTMLHeadingElement>(null);

  function chooseFilter(value: Filter) {
    setFilter(value);
    setPage(1);
    setLoading(true);
    setError("");
    setActionError("");
  }
  function refresh() {
    setLoading(true);
    setError("");
    setActionError("");
    setRetry((value) => value + 1);
    changed();
  }

  useEffect(() => {
    const request = new AbortController();
    const query: NotificationQuery = { page, limit: 10 };
    if (filter === "INFO" || filter === "REMINDER") query.type = filter;
    else query.status = filter;
    notificationsService
      .list(query, request.signal)
      .then(({ data: result }) => {
        if (request.signal.aborted) return;
        if (page > Math.max(1, Math.ceil(result.total / 10))) {
          setPage(Math.max(1, Math.ceil(result.total / 10)));
          return;
        }
        setData(result);
        setError("");
      })
      .catch(() => {
        if (!request.signal.aborted)
          setError("Não foi possível carregar as notificações.");
      })
      .finally(() => {
        if (!request.signal.aborted) setLoading(false);
      });
    return () => request.abort();
  }, [filter, page, revision, retry, unreadCount, pendingCount]);

  async function readAll() {
    setBusy(true);
    setActionError("");
    try {
      await notificationsService.readAll();
      changed();
    } catch {
      setActionError("Não foi possível marcar as notificações como lidas.");
    } finally {
      setBusy(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));
  return (
    <Page>
      <PageHeader>
        <div>
          <small>Administração · Caixa de entrada</small>
          <h1 ref={title} tabIndex={-1}>
            Notificações
          </h1>
          <p>Avisos, lembretes e contribuições que aguardam seu olhar.</p>
        </div>
        <div>
          <Action
            type="button"
            onClick={refresh}
            aria-label="Atualizar notificações"
          >
            <FiRefreshCw aria-hidden="true" />
            Atualizar
          </Action>
          <Action
            $variant="gold"
            type="button"
            onClick={() => {
              setComposing((value) => !value);
              setSuccess("");
            }}
            aria-expanded={composing}
          >
            <FiPlus aria-hidden="true" />
            Novo aviso ou lembrete
          </Action>
        </div>
      </PageHeader>
      <Summary>
        <button type="button" onClick={() => chooseFilter("unread")}>
          <FiInbox aria-hidden="true" />
          <div>
            <strong>{unreadCount}</strong>
            <span>notificações não lidas</span>
          </div>
        </button>
        <button type="button" onClick={() => chooseFilter("pending")}>
          <FiShield aria-hidden="true" />
          <div>
            <strong>{pendingCount}</strong>
            <span>comentários aguardando moderação</span>
          </div>
        </button>
      </Summary>
      {success && (
        <Notice $success role="status">
          {success}
        </Notice>
      )}
      {composing && (
        <NotificationComposer
          onCancel={() => setComposing(false)}
          onSaved={(message) => {
            setComposing(false);
            setSuccess(message);
            changed();
          }}
        />
      )}
      <Tabs aria-label="Filtrar notificações">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => chooseFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </Tabs>
      {actionError && <Notice role="alert">{actionError}</Notice>}
      {error && !!data?.items.length && (
        <Notice role="alert">
          {error}
          <button type="button" onClick={refresh}>
            Tentar novamente
          </button>
        </Notice>
      )}
      <Grid $selected={!!selectedId}>
        <Panel
          data-inbox-list
          aria-label="Lista de notificações"
          aria-busy={loading}
        >
          <header>
            <h2>{filters.find((item) => item.value === filter)?.label}</h2>
            <Action
              type="button"
              disabled={busy || !unreadCount}
              onClick={() => void readAll()}
            >
              <FiCheckCircle aria-hidden="true" />
              Ler todas
            </Action>
          </header>
          {loading ? (
            <Empty role="status">
              <FiRefreshCw aria-hidden="true" />
              <p>Carregando notificações…</p>
            </Empty>
          ) : data?.items.length ? (
            <ul>
              {data.items.map((item) => (
                <li key={item.id}>
                  <ListItem
                    $unread={!item.readAt}
                    $selected={selectedId === item.id}
                    type="button"
                    aria-current={selectedId === item.id ? "true" : undefined}
                    onClick={() => setParams({ item: item.id })}
                  >
                    {item.type === "COMMENT" ? (
                      <FiMessageSquare aria-hidden="true" />
                    ) : item.type === "REMINDER" ? (
                      <FiClock aria-hidden="true" />
                    ) : (
                      <FiBell aria-hidden="true" />
                    )}
                    <div>
                      <strong>{item.title}</strong>
                      <p>
                        {item.comment
                          ? `${item.comment.fullName}: ${item.comment.text}`
                          : item.message}
                      </p>
                      <small>
                        {date(item.visibleAt)}
                        {item.resolution === "APPROVED"
                          ? " · Aprovado"
                          : item.resolution === "REJECTED"
                            ? " · Recusado"
                            : item.type === "COMMENT"
                              ? " · Aguardando revisão"
                              : ""}
                      </small>
                    </div>
                    {!item.readAt && filter !== "scheduled" && (
                      <span aria-label="Não lida" />
                    )}
                  </ListItem>
                </li>
              ))}
            </ul>
          ) : (
            <Empty role="status">
              <FiInbox aria-hidden="true" />
              <p>Nenhuma notificação encontrada.</p>
            </Empty>
          )}
          <Pagination aria-label="Paginação das notificações">
            <button
              type="button"
              disabled={loading || page <= 1}
              aria-label="Página anterior"
              onClick={() => {
                setPage((value) => value - 1);
                setLoading(true);
              }}
            >
              <FiChevronLeft />
            </button>
            <span>
              Página {page} de {totalPages} · {data?.total ?? 0} itens
            </span>
            <button
              type="button"
              disabled={loading || page >= totalPages}
              aria-label="Próxima página"
              onClick={() => {
                setPage((value) => value + 1);
                setLoading(true);
              }}
            >
              <FiChevronRight />
            </button>
          </Pagination>
        </Panel>
        <Panel data-detail aria-label="Detalhes da notificação">
          {selectedId ? (
            <NotificationDetails
              key={selectedId}
              id={selectedId}
              onBack={() => {
                setParams({});
                title.current?.focus();
              }}
            />
          ) : (
            <Empty>
              <FiInbox aria-hidden="true" />
              <h2>Um lugar para acompanhar tudo</h2>
              <p>
                Selecione uma notificação para ler os detalhes ou revisar um
                comentário.
              </p>
            </Empty>
          )}
        </Panel>
      </Grid>
    </Page>
  );
}

function NotificationDetails({ id, onBack }: { id: string; onBack(): void }) {
  const { user } = useAuth();
  const { changed } = useNotifications();
  const [item, setItem] = useState<AdminNotification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [readError, setReadError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);
  const [retry, setRetry] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    const request = new AbortController();
    notificationsService
      .get(id, request.signal)
      .then(async ({ data }) => {
        if (request.signal.aborted) return;
        setItem(data);
        setError("");
        if (!data.readAt && new Date(data.visibleAt).getTime() <= Date.now()) {
          try {
            await notificationsService.read(id);
            if (!request.signal.aborted) {
              setReadError(false);
              changed();
            }
          } catch {
            if (!request.signal.aborted) setReadError(true);
          }
        }
      })
      .catch(() => {
        if (!request.signal.aborted)
          setError("Não foi possível abrir esta notificação.");
      })
      .finally(() => {
        if (!request.signal.aborted) {
          setLoading(false);
          requestAnimationFrame(() => heading.current?.focus());
        }
      });
    return () => {
      active.current = false;
      request.abort();
    };
  }, [id, retry, changed]);

  async function moderate(decision: "approve" | "reject") {
    if (!item?.comment || busy) return;
    setBusy(true);
    setError("");
    try {
      await notificationsService.moderate(item.comment.id, decision);
      changed();
      setConfirmReject(false);
      const { data } = await notificationsService.get(id);
      if (active.current) setItem(data);
    } catch (failure) {
      if (!active.current) return;
      setError(
        isAxiosError(failure) &&
          [404, 409].includes(failure.response?.status ?? 0)
          ? "O comentário ou a página não está mais disponível para esta ação. Atualize os detalhes."
          : isAxiosError(failure) && failure.response?.status === 403
            ? "Apenas superadministradores podem moderar comentários."
            : "Não foi possível concluir a moderação. Tente novamente.",
      );
      changed();
    } finally {
      if (active.current) setBusy(false);
    }
  }

  const pending =
    item?.type === "COMMENT" &&
    item.comment?.status === "PENDING" &&
    !item.resolution;
  return (
    <Detail>
      <Action data-back type="button" onClick={onBack}>
        <FiArrowLeft aria-hidden="true" />
        Voltar à lista
      </Action>
      {loading && <p role="status">Carregando detalhes…</p>}
      {error && (
        <Notice role="alert">
          {error}
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setRetry((value) => value + 1);
            }}
          >
            Atualizar detalhes
          </button>
        </Notice>
      )}
      {readError && (
        <Notice role="alert">
          A leitura não foi registrada.
          <button type="button" onClick={() => setRetry((value) => value + 1)}>
            Tentar novamente
          </button>
        </Notice>
      )}
      {item && (
        <>
          <Tag
            $tone={
              item.resolution === "APPROVED"
                ? "success"
                : item.resolution === "REJECTED"
                  ? "danger"
                  : "pending"
            }
          >
            {item.resolution === "APPROVED" ? (
              <>
                <FiCheckCircle aria-hidden="true" />
                Comentário aprovado
              </>
            ) : item.resolution === "REJECTED" ? (
              <>
                <FiTrash2 aria-hidden="true" />
                Comentário recusado
              </>
            ) : pending ? (
              <>
                <FiShield aria-hidden="true" />
                Aguardando moderação
              </>
            ) : item.type === "REMINDER" ? (
              <>
                <FiClock aria-hidden="true" />
                Lembrete
              </>
            ) : (
              "Aviso administrativo"
            )}
          </Tag>
          <h2 ref={heading} tabIndex={-1}>
            {item.title}
          </h2>
          <time dateTime={item.visibleAt}>{date(item.visibleAt)}</time>
          <p>
            {item.resolution === "REJECTED"
              ? "O comentário foi recusado e a mensagem foi apagada permanentemente."
              : item.resolution === "APPROVED"
                ? "A contribuição foi aprovada e está disponível no portal."
                : item.message}
          </p>
          {item.comment && (
            <div data-comment>
              <small>Enviado por</small>
              <strong>{item.comment.fullName}</strong>
              <blockquote>{item.comment.text}</blockquote>
            </div>
          )}
          {item.targetTitle && (
            <div data-target>
              Página relacionada<strong>{item.targetTitle}</strong>
              {item.targetPath?.startsWith("/") &&
                !item.targetPath.startsWith("//") && (
                  <Link
                    to={item.targetPath}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver no portal
                    <FiArrowUpRight aria-hidden="true" />
                  </Link>
                )}
            </div>
          )}
          {pending &&
            (user?.role === "SUPER_ADMIN" ? (
              <>
                <p data-note>
                  Aprovar publica a mensagem nesta página. Recusar exclui a
                  mensagem definitivamente.
                </p>
                {confirmReject ? (
                  <>
                    <Notice role="alert">
                      Confirma a recusa? O nome e o texto deste comentário serão
                      apagados.
                    </Notice>
                    <div data-actions>
                      <Action
                        $variant="danger"
                        disabled={busy}
                        type="button"
                        onClick={() => void moderate("reject")}
                      >
                        <FiTrash2 aria-hidden="true" />
                        {busy ? "Apagando…" : "Recusar e apagar"}
                      </Action>
                      <Action
                        disabled={busy}
                        type="button"
                        onClick={() => setConfirmReject(false)}
                      >
                        Cancelar
                      </Action>
                    </div>
                  </>
                ) : (
                  <div data-actions>
                    <Action
                      $variant="gold"
                      disabled={busy}
                      type="button"
                      onClick={() => void moderate("approve")}
                    >
                      <FiCheck aria-hidden="true" />
                      {busy ? "Publicando…" : "Aprovar e publicar"}
                    </Action>
                    <Action
                      $variant="danger"
                      disabled={busy}
                      type="button"
                      onClick={() => setConfirmReject(true)}
                    >
                      <FiTrash2 aria-hidden="true" />
                      Recusar
                    </Action>
                  </div>
                )}
              </>
            ) : (
              <p data-note>
                <FiShield aria-hidden="true" /> Apenas superadministradores
                podem aprovar ou recusar comentários.
              </p>
            ))}
        </>
      )}
    </Detail>
  );
}

function NotificationComposer({
  onCancel,
  onSaved,
}: {
  onCancel(): void;
  onSaved(message: string): void;
}) {
  const [type, setType] = useState<"INFO" | "REMINDER">("INFO");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scheduled, setScheduled] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const titleInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    titleInput.current?.focus();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (title.trim().length < 3 || message.trim().length < 3) {
      setError("Preencha o título e a mensagem com pelo menos 3 caracteres.");
      return;
    }
    const visibleAt =
      type === "REMINDER" && scheduled ? new Date(scheduled) : null;
    if (
      visibleAt &&
      (!Number.isFinite(visibleAt.getTime()) ||
        visibleAt.getTime() <= Date.now())
    ) {
      setError("Escolha uma data e hora futura para agendar o lembrete.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await notificationsService.create({
        type,
        title: title.trim(),
        message: message.trim(),
        ...(visibleAt && { visibleAt: visibleAt.toISOString() }),
      });
      onSaved(
        visibleAt
          ? `Lembrete agendado para ${date(visibleAt.toISOString())}. Você pode consultá-lo em Agendadas.`
          : "Notificação criada para a equipe administrativa.",
      );
    } catch {
      setError("Não foi possível salvar a notificação. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Composer onSubmit={submit}>
      <h2>Novo aviso ou lembrete</h2>
      <p>
        Visível somente para administradores. Para um lembrete imediato, deixe a
        data em branco.
      </p>
      <fieldset disabled={busy}>
        <label>
          Tipo
          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value as "INFO" | "REMINDER")
            }
          >
            <option value="INFO">Aviso</option>
            <option value="REMINDER">Lembrete</option>
          </select>
        </label>
        {type === "REMINDER" && (
          <label>
            Exibir a partir de (horário local)
            <input
              type="datetime-local"
              value={scheduled}
              onChange={(event) => setScheduled(event.target.value)}
            />
          </label>
        )}
        <label data-wide>
          Título
          <input
            ref={titleInput}
            value={title}
            maxLength={120}
            minLength={3}
            required
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label data-wide>
          Mensagem
          <textarea
            value={message}
            maxLength={500}
            minLength={3}
            required
            onChange={(event) => setMessage(event.target.value)}
          />
          <small>{message.length}/500 caracteres</small>
        </label>
      </fieldset>
      {error && <Notice role="alert">{error}</Notice>}
      <footer>
        <Action $variant="gold" type="submit" disabled={busy}>
          {busy ? "Salvando…" : "Criar notificação"}
        </Action>
        <Action type="button" disabled={busy} onClick={onCancel}>
          Cancelar
        </Action>
      </footer>
    </Composer>
  );
}

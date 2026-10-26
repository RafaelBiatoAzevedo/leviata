import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiClock, FiMessageSquare, FiX } from "react-icons/fi";
import { useNotifications } from "../../contexts/NotificationsContext";
import {
  notificationsService,
  type AdminNotification,
} from "../../services/notifications";
import { Popover, Preview, Trigger, Wrapper } from "./styles";

export function NotificationBell() {
  const { unreadCount, pendingCount, revision } = useNotifications();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const navigate = useNavigate();

  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  useEffect(() => {
    if (!open) return;
    const request = new AbortController();
    notificationsService
      .list({ limit: 5 }, request.signal)
      .then(({ data }) => {
        if (!request.signal.aborted) {
          setItems(data.items);
          setError(false);
        }
      })
      .catch(() => {
        if (!request.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!request.signal.aborted) setLoading(false);
      });
    return () => request.abort();
  }, [open, revision, unreadCount, retry]);

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    function click(event: PointerEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    function key(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", click);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  return (
    <Wrapper
      ref={wrapper}
      onBlur={(event) => {
        if (
          event.relatedTarget &&
          !event.currentTarget.contains(event.relatedTarget as Node)
        )
          setOpen(false);
      }}
    >
      <Trigger
        ref={trigger}
        type="button"
        aria-label={`Notificações${unreadCount ? `: ${unreadCount} não lidas` : ""}`}
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-haspopup="dialog"
        onClick={() => {
          setLoading(true);
          setOpen((value) => !value);
        }}
      >
        <FiBell aria-hidden="true" />
        {unreadCount > 0 && (
          <span aria-hidden="true">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Trigger>
      {open && (
        <Popover
          id={id}
          ref={panel}
          tabIndex={-1}
          role="dialog"
          aria-label="Notificações administrativas"
        >
          <header>
            <div>
              <h2>Notificações</h2>
              <p>
                {pendingCount
                  ? `${pendingCount} comentário(s) aguardando revisão`
                  : "Acompanhe as novidades da administração"}
              </p>
            </div>
            <button
              type="button"
              aria-label="Fechar notificações"
              onClick={close}
            >
              <FiX />
            </button>
          </header>
          {loading ? (
            <p data-empty role="status">
              Carregando…
            </p>
          ) : error && items.length > 0 ? (
            <div data-empty role="alert">
              Não foi possível carregar.
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setRetry((value) => value + 1);
                }}
              >
                Tentar novamente
              </button>
            </div>
          ) : items.length === 0 ? (
            <p data-empty role="status">
              Nenhuma notificação encontrada.
            </p>
          ) : (
            <ul>
              {items.map((item) => (
                <li key={item.id}>
                  <Preview
                    $unread={!item.readAt}
                    onClick={() => {
                      setOpen(false);
                      navigate(`/admin/notificacoes?item=${item.id}`);
                    }}
                  >
                    {item.type === "COMMENT" ? (
                      <FiMessageSquare aria-hidden="true" />
                    ) : item.type === "REMINDER" ? (
                      <FiClock aria-hidden="true" />
                    ) : (
                      <FiBell aria-hidden="true" />
                    )}
                    <div>
                      <strong>
                        {item.title}
                        {!item.readAt && " •"}
                      </strong>
                      <p>
                        {item.comment
                          ? `${item.comment.fullName}: ${item.comment.text}`
                          : item.message}
                      </p>
                      <small>
                        {new Date(item.visibleAt).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </small>
                    </div>
                  </Preview>
                </li>
              ))}
            </ul>
          )}
          <footer>
            <Link to="/admin/notificacoes" onClick={() => setOpen(false)}>
              Ver central de notificações →
            </Link>
          </footer>
        </Popover>
      )}
    </Wrapper>
  );
}

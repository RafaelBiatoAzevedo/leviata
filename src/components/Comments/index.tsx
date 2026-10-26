import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import {
  FiCheckCircle,
  FiMessageSquare,
  FiSend,
  FiShield,
} from "react-icons/fi";
import { A11y, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  commentsService,
  type CommentPageTarget,
  type PublicComment,
} from "../../services/comments";
import { commentSchema } from "../../validations/comment";
import { Carousel } from "../Carousel";
import { Button, Card, Form, Section, State } from "./styles";

export function Comments(props: CommentPageTarget) {
  return (
    <CommentsContent key={`${props.targetType}:${props.targetId}`} {...props} />
  );
}

function CommentsContent({ targetType, targetId }: CommentPageTarget) {
  const id = useId();
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [fullName, setFullName] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const nameInput = useRef<HTMLInputElement>(null);
  const textInput = useRef<HTMLTextAreaElement>(null);
  const active = useRef(true);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    commentsService
      .list({ targetType, targetId }, page, controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        setComments((previous) =>
          page === 1
            ? data.items
            : [
                ...previous,
                ...data.items.filter(
                  (item) => !previous.some((old) => old.id === item.id),
                ),
              ],
        );
        setTotal(data.total);
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [targetType, targetId, page, attempt]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const result = commentSchema.safeParse({ fullName, text });
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues)
        next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      (next.fullName ? nameInput : textInput).current?.focus();
      return;
    }
    setSending(true);
    setErrors({});
    setSuccess(false);
    try {
      await commentsService.create({ targetType, targetId }, result.data);
      if (!active.current) return;
      setFullName("");
      setText("");
      setSuccess(true);
    } catch (error) {
      if (!active.current) return;
      setErrors({
        form:
          isAxiosError(error) && error.response?.status === 429
            ? "Muitos envios. Aguarde um minuto e tente novamente."
            : "Não foi possível enviar. Seu texto foi preservado; tente novamente.",
      });
    } finally {
      if (active.current) setSending(false);
    }
  }

  return (
    <Section aria-labelledby={`${id}-title`}>
      <header>
        <div>
          <small>Um espaço de troca</small>
          <h2 id={`${id}-title`}>Comentários</h2>
          <p>
            Compartilhe uma reflexão sobre este conteúdo e participe da
            conversa.
          </p>
        </div>
        {total > 0 && (
          <span>
            {total} {total === 1 ? "contribuição" : "contribuições"}
          </span>
        )}
      </header>
      {comments.length > 0 && (
        <Carousel>
          <Swiper
            modules={[A11y, Navigation, Pagination]}
            slidesPerView={1}
            slidesPerGroup={1}
            spaceBetween={20}
            breakpointsBase="container"
            breakpoints={{
              600: { slidesPerView: 2, slidesPerGroup: 2 },
              900: { slidesPerView: 3, slidesPerGroup: 3 },
            }}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            watchOverflow
            a11y={{
              containerMessage: "Comentários aprovados",
              prevSlideMessage: "Comentários anteriores",
              nextSlideMessage: "Próximos comentários",
              paginationBulletMessage: "Ir para o grupo {{index}}",
            }}
          >
            {comments.map((comment) => (
              <SwiperSlide key={comment.id}>
                <Card>
                  <FiMessageSquare aria-hidden="true" />
                  <blockquote>{comment.text}</blockquote>
                  <footer>
                    <span aria-hidden="true">
                      {comment.fullName
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                    <div>
                      <strong>{comment.fullName}</strong>
                      <time dateTime={comment.approvedAt}>
                        {new Date(comment.approvedAt).toLocaleDateString(
                          "pt-BR",
                          {
                            month: "long",
                            year: "numeric",
                            timeZone: "America/Sao_Paulo",
                          },
                        )}
                      </time>
                    </div>
                  </footer>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </Carousel>
      )}
      {loading && <State role="status">Carregando comentários…</State>}
      {loadError && comments.length > 0 && (
        <State role="alert">
          Não foi possível carregar mais comentários.
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setLoadError(false);
              setAttempt((value) => value + 1);
            }}
          >
            Tentar novamente
          </button>
        </State>
      )}
      {!loading && comments.length === 0 && (
        <State role="status">
          Nenhum comentário disponível por enquanto. Seja a primeira pessoa a
          contribuir!
        </State>
      )}
      {comments.length < total && !loadError && (
        <Button
          $secondary
          type="button"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            setPage((value) => value + 1);
          }}
        >
          Carregar mais comentários
        </Button>
      )}
      {success && (
        <State $success role="status">
          <FiCheckCircle aria-hidden="true" />
          Comentário enviado! Ele aparecerá aqui após a aprovação da equipe.
        </State>
      )}
      <Form onSubmit={submit} noValidate>
        <div>
          <h3>Deixe sua contribuição</h3>
          <p>
            <FiShield aria-hidden="true" />
            Todos os comentários passam por moderação antes de aparecerem no
            portal. Seu nome será exibido junto à mensagem aprovada.
          </p>
        </div>
        <fieldset disabled={sending} aria-label="Enviar comentário">
          <label htmlFor={`${id}-name`}>
            Nome completo
            <input
              ref={nameInput}
              id={`${id}-name`}
              autoComplete="name"
              maxLength={120}
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              aria-invalid={!!errors.fullName}
              aria-describedby={
                errors.fullName ? `${id}-name-error` : undefined
              }
            />
          </label>
          {errors.fullName && (
            <span data-error id={`${id}-name-error`}>
              {errors.fullName}
            </span>
          )}
          <label htmlFor={`${id}-text`}>
            Comentário
            <textarea
              ref={textInput}
              id={`${id}-text`}
              maxLength={300}
              required
              value={text}
              onChange={(event) => setText(event.target.value)}
              aria-invalid={!!errors.text}
              aria-describedby={`${id}-count${errors.text ? ` ${id}-text-error` : ""}`}
            />
          </label>
          <span data-count id={`${id}-count`}>
            {text.length}/300 caracteres
          </span>
          {errors.text && (
            <span data-error id={`${id}-text-error`}>
              {errors.text}
            </span>
          )}
          {errors.form && (
            <span data-error role="alert">
              {errors.form}
            </span>
          )}
          <Button type="submit" disabled={sending}>
            <FiSend aria-hidden="true" />
            {sending ? "Enviando…" : "Enviar para avaliação"}
          </Button>
        </fieldset>
      </Form>
    </Section>
  );
}

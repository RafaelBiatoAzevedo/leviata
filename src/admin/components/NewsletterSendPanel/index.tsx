import { useCallback, useEffect, useRef, useState } from "react";
import { FiRefreshCw, FiSend, FiX } from "react-icons/fi";
import { useModal } from "../../../hooks/useModal";
import { useToast } from "../../../hooks/useToast";
import type { NewsletterResponseDto } from "../../dtos/newsletter/NewsletterResponseDto";
import type { PaginatedResponseDto } from "../../dtos/PaginatedResponseDto";
import type {
  NewsletterAudience,
  NewsletterDeliveryRecord,
  NewsletterMailCampaign,
  NewsletterMailSettings,
  NewsletterRecipient,
  NewsletterRecipientStatus,
} from "../../dtos/newsletter/NewsletterMailDto";
import { newsletterMailService } from "../../services/newsletterMail";
import {
  newsletterMailError,
  newsletterSendAvailability,
} from "../../utils/newsletterDelivery";
import { AdminBadge, type TAdminBadgeVariant } from "../AdminBadge";
import { AdminButton } from "../AdminButton";
import { AdminPagination } from "../AdminPagination";
import { AdminTable } from "../AdminTable";
import {
  Controls,
  History,
  HistoryChoice,
  Notice,
  Panel,
  Summary,
} from "./styles";

interface Snapshot {
  settings: NewsletterMailSettings;
  campaign: NewsletterMailCampaign;
  audience: NewsletterAudience;
  history: PaginatedResponseDto<NewsletterRecipient | NewsletterDeliveryRecord>;
}
const campaignLabels = {
  NOT_QUEUED: "Envio não iniciado",
  PROCESSING: "Envio em andamento",
  NEEDS_REVIEW: "Há entregas para conferir",
  COMPLETED: "Envio concluído",
  CANCELLED: "Envio cancelado",
};
const deliveryLabels: Record<
  NewsletterRecipientStatus,
  { label: string; variant: TAdminBadgeVariant }
> = {
  PENDING: { label: "Aguardando", variant: "warning" },
  SENDING: { label: "Enviando", variant: "info" },
  SENT: { label: "Enviado", variant: "success" },
  FAILED: { label: "Falha", variant: "danger" },
  SKIPPED: { label: "Não enviado", variant: "secondary" },
  UNKNOWN: { label: "A conferir", variant: "warning" },
};
const date = (value: string | null) =>
  value
    ? new Date(value).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "—";

export function NewsletterSendPanel({
  newsletter,
  onCompleted,
}: {
  newsletter: NewsletterResponseDto;
  onCompleted?: (date: string) => void;
}) {
  const { showModal, updateModal } = useModal();
  const { showToast } = useToast();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [historyMode, setHistoryMode] = useState<"queue" | "records">("queue");
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    data?: Snapshot;
    error?: string;
  }>({ key: "" });
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const inFlight = useRef(false);
  const mounted = useRef(true);
  const requestKey = JSON.stringify({
    id: newsletter.id,
    page,
    limit,
    historyMode,
    revision,
  });
  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const request = JSON.parse(requestKey) as {
      id: string;
      page: number;
      limit: number;
      historyMode: "queue" | "records";
    };
    Promise.all([
      newsletterMailService.settings(controller.signal),
      newsletterMailService.status(request.id, controller.signal),
      newsletterMailService.audience(request.id, controller.signal),
      request.historyMode === "records"
        ? newsletterMailService.records(
            request.id,
            request.page,
            request.limit,
            controller.signal,
          )
        : newsletterMailService.deliveries(
            request.id,
            request.page,
            request.limit,
            controller.signal,
          ),
    ])
      .then(([settings, campaign, audience, history]) => {
        if (controller.signal.aborted) return;
        setResult({
          key: requestKey,
          data: {
            settings: settings.data,
            campaign: campaign.data,
            audience: audience.data,
            history: history.data,
          },
        });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResult({
            key: requestKey,
            error:
              "Não foi possível carregar as informações de envio. Atualize para tentar novamente.",
          });
      });
    return () => controller.abort();
  }, [requestKey]);

  const data = result.data;
  const loading = result.key !== requestKey;
  const running = data?.campaign.status === "PROCESSING";
  const completedAt = data?.campaign.campaign?.completedAt;
  const sent = data?.campaign.counts?.sent ?? 0;
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "hidden") refresh();
    }, 5000);
    return () => window.clearInterval(timer);
  }, [running, refresh]);
  useEffect(() => {
    if (completedAt && sent > 0) onCompleted?.(completedAt);
  }, [completedAt, sent, onCompleted]);

  const availability = newsletterSendAvailability(
    data?.settings,
    newsletter.publishedAt,
    newsletter.sentAt,
  );
  const counts = data?.campaign.counts;
  const canSend =
    !!data &&
    !availability &&
    data.campaign.status === "NOT_QUEUED" &&
    data.audience.eligible > 0;

  function confirm(action: "send" | "retry" | "cancel") {
    if (!data || busy || loading || inFlight.current) return;
    showModal({
      title:
        action === "cancel"
          ? "Cancelar os envios pendentes?"
          : action === "retry"
            ? "Tentar novamente as entregas com falha?"
            : "Enviar newsletter para todos os inscritos?",
      content: (
        <div>
          <p>
            <strong>{newsletter.title}</strong>
          </p>
          <p>
            Assunto: {data.campaign.campaign?.subject || newsletter.subject}
          </p>
          <p>
            {action === "cancel"
              ? "Os destinatários que ainda aguardam na fila não receberão esta edição. Uma mensagem cujo envio já começou pode ser concluída."
              : action === "retry"
                ? "Somente as entregas com falha confirmada serão tentadas novamente. Mensagens já enviadas ou que precisam de conferência não serão repetidas."
                : `${data.audience.eligible} inscritos estão aptos a receber esta edição neste momento. Todos os cadastros ativos que autorizaram e-mail serão considerados ao iniciar o envio.`}
          </p>
        </div>
      ),
      confirmText: action === "cancel" ? "Cancelar envios" : "Confirmar envio",
      cancelText: "Voltar",
      confirmVariant: action === "cancel" ? "danger" : "primary",
      onConfirm: async () => {
        if (inFlight.current) return;
        inFlight.current = true;
        setBusy(true);
        setActionError("");
        updateModal({ confirmDisabled: true, confirmText: "Processando…" });
        try {
          const { data: campaign } = await newsletterMailService[action](
            newsletter.id,
          );
          if (!mounted.current) return;
          showToast({
            title: action === "cancel" ? "Envios cancelados" : "Envio iniciado",
            description:
              action === "send"
                ? `${campaign.total ?? 0} destinatários na fila. Acompanhe as entregas nesta tela.`
                : action === "retry"
                  ? "As entregas com falha voltaram para a fila."
                  : "Os envios pendentes foram cancelados.",
            type: "success",
          });
        } catch (error) {
          if (mounted.current) setActionError(newsletterMailError(error));
        } finally {
          inFlight.current = false;
          if (mounted.current) {
            setBusy(false);
            refresh();
          }
        }
      },
    });
  }

  return (
    <Panel id="envio" aria-label="Envio e entregas da newsletter">
      <header>
        <div>
          <h2>Envio e entregas</h2>
          <p>Encaminhe esta edição aos inscritos e acompanhe os resultados.</p>
        </div>
        <AdminButton
          variant="outline"
          type="button"
          disabled={busy || loading}
          onClick={refresh}
        >
          <FiRefreshCw aria-hidden="true" />
          Atualizar
        </AdminButton>
      </header>
      {loading && !data && (
        <Notice role="status">Carregando informações de envio…</Notice>
      )}
      {result.error && (
        <Notice $error role="alert">
          {result.error}
        </Notice>
      )}
      {actionError && (
        <Notice $error role="alert">
          {actionError}
        </Notice>
      )}
      {data && (
        <>
          <p>
            <strong>
              {data.campaign.status === "NOT_QUEUED" && newsletter.sentAt
                ? "Edição marcada como enviada"
                : campaignLabels[data.campaign.status]}
            </strong>{" "}
            · Remetente: {data.settings.from}
          </p>
          {availability && <Notice role="status">{availability}</Notice>}
          {data.campaign.status === "NOT_QUEUED" && (
            <>
              <p>
                {data.audience.eligible} de {data.audience.registered} cadastros
                estão aptos a receber esta edição. Cadastros inativos, sem
                autorização ou que já receberam esta edição ficam de fora.
              </p>
              <Controls>
                <AdminButton
                  type="button"
                  disabled={!canSend || busy || loading}
                  onClick={() => confirm("send")}
                >
                  <FiSend aria-hidden="true" />
                  Enviar para todos os inscritos
                </AdminButton>
              </Controls>
            </>
          )}
          {counts && (
            <>
              <Summary aria-label="Resumo das entregas">
                {[
                  ["Aguardando", counts.pending],
                  ["Enviando", counts.sending],
                  ["Enviados", counts.sent],
                  ["Falhas", counts.failed],
                  ["Não enviados", counts.skipped],
                  ["A conferir", counts.unknown],
                ].map(([label, count]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{count}</dd>
                  </div>
                ))}
              </Summary>
              {counts.unknown > 0 && (
                <Notice>
                  Algumas entregas precisam de conferência antes de qualquer
                  novo envio. Elas não serão repetidas automaticamente.
                </Notice>
              )}
              <Controls>
                {counts.failed > 0 && data.campaign.status !== "CANCELLED" && (
                  <AdminButton
                    variant="outline"
                    type="button"
                    disabled={!!availability || busy || loading}
                    onClick={() => confirm("retry")}
                  >
                    <FiRefreshCw aria-hidden="true" />
                    Tentar novamente as falhas
                  </AdminButton>
                )}
                {running && (
                  <AdminButton
                    variant="outline"
                    type="button"
                    disabled={busy || loading}
                    onClick={() => confirm("cancel")}
                  >
                    <FiX aria-hidden="true" />
                    Cancelar envios pendentes
                  </AdminButton>
                )}
              </Controls>
            </>
          )}
          <History>
            <h3>Histórico</h3>
            <HistoryChoice role="group" aria-label="Visualização do histórico">
              <button
                type="button"
                aria-pressed={historyMode === "queue"}
                onClick={() => {
                  setHistoryMode("queue");
                  setPage(1);
                }}
              >
                Destinatários
              </button>
              <button
                type="button"
                aria-pressed={historyMode === "records"}
                onClick={() => {
                  setHistoryMode("records");
                  setPage(1);
                }}
              >
                Envios realizados
              </button>
            </HistoryChoice>
            {historyMode === "records" && (
              <p>
                Os envios são registrados quando o serviço de e-mail confirma a
                aceitação da mensagem.
              </p>
            )}
            <AdminTable
              loading={loading}
              label={
                historyMode === "records"
                  ? "Envios realizados da newsletter"
                  : "Destinatários da newsletter"
              }
            >
              <thead>
                <tr>
                  <th>Destinatário</th>
                  {historyMode === "queue" && <th>Status</th>}
                  {historyMode === "queue" && <th>Tentativas</th>}
                  <th>Enviado em</th>
                </tr>
              </thead>
              <tbody>
                {data.history.items.map((item) => {
                  const record = "subscriber" in item;
                  const status = !record ? deliveryLabels[item.status] : null;
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong>
                          {record ? item.subscriber.email : item.email}
                        </strong>
                        {record && item.subscriber.name && (
                          <>
                            <br />
                            <small>{item.subscriber.name}</small>
                          </>
                        )}
                      </td>
                      {historyMode === "queue" && (
                        <td>
                          {status && (
                            <AdminBadge variant={status.variant}>
                              {status.label}
                            </AdminBadge>
                          )}
                        </td>
                      )}
                      {historyMode === "queue" && (
                        <td>{!record ? item.attempts : "—"}</td>
                      )}
                      <td>{date(item.sentAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </AdminTable>
            {!loading && !data.history.items.length && (
              <Notice role="status">
                {historyMode === "records"
                  ? "Nenhum envio realizado ainda."
                  : "Nenhum destinatário na fila ainda."}
              </Notice>
            )}
            <AdminPagination
              page={page}
              rowsPerPage={limit}
              total={data.history.total}
              loading={loading}
              disabled={busy}
              onPageChange={setPage}
              onRowsPerPageChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
            />
          </History>
        </>
      )}
    </Panel>
  );
}

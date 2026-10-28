import { useEffect, useId, useState } from "react";
import type {
  NewsletterSendMode,
  NewsletterSubscriberOption,
} from "../../dtos/newsletter/NewsletterMailDto";
import type { PaginatedResponseDto } from "../../dtos/PaginatedResponseDto";
import { newsletterMailService } from "../../services/newsletterMail";
import { AdminButton } from "../AdminButton";
import { AdminPagination } from "../AdminPagination";
import { AdminSearchBar } from "../AdminSearchBar";
import { AdminTable } from "../AdminTable";
import {
  Actions,
  Choice,
  Choices,
  Container,
  Selection,
  Status,
  Subscriber,
} from "./styles";

interface Props {
  newsletterId: string;
  eligible: number;
  mode: NewsletterSendMode;
  selected: NewsletterSubscriberOption[];
  onModeChange: (mode: NewsletterSendMode) => void;
  onSelectionChange: (selected: NewsletterSubscriberOption[]) => void;
  revision: number;
  disabled?: boolean;
}

export function NewsletterAudiencePicker({
  newsletterId,
  eligible,
  mode,
  selected,
  onModeChange,
  onSelectionChange,
  revision,
  disabled = false,
}: Props) {
  const id = useId();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [search, setSearch] = useState("");
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    data?: PaginatedResponseDto<NewsletterSubscriberOption>;
    error?: boolean;
  }>({ key: "" });
  const requestKey = JSON.stringify({
    newsletterId,
    page,
    limit,
    search: search.trim(),
    revision,
    retry,
  });

  useEffect(() => {
    const controller = new AbortController();
    const request = JSON.parse(requestKey) as {
      newsletterId: string;
      page: number;
      limit: number;
      search: string;
    };
    newsletterMailService
      .subscribers(
        request.newsletterId,
        {
          page: request.page,
          limit: request.limit,
          search: request.search || undefined,
        },
        controller.signal,
      )
      .then(({ data }) => {
        if (!controller.signal.aborted) setResult({ key: requestKey, data });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResult({ key: requestKey, error: true });
      });
    return () => controller.abort();
  }, [requestKey]);

  const loading = result.key !== requestKey;
  const data = !loading ? result.data : undefined;
  const selectedIds = new Set(selected.map((subscriber) => subscriber.id));

  function toggle(subscriber: NewsletterSubscriberOption) {
    onSelectionChange(
      selectedIds.has(subscriber.id)
        ? selected.filter((item) => item.id !== subscriber.id)
        : [...selected, subscriber],
    );
  }

  return (
    <Container aria-labelledby={`${id}-title`}>
      <legend id={`${id}-title`}>Destinatários do envio</legend>
      <Choices>
        <Choice $active={mode === "ALL"}>
          <input
            type="radio"
            name={`${id}-mode`}
            value="ALL"
            checked={mode === "ALL"}
            disabled={disabled}
            onChange={() => onModeChange("ALL")}
          />
          <span>
            <strong>Todos os inscritos aptos</strong>
            <small>
              Enviar para os {eligible} inscritos elegíveis, em todas as
              páginas.
            </small>
          </span>
        </Choice>
        <Choice $active={mode === "SELECTED"}>
          <input
            type="radio"
            name={`${id}-mode`}
            value="SELECTED"
            checked={mode === "SELECTED"}
            disabled={disabled}
            onChange={() => onModeChange("SELECTED")}
          />
          <span>
            <strong>Selecionar destinatários</strong>
            <small>Escolha na lista quem receberá esta edição.</small>
          </span>
        </Choice>
      </Choices>
      <Actions>
        <AdminSearchBar
          placeholder="Buscar inscrito por nome ou e-mail"
          value={search}
          disabled={disabled}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        {mode === "SELECTED" && (
          <div data-selection-actions>
            <AdminButton
              type="button"
              variant="outline"
              disabled={disabled || loading || !data?.items.length}
              onClick={() =>
                onSelectionChange([
                  ...selected,
                  ...(data?.items.filter((item) => !selectedIds.has(item.id)) ??
                    []),
                ])
              }
            >
              Selecionar esta página
            </AdminButton>
            <AdminButton
              type="button"
              variant="outline"
              disabled={disabled || selected.length === 0}
              onClick={() => onSelectionChange([])}
            >
              Limpar seleção
            </AdminButton>
          </div>
        )}
      </Actions>
      <Selection role="status">
        {mode === "ALL"
          ? `Todos os ${eligible} inscritos aptos receberão esta edição. A busca filtra apenas a visualização.`
          : `${selected.length} ${selected.length === 1 ? "inscrito selecionado" : "inscritos selecionados"}. A seleção é mantida ao pesquisar ou trocar de página.`}
      </Selection>
      {result.key === requestKey && result.error ? (
        <Status role="alert">
          <p>Não foi possível carregar a lista de inscritos.</p>
          <AdminButton
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => setRetry((value) => value + 1)}
          >
            Tentar novamente
          </AdminButton>
        </Status>
      ) : (
        <>
          <AdminTable
            loading={loading}
            label="Inscritos aptos para receber a newsletter"
          >
            <thead>
              <tr>
                <th>Selecionar</th>
                <th>Nome</th>
                <th>E-mail</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>
                    <Subscriber>
                      <input
                        type="checkbox"
                        aria-label={`Selecionar ${subscriber.name || subscriber.email}`}
                        checked={
                          mode === "ALL" || selectedIds.has(subscriber.id)
                        }
                        disabled={disabled || mode === "ALL"}
                        onChange={() => toggle(subscriber)}
                      />
                    </Subscriber>
                  </td>
                  <td>{subscriber.name || "Nome não informado"}</td>
                  <td>{subscriber.email}</td>
                </tr>
              ))}
            </tbody>
          </AdminTable>
          {!loading && data?.items.length === 0 && (
            <Status role="status">
              {search.trim()
                ? "Nenhum inscrito encontrado para esta busca."
                : "Nenhum inscrito apto a receber esta edição."}
            </Status>
          )}
          {(loading || !!data?.total) && (
            <AdminPagination
              page={page}
              rowsPerPage={limit}
              total={data?.total ?? 0}
              loading={loading}
              disabled={disabled}
              onPageChange={setPage}
              onRowsPerPageChange={(value) => {
                setLimit(value);
                setPage(1);
              }}
            />
          )}
        </>
      )}
    </Container>
  );
}

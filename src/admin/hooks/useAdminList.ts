import { useEffect, useState } from "react";
import { isAxiosError, type AxiosResponse } from "axios";
import type {
  AdminListFilters,
  AdminListQuery,
  PaginatedResponseDto,
} from "../dtos/PaginatedResponseDto";

type PageFetcher<T> = (
  query: AdminListQuery,
  signal?: AbortSignal,
) => Promise<AxiosResponse<PaginatedResponseDto<T>>>;

export function useAdminList<T>(
  fetchPage: PageFetcher<T>,
  filters: AdminListFilters = {},
) {
  const filtersKey = JSON.stringify(filters);
  const [options, setOptions] = useState({
    page: 1,
    rowsPerPage: 15,
    filtersKey,
  });
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    data?: PaginatedResponseDto<T>;
    error?: string;
  }>({ key: "" });

  // Reset before rendering the new filter so an old page is never requested.
  if (options.filtersKey !== filtersKey) {
    setOptions({ ...options, page: 1, filtersKey });
  }

  const requestKey = JSON.stringify({
    filtersKey,
    page: options.filtersKey === filtersKey ? options.page : 1,
    limit: options.rowsPerPage,
    revision,
  });

  useEffect(() => {
    const controller = new AbortController();
    const request = JSON.parse(requestKey) as {
      filtersKey: string;
      page: number;
      limit: number;
    };
    const params = {
      ...(JSON.parse(request.filtersKey) as AdminListFilters),
      page: request.page,
      limit: request.limit,
    };
    fetchPage(params, controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        const lastPage = Math.max(1, Math.ceil(data.total / request.limit));
        if (request.page > lastPage) {
          setOptions((current) => ({ ...current, page: lastPage }));
          return;
        }
        setResult({ key: requestKey, data });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const message = isAxiosError<{ message?: string | string[] }>(error)
          ? error.response?.data.message
          : undefined;
        setResult({
          key: requestKey,
          error: Array.isArray(message)
            ? message.join("\n")
            : message ||
              (error instanceof Error
                ? error.message
                : "Não foi possível carregar a lista. Tente novamente."),
        });
      });
    return () => controller.abort();
  }, [fetchPage, requestKey]);

  const load = () => setRevision((current) => current + 1);
  const loading = result.key !== requestKey;
  const error = loading ? "" : (result.error ?? "");

  return {
    items: loading ? [] : (result.data?.items ?? []),
    loading,
    error,
    load,
    pagination: {
      page: options.page,
      rowsPerPage: options.rowsPerPage,
      total: result.data?.total ?? 0,
      loading,
      disabled: Boolean(error),
      onPageChange: (page: number) =>
        setOptions((current) => ({ ...current, page })),
      onRowsPerPageChange: (rowsPerPage: number) =>
        setOptions((current) => ({ ...current, page: 1, rowsPerPage })),
    },
  };
}

import { useEffect, useState } from "react";
import axios from "axios";
import type { AnalyticsReport } from "../../../analytics/types";
import { analyticsService } from "../../services/analytics";

export function useAnalytics(range: { from: string; to: string }) {
  const [revision, setRevision] = useState(0);
  const key = `${range.from}:${range.to}:${revision}`;
  const [result, setResult] = useState<{
    key: string;
    report: AnalyticsReport | null;
    error: string | null;
  }>({ key: "", report: null, error: null });
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    void analyticsService
      .report(range, controller.signal)
      .then((response) => {
        if (active) setResult({ key, report: response.data, error: null });
      })
      .catch((error) => {
        if (!active) return;
        const status = axios.isAxiosError(error)
          ? error.response?.status
          : undefined;
        setResult({
          key,
          report: null,
          error:
            status === 404
              ? "O módulo de analytics ainda não está disponível nesta API. Publique a versão atualizada do backend."
              : status === 403
                ? "Sua conta não tem permissão para consultar as estatísticas."
                : status === 429
                  ? "O limite de consultas foi atingido. Aguarde um minuto e tente novamente."
                  : "Não foi possível consultar as estatísticas. Confira sua conexão e tente novamente.",
        });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [range, key]);
  const loading = result.key !== key;
  return {
    report: loading ? null : result.report,
    error: loading ? null : result.error,
    loading,
    refresh: () => setRevision((value) => value + 1),
  };
}

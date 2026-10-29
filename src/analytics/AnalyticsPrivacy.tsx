import { useState } from "react";
import styled from "styled-components";
import {
  analyticsOptedOut,
  privacySignal,
  setAnalyticsOptOut,
} from "./privacy";

const Details = styled.details`
  max-width: 680px;
  margin: 20px auto 0;
  padding: 0 20px;
  font-size: 12px;
  line-height: 1.8;
  color: inherit;
  summary {
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  p {
    margin: 12px 0;
  }
  button {
    color: inherit;
    background: transparent;
    border: 1px solid currentColor;
    padding: 8px 12px;
    border-radius: 6px;
    min-height: 44px;
    cursor: pointer;
  }
  summary:focus-visible,
  button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
  }
`;

export function AnalyticsPrivacy() {
  const [optedOut, setOptedOut] = useState(analyticsOptedOut);
  const [error, setError] = useState(false);
  const signal = privacySignal();
  return (
    <Details>
      <summary>Privacidade das estatísticas de acesso</summary>
      <p>
        Quando ativadas, as estatísticas contam páginas públicas por dia, origem
        geral, dispositivo e navegador. Não usamos cookies de analytics,
        identificadores de visitantes, nomes, e-mails, buscas ou parâmetros de
        URL. Endereços de conteúdo são agrupados sem seus identificadores. A
        janela de consulta é de 180 dias. Registros antigos são excluídos
        durante a manutenção ou a retomada do tráfego.
      </p>
      <p>
        Respeitamos Do Not Track e Global Privacy Control. Sua preferência
        abaixo fica salva somente neste navegador. Logs de infraestrutura são
        administrados separadamente.
      </p>
      <button
        type="button"
        disabled={signal}
        aria-pressed={optedOut || signal}
        onClick={() => {
          const next = !optedOut;
          if (setAnalyticsOptOut(next)) {
            setOptedOut(next);
            setError(false);
          } else setError(true);
        }}
      >
        {signal
          ? "Coleta bloqueada pelo navegador"
          : optedOut
            ? "Permitir estatísticas anônimas"
            : "Desativar estatísticas neste navegador"}
      </button>
      <p role="status">
        {error
          ? "Não foi possível salvar a preferência. A coleta permanece desativada enquanto o armazenamento estiver indisponível."
          : optedOut || signal
            ? "Você está fora da coleta de estatísticas."
            : "Você pode desativar a coleta a qualquer momento."}
      </p>
    </Details>
  );
}

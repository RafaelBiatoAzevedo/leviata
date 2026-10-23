import styled from "styled-components";
import { Loading } from "../Loading";

const State = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 28px 16px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  line-height: 1.7;
`;

export function PublicDataState({
  loading,
  error,
  empty,
  label,
}: {
  loading: boolean;
  error: boolean;
  empty: boolean;
  label: string;
}) {
  if (loading)
    return (
      <State role="status">
        <Loading />
        <p>Carregando {label}...</p>
      </State>
    );
  if (error)
    return (
      <State role="alert">
        <p>
          Não foi possível carregar {label}. Tente novamente em alguns
          instantes.
        </p>
      </State>
    );
  if (empty)
    return (
      <State>
        <p>Nenhum registro disponível no momento.</p>
      </State>
    );
  return null;
}

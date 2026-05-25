import styled from "styled-components";

export const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 1rem;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 18px;

  flex-wrap: wrap;
`;

export const ActionButton = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;

  padding: 12px 18px;

  border-radius: 12px;

  text-decoration: none;

  background: ${({ theme }) => theme.colors.secondary};

  border: 1px solid ${({ theme }) => theme.colors.border};

  color: ${({ theme }) => theme.colors.onSecondary};

  transition: 0.3s;

  svg {
    font-size: 1.2rem;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};

    color: ${({ theme }) => theme.colors.accent};

    transform: translateY(-2px);

    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }
`;

export const Viewer = styled.div`
  width: 100%;

  max-height: 90vh;

  overflow: auto;

  display: flex;
  justify-content: center;

  padding: 20px;

  border-radius: 18px;

  background: ${({ theme }) => theme.colors.backgroundCard};

  .react-pdf__Page {
    overflow: hidden;

    border-radius: 12px;

    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);

    transition: opacity 0.2s ease;
  }

  canvas {
    max-width: 100%;
    height: auto !important;
  }
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 18px;

  flex-wrap: wrap;
`;

export const PageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 12px 18px;

  border-radius: 12px;

  border: 1px solid ${({ theme }) => theme.colors.border};

  background: ${({ theme }) => theme.colors.secondary};

  color: ${({ theme }) => theme.colors.onSecondary};

  cursor: pointer;

  transition: 0.3s;

  svg {
    font-size: 1rem;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accent};

    color: ${({ theme }) => theme.colors.accent};

    transform: translateY(-2px);

    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }

  &:disabled {
    opacity: 0.4;

    cursor: not-allowed;
  }
`;

export const PageInfo = styled.span`
  color: ${({ theme }) => theme.colors.textSoft};

  font-size: 0.95rem;
`;

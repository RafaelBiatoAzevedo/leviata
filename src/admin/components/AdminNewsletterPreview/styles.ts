import styled from "styled-components";

export const Summary = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 20px;
  max-height: 32dvh;
  padding: 18px 20px;
  overflow: auto;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.accentSoft};

  @media (max-width: 480px) {
    gap: 12px;
    padding: 14px;
  }
`;

export const Cover = styled.div`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 140px;
  height: 140px;

  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 120px;
  }
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  overflow-wrap: anywhere;

  > span {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 11px;
  }

  h3 {
    color: ${({ theme }) => theme.colors.heading};
    font-size: 22px;
    line-height: 1.2;
  }

  a {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 6px;
    color: ${({ theme }) => theme.colors.heading};
    font-size: 12px;
    text-underline-offset: 3px;

    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 3px;
    }
  }
`;

export const Metadata = styled.p`
  display: flex;
  align-items: baseline;
  gap: 7px;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 12px;
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 3px;
  }
`;

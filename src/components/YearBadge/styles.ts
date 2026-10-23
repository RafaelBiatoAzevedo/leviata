import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 2.5vw, 18px);
  width: min(100%, 270px);

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 5px;
    border-top: 1px solid ${({ theme }) => theme.colors.primary}70;
    border-bottom: 1px solid ${({ theme }) => theme.colors.primary}30;
  }
`;

export const Stamp = styled.time`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 7px clamp(16px, 3vw, 24px) 9px;
  border-block: 3px double ${({ theme }) => theme.colors.primary};
  border-inline: 1px solid ${({ theme }) => theme.colors.primary}50;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: inset 0 0 14px ${({ theme }) => theme.colors.accentSoft};
`;

export const Label = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 9px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.25em;
  text-transform: uppercase;
`;

export const Year = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-family: ${({ theme }) => theme.fonts.title};
  font-size: clamp(1.75rem, 1.5rem + 0.75vw, 2.125rem);
  font-weight: 600;
  font-variant-numeric: lining-nums tabular-nums;
  line-height: 1;
  letter-spacing: 0.03em;
`;

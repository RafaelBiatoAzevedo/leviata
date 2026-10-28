import styled from "styled-components";

export const Badge = styled.small`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  flex-shrink: 0;
  padding: 3px 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary}35;
  border-radius: 999px;
  color: ${({ theme }) => theme.colors.textSoft};
  background: ${({ theme }) => theme.colors.primary}08;
  font-size: 10px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  line-height: 1.4;
  letter-spacing: 0.4px;
  white-space: nowrap;
`;

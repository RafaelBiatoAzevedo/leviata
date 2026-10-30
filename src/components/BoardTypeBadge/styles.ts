import styled from "styled-components";

export const Badge = styled.span<{ $defense: boolean }>`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  gap: 7px;
  max-width: 100%;
  padding: 6px 11px;
  border: 1px solid
    ${({ theme, $defense }) =>
      $defense ? theme.colors.feedback.success.border : theme.colors.primary};
  border-radius: 999px;
  background: ${({ theme, $defense }) =>
    $defense ? theme.colors.feedback.success.light : theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.heading};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 600;
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    font-size: 15px;
  }
`;

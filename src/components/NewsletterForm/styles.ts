import styled from "styled-components";
import {
  portalButtonStyles,
  portalFieldStyles,
} from "../../styles/portalForms";

export const Container = styled.section<{ $size: "small" | "larger" }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: ${({ $size }) => ($size === "small" ? "450px" : "600px")};
  max-width: 100%;
  min-width: 0;
  padding: ${({ $size }) => ($size === "small" ? "22px 20px" : "32px")};
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: 0 8px 30px rgba(17, 24, 39, 0.04);
  text-align: left;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 32px;
    width: 40px;
    height: 3px;
    border-radius: 0 0 3px 3px;
    background: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 480px) {
    padding: 24px 20px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

export const HeaderIcon = styled.span`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.primary}55;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 21px;
`;

export const HeaderCopy = styled.div`
  min-width: 0;

  h3 {
    margin-bottom: 6px;
    font-size: clamp(23px, 2vw, 28px);
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: 0;
  }

  p {
    color: var(--theme-muted, #6a706b);
    font-size: 12px;
    line-height: 1.7;
    letter-spacing: 0.1px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
`;

export const NameFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
`;

export const EmailActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
  min-width: 0;

  > label {
    flex: 1 1 200px;
  }
`;

export const Input = styled.input`
  ${portalFieldStyles}
  min-height: 46px;

  &[aria-invalid="true"] {
    border-color: #b91c1c;
  }

  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

export const SubmitButton = styled.button`
  ${portalButtonStyles}
  flex: 1 0 auto;
  align-self: flex-end;
  padding-inline: 16px;
  white-space: nowrap;

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }
`;

export const Note = styled.p`
  color: var(--theme-muted, #6a706b);
  font-size: 11px;
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: 0.1px;
`;

export const FieldError = styled.span`
  color: var(--theme-danger-text, #b91c1c);
  font-size: 11px;
  font-weight: 400;
  line-height: 1.5;
`;

export const StatusMessage = styled.p<{ $error?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid
    ${({ $error }) =>
      $error
        ? "var(--theme-danger-border, #fecaca)"
        : "var(--theme-success-border, #bbf7d0)"};
  border-radius: 10px;
  background: ${({ $error }) =>
    $error
      ? "var(--theme-danger-bg, #fef2f2)"
      : "var(--theme-success-bg, #f0fdf4)"};
  color: ${({ $error }) =>
    $error
      ? "var(--theme-danger-text, #991b1b)"
      : "var(--theme-success-text, #166534)"};
  font-size: 12px;
  line-height: 1.6;
  letter-spacing: 0;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    font-size: 16px;
  }
`;

import styled from "styled-components";

export const Section = styled.section`
  width: 100%;
  min-width: 0;
  margin-top: 24px;
  padding-top: clamp(28px, 5vw, 56px);
  border-top: 1px solid ${({ theme }) => theme.colors.accentGlow};
  text-align: left;
  > header {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 24px;
    small {
      color: var(--theme-accent-text, #756037);
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    h2 {
      font-size: clamp(30px, 4vw, 42px);
      font-weight: 500;
      letter-spacing: -0.02em;
      margin: 8px 0;
    }
    p {
      color: var(--theme-muted, #616773);
      font-size: 14px;
      line-height: 1.7;
      max-width: 520px;
    }
  }
  .swiper {
    padding: 0 0 64px;
  }
  .swiper-slide {
    height: auto;
    display: flex;
  }
  .swiper-button-prev,
  .swiper-button-next {
    top: auto;
    bottom: 0;
    margin: 0;
    width: 38px;
    height: 38px;
    padding: 11px;
  }
  .swiper-button-prev {
    left: 0;
  }
  .swiper-button-next {
    right: 0;
  }
  .swiper-pagination {
    bottom: 8px;
  }
`;

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  padding: 25px;
  border: 1px solid var(--theme-border, #e8e2d6);
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  > svg {
    font-size: 22px;
    color: var(--theme-accent-text, #91733b);
    margin-bottom: 18px;
  }
  blockquote {
    font-size: 14px;
    line-height: 1.9;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    margin: 0 0 24px;
  }
  footer {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: auto;
    padding-top: 18px;
    border-top: 1px solid var(--theme-border, #e8e2d6);
  }
  footer > span {
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--theme-highlight, #ebe1cb);
    color: var(--theme-accent-text, #604b26);
    font-size: 12px;
    font-weight: 600;
  }
  strong {
    display: block;
    font-size: 13px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
  time {
    display: block;
    color: var(--theme-muted, #616773);
    font-size: 11px;
    margin-top: 3px;
  }
`;

export const Button = styled.button<{ $secondary?: boolean }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
  min-height: 44px;
  padding: 12px 18px;
  border-radius: 8px;
  border: 1px solid #c6a15b;
  background: ${({ $secondary }) => ($secondary ? "transparent" : "#c6a15b")};
  color: ${({ $secondary }) =>
    $secondary ? "var(--theme-accent-text, #292318)" : "#292318"};
  font-size: 13px;
  font-weight: 600;
  &:hover:not(:disabled) {
    background: #e8d8b7;
    color: #292318;
  }
  &:disabled {
    opacity: 0.55;
    cursor: wait;
  }
`;

export const Form = styled.form`
  margin-top: 24px;
  padding: clamp(20px, 3vw, 32px);
  border-radius: 14px;
  border: 1px solid var(--theme-border, #e8e2d6);
  background: ${({ theme }) => theme.colors.surface};
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  gap: 24px;
  h3 {
    font-size: 27px;
    font-weight: 500;
    letter-spacing: -0.02em;
    margin-bottom: 10px;
  }
  p {
    font-size: 13px;
    line-height: 1.8;
    color: var(--theme-muted, #616773);
  }
  p svg {
    vertical-align: middle;
    color: var(--theme-accent-text, #80652f);
    margin-right: 5px;
  }
  fieldset {
    border: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 13px;
    font-weight: 500;
  }
  input,
  textarea {
    width: 100%;
    min-width: 0;
    padding: 12px 14px;
    border: 1px solid var(--theme-field-border, #cbc9c1);
    border-radius: 8px;
    background: var(--theme-elevated, #fff);
    color: var(--theme-text, #111827);
    font: inherit;
    font-weight: 400;
    &[aria-invalid="true"] {
      border-color: #b42318;
    }
  }
  textarea {
    resize: vertical;
    min-height: 116px;
    line-height: 1.7;
  }
  [data-count] {
    text-align: right;
    font-size: 11px;
    color: var(--theme-muted, #616773);
    margin-top: -8px;
  }
  [data-error] {
    color: var(--theme-danger-text, #b42318);
    font-size: 12px;
    line-height: 1.6;
  }
  fieldset > button {
    align-self: flex-start;
  }
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  @media (max-width: 768px) {
    input,
    textarea {
      font-size: 16px;
    }
  }
`;

export const State = styled.div<{ $success?: boolean }>`
  padding: 22px;
  border: 1px solid
    ${({ $success }) =>
      $success
        ? "var(--theme-success-border, #abcbb5)"
        : "var(--theme-border, #e8e2d6)"};
  border-radius: 12px;
  background: ${({ $success }) =>
    $success
      ? "var(--theme-success-bg, #f1f8f3)"
      : "var(--theme-surface, #fcfaf5)"};
  font-size: 14px;
  line-height: 1.8;
  margin: 16px 0;
  svg {
    vertical-align: middle;
    margin-right: 8px;
  }
  button {
    margin-left: 12px;
    text-decoration: underline;
    font: inherit;
  }
`;

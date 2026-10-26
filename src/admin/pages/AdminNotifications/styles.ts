import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  color: var(--theme-text, #202633);
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  h1 {
    font-size: clamp(34px, 4vw, 46px);
    font-weight: 500;
    letter-spacing: -0.025em;
  }
  h2 {
    font-size: 28px;
    letter-spacing: -0.02em;
    font-weight: 500;
  }
  p {
    line-height: 1.8;
  }
  :focus-visible {
    outline: 2px solid #997735;
    outline-offset: 3px;
  }
  button:disabled {
    cursor: wait;
    opacity: 0.55;
  }
`;
export const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  small {
    color: var(--theme-accent-text, #76603b);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  h1 {
    margin: 8px 0;
  }
  p {
    font-size: 13px;
    color: var(--theme-muted, #626978);
  }
  > div:last-child {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
`;
export const Action = styled.button<{ $variant?: "gold" | "danger" }>`
  min-height: 44px;
  padding: 11px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid
    ${({ $variant }) =>
      $variant === "danger"
        ? "var(--theme-danger-border, #e8b4af)"
        : "var(--theme-border, #ddd4c1)"};
  background: ${({ $variant }) =>
    $variant === "gold"
      ? "#c6a15b"
      : $variant === "danger"
        ? "var(--theme-danger-bg, #fff4f2)"
        : "var(--theme-elevated, #fff)"};
  color: ${({ $variant }) =>
    $variant === "danger"
      ? "var(--theme-danger-text, #a52f26)"
      : $variant === "gold"
        ? "#30291c"
        : "var(--theme-text, #30291c)"};
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  &:hover:not(:disabled) {
    filter: brightness(0.96);
  }
`;
export const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  > button {
    padding: 22px;
    border-radius: 12px;
    border: 1px solid var(--theme-border, #e8e2d6);
    background: var(--theme-surface, #fcfaf5);
    display: flex;
    align-items: center;
    gap: 16px;
    text-align: left;
  }
  > button > svg {
    font-size: 24px;
    color: var(--theme-accent-text, #987536);
    flex-shrink: 0;
  }
  strong {
    font-size: 27px;
    font-weight: 500;
    display: block;
    margin-bottom: 5px;
  }
  span {
    font-size: 12px;
    color: var(--theme-muted, #626978);
    line-height: 1.6;
  }
  @media (max-width: 480px) {
    gap: 10px;
    > button {
      padding: 15px;
      gap: 10px;
    }
    > button > svg {
      font-size: 19px;
    }
  }
`;
export const Tabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  button {
    min-height: 40px;
    border: 1px solid var(--theme-border, #e8e2d6);
    padding: 9px 14px;
    border-radius: 20px;
    background: var(--theme-elevated, #fff);
    color: var(--theme-muted, #555e6c);
    font-size: 12px;
  }
  button[aria-pressed="true"] {
    color: var(--theme-on-primary, #fff);
    background: var(--theme-active, #202939);
    border-color: var(--theme-active, #202939);
  }
`;
export const Grid = styled.div<{ $selected: boolean }>`
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(0, 1.3fr);
  align-items: start;
  gap: 22px;
  min-width: 0;
  @container admin-content (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
    [data-inbox-list] {
      display: ${({ $selected }) => ($selected ? "none" : "block")};
    }
    [data-detail] {
      display: ${({ $selected }) => ($selected ? "block" : "none")};
    }
    [data-back] {
      display: inline-flex;
    }
  }
  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
    [data-inbox-list] {
      display: ${({ $selected }) => ($selected ? "none" : "block")};
    }
    [data-detail] {
      display: ${({ $selected }) => ($selected ? "block" : "none")};
    }
    [data-back] {
      display: inline-flex;
    }
  }
`;
export const Panel = styled.section`
  min-width: 0;
  border: 1px solid var(--theme-border, #e8e2d6);
  background: var(--theme-elevated, #fff);
  border-radius: 14px;
  overflow: hidden;
  > header {
    padding: 19px 22px;
    border-bottom: 1px solid var(--theme-border, #eee9df);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  > header h2 {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0;
  }
  > header span {
    font-size: 11px;
    color: var(--theme-muted, #626978);
  }
  ul {
    list-style: none;
  }
  li + li {
    border-top: 1px solid var(--theme-border, #eee9df);
  }
`;
export const ListItem = styled.button<{ $unread: boolean; $selected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 13px;
  text-align: left;
  width: 100%;
  padding: 20px;
  border-left: 3px solid
    ${({ $selected }) => ($selected ? "#a8833e" : "transparent")};
  background: ${({ $selected, $unread }) =>
    $selected
      ? "var(--theme-highlight, #f6efdf)"
      : $unread
        ? "var(--theme-surface, #fcfaf5)"
        : "var(--theme-elevated, #fff)"};
  > svg {
    font-size: 19px;
    color: var(--theme-accent-text, #987536);
    flex-shrink: 0;
    margin-top: 2px;
  }
  > div {
    min-width: 0;
    flex: 1;
  }
  strong {
    font-size: 13px;
    display: block;
    line-height: 1.6;
    font-weight: ${({ $unread }) => ($unread ? 600 : 500)};
  }
  p {
    font-size: 12px;
    color: var(--theme-muted, #626978);
    margin: 5px 0 9px;
    line-height: 1.7;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  small {
    font-size: 10px;
    color: var(--theme-muted, #626978);
  }
  > span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #a52f26;
    flex-shrink: 0;
    margin-top: 7px;
  }
  &:hover {
    background: var(--theme-highlight, #f6efdf);
  }
`;
export const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid var(--theme-border, #eee9df);
  button {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--theme-border, #e8e2d6);
    border-radius: 8px;
  }
  span {
    font-size: 11px;
    color: var(--theme-muted, #626978);
  }
`;
export const Empty = styled.div`
  padding: 48px 24px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  gap: 12px;
  > svg {
    font-size: 32px;
    color: var(--theme-accent-text, #a8833e);
  }
  h2 {
    font-size: 27px;
  }
  p {
    font-size: 13px;
    color: var(--theme-muted, #626978);
    max-width: 320px;
  }
`;
export const Detail = styled.div`
  padding: clamp(20px, 3vw, 32px);
  overflow-wrap: anywhere;
  [data-back] {
    display: none;
    margin-bottom: 24px;
  }
  @container admin-content (max-width: 800px) {
    [data-back] {
      display: inline-flex;
    }
  }
  @media (max-width: 600px) {
    [data-back] {
      display: inline-flex;
    }
  }
  h2 {
    margin: 18px 0 10px;
    line-height: 1.3;
  }
  time {
    display: block;
    font-size: 12px;
    color: var(--theme-muted, #626978);
    margin-bottom: 24px;
  }
  > p {
    font-size: 14px;
    white-space: pre-wrap;
  }
  [data-target] {
    padding: 16px;
    background: var(--theme-surface, #fcfaf5);
    border: 1px solid var(--theme-border, #e8e2d6);
    border-radius: 10px;
    font-size: 12px;
    margin-top: 24px;
    line-height: 1.8;
  }
  [data-target] a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--theme-accent-text, #765a26);
    text-decoration: none;
    font-weight: 600;
    margin-top: 8px;
  }
  [data-target] strong {
    display: block;
  }
  [data-comment] {
    margin-top: 24px;
    border-left: 3px solid #c6a15b;
    padding: 20px;
    border-radius: 0 12px 12px 0;
    background: var(--theme-surface, #fcfaf5);
  }
  [data-comment] small {
    font-size: 11px;
    color: var(--theme-muted, #626978);
    display: block;
    margin-bottom: 8px;
  }
  [data-comment] strong {
    font-size: 14px;
    display: block;
    margin-bottom: 14px;
  }
  blockquote {
    margin: 0;
    font-size: 15px;
    line-height: 1.9;
    white-space: pre-wrap;
  }
  [data-actions] {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 22px;
  }
  [data-note] {
    font-size: 12px;
    color: var(--theme-muted, #626978);
    margin-top: 18px;
  }
`;
export const Tag = styled.span<{ $tone?: "success" | "danger" | "pending" }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  color: ${({ $tone }) =>
    $tone === "success"
      ? "var(--theme-success-text, #267045)"
      : $tone === "danger"
        ? "var(--theme-danger-text, #a52f26)"
        : "var(--theme-accent-text, #765a26)"};
  background: ${({ $tone }) =>
    $tone === "success"
      ? "var(--theme-success-bg, #edf7f0)"
      : $tone === "danger"
        ? "var(--theme-danger-bg, #fff0ee)"
        : "var(--theme-highlight, #f6efdf)"};
`;
export const Notice = styled.div<{ $success?: boolean }>`
  border: 1px solid
    ${({ $success }) =>
      $success
        ? "var(--theme-success-border, #b9d7c3)"
        : "var(--theme-danger-border, #e8b4af)"};
  background: ${({ $success }) =>
    $success
      ? "var(--theme-success-bg, #edf7f0)"
      : "var(--theme-danger-bg, #fff4f2)"};
  color: ${({ $success }) =>
    $success
      ? "var(--theme-success-text, #267045)"
      : "var(--theme-danger-text, #a52f26)"};
  padding: 16px;
  font-size: 13px;
  border-radius: 10px;
  line-height: 1.8;
  button {
    text-decoration: underline;
    color: inherit;
    font: inherit;
    margin-left: 8px;
  }
`;
export const Composer = styled.form`
  padding: clamp(20px, 3vw, 30px);
  border: 1px solid var(--theme-border, #e8e2d6);
  border-radius: 14px;
  background: var(--theme-surface, #fcfaf5);
  h2 {
    margin-bottom: 8px;
  }
  p {
    color: var(--theme-muted, #626978);
    font-size: 13px;
    margin-bottom: 20px;
  }
  fieldset {
    border: 0;
    min-width: 0;
    display: grid;
    gap: 18px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  label {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 12px;
  }
  input,
  textarea,
  select {
    width: 100%;
    min-width: 0;
    background: var(--theme-elevated, #fff);
    border: 1px solid var(--theme-field-border, #cbc9c1);
    border-radius: 8px;
    padding: 12px;
    color: var(--theme-text, #202633);
    font: inherit;
  }
  textarea {
    resize: vertical;
    min-height: 100px;
    line-height: 1.8;
  }
  [data-wide] {
    grid-column: 1 / -1;
  }
  small {
    text-align: right;
    font-size: 11px;
    color: var(--theme-muted, #626978);
  }
  footer {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 20px;
  }
  @media (max-width: 600px) {
    fieldset {
      grid-template-columns: minmax(0, 1fr);
    }
  }
`;

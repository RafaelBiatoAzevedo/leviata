import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;
export const Trigger = styled.button`
  position: relative;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: var(--theme-text, #313744);
  border: 1px solid var(--theme-border, #e5dfd2);
  border-radius: 12px;
  background: var(--theme-elevated, #fff);
  font-size: 21px;
  &:hover,
  &[aria-expanded="true"] {
    background: var(--theme-highlight, #f5eddd);
    border-color: #c6a15b;
  }
  &:focus-visible {
    outline: 2px solid #997735;
    outline-offset: 3px;
  }
  > span {
    position: absolute;
    top: -5px;
    right: -5px;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 20px;
    background: #9b3631;
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    display: grid;
    place-items: center;
    border: 2px solid var(--theme-surface, #fcfaf5);
  }
`;
export const Popover = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 15px);
  width: min(390px, calc(100vw - 24px));
  padding: 0;
  border: 1px solid var(--theme-border, #e5dfd2);
  border-radius: 14px;
  box-shadow: 0 16px 50px #11182724;
  background: var(--theme-elevated, #fff);
  color: var(--theme-text, #111827);
  overflow: hidden;
  > header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 20px;
    border-bottom: 1px solid var(--theme-border, #eee9df);
  }
  h2 {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 15px;
    letter-spacing: 0;
    margin: 0;
  }
  header p {
    color: var(--theme-muted, #686c75);
    font-size: 11px;
    margin-top: 5px;
  }
  header button {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    display: grid;
    place-items: center;
  }
  header button:hover {
    background: var(--theme-highlight, #f5eddd);
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: min(400px, 55dvh);
    overflow-y: auto;
  }
  li + li {
    border-top: 1px solid var(--theme-border, #eee9df);
  }
  > footer {
    padding: 14px;
    border-top: 1px solid var(--theme-border, #eee9df);
    text-align: center;
  }
  footer a {
    color: var(--theme-accent-text, #765a26);
    text-decoration: none;
    font-size: 12px;
    font-weight: 600;
    display: block;
    padding: 7px;
  }
  [data-empty] {
    padding: 28px 20px;
    text-align: center;
    font-size: 13px;
    color: var(--theme-muted, #686c75);
    line-height: 1.8;
  }
  [data-empty] button {
    display: block;
    margin: 10px auto 0;
    text-decoration: underline;
  }
  :focus-visible {
    outline: 2px solid #997735;
    outline-offset: -3px;
  }
  @media (max-width: 600px) {
    position: fixed;
    left: 12px;
    right: 12px;
    top: 80px;
    width: auto;
  }
`;
export const Preview = styled.button<{ $unread: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  padding: 17px 20px;
  text-align: left;
  background: ${({ $unread }) =>
    $unread ? "var(--theme-surface, #fcfaf5)" : "var(--theme-elevated, #fff)"};
  > svg {
    font-size: 18px;
    color: var(--theme-accent-text, #987536);
    flex-shrink: 0;
    margin-top: 2px;
  }
  > div {
    min-width: 0;
  }
  strong {
    display: block;
    font-size: 12px;
    line-height: 1.6;
  }
  p {
    font-size: 11px;
    line-height: 1.7;
    color: var(--theme-muted, #686c75);
    margin-top: 4px;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  small {
    display: block;
    font-size: 10px;
    color: var(--theme-muted, #686c75);
    margin-top: 7px;
  }
  &:hover {
    background: var(--theme-highlight, #f4eddf);
  }
`;

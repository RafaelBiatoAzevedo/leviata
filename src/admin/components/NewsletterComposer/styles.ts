import styled from "styled-components";
import type { NewsletterContentDto } from "../../dtos/newsletter/NewsletterContentDto";

export const Container = styled.fieldset`
  min-width: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
export const Hero = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: clamp(24px, 3vw, 36px);
  border: 1px solid ${({ theme }) => theme.colors.primary}60;
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.onSecondary};
  background:
    radial-gradient(
      ellipse at top right,
      ${({ theme }) => theme.colors.primary}28,
      transparent 60%
    ),
    ${({ theme }) => theme.colors.secondary};
  > div:first-child {
    max-width: 650px;
  }
  > div > span:first-child {
    display: flex;
    gap: 8px;
    align-items: center;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 10px;
    letter-spacing: 2px;
  }
  h2 {
    margin: 14px 0 12px;
    color: inherit;
    font: 500 clamp(27px, 3vw, 38px)/1.15 ${({ theme }) => theme.fonts.title};
  }
  p {
    font-size: 13px;
    line-height: 1.8;
    opacity: 0.8;
  }
  > div:last-child {
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    gap: 12px;
    font-size: 11px;
    opacity: 0.8;
  }
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    > div:last-child {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
`;
export const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  @container admin-content (max-width: 700px) {
    grid-template-columns: minmax(0, 1fr);
  }
  @media (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
export const TemplateCard = styled.button<{
  $template: NewsletterContentDto["template"];
}>`
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  text-align: left;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  cursor: pointer;
  &[aria-pressed="true"] {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.primary};
  }
  > svg {
    position: absolute;
    right: 20px;
    top: 20px;
    padding: 4px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
  }
  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
  @media (max-width: 800px) {
    flex-direction: row;
    gap: 16px;
  }
`;
export const Miniature = styled.div<{
  $template: NewsletterContentDto["template"];
}>`
  display: flex;
  flex-direction: column;
  min-height: 164px;
  overflow: hidden;
  border-radius: 7px;
  border: 1px solid #d7c69e;
  background: #fff;
  > div {
    padding: 16px 12px;
    text-align: center;
    background: ${({ $template }) =>
      $template === "CLASSIC"
        ? "#ad5e0b"
        : $template === "EDITORIAL"
          ? "#171b22"
          : "#fff3d1"};
    color: ${({ $template }) =>
      $template === "CLASSIC"
        ? "#fff"
        : $template === "EDITORIAL"
          ? "#f3d792"
          : "#20271f"};
  }
  b {
    display: block;
    font:
      18px Georgia,
      serif;
  }
  small {
    display: block;
    margin-top: 5px;
    font:
      7px Georgia,
      serif;
  }
  > section {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 14px 22px;
  }
  em {
    width: 36%;
    height: 4px;
    margin-bottom: 3px;
    background: #c6a15b;
  }
  strong {
    width: 74%;
    height: 5px;
    background: #414639;
  }
  section > span {
    height: 2px;
    background: #e3ded4;
  }
  section > span:nth-last-child(1) {
    width: 64%;
  }
  section > i {
    display: ${({ $template }) => ($template === "CLASSIC" ? "none" : "block")};
    height: 22px;
    background: linear-gradient(135deg, #d2c39d, #f4eedb);
  }
  @media (max-width: 800px) {
    min-height: 140px;
    flex: 0 0 120px;
    > div {
      padding: 12px 5px;
    }
    b {
      font-size: 14px;
    }
    section {
      padding: 12px;
    }
  }
  @media (max-width: 400px) {
    flex-basis: 90px;
  }
`;
export const TemplateText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 4px 6px;
  small {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 9px;
    letter-spacing: 1.5px;
  }
  strong {
    color: ${({ theme }) => theme.colors.heading};
    font: 600 25px/1.2 ${({ theme }) => theme.fonts.title};
  }
  span {
    font-size: 12px;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.textSoft};
  }
`;
export const Block = styled.section`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: clamp(18px, 2.5vw, 28px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surface};
`;
export const BlockHeader = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  > div:first-child {
    min-width: 0;
  }
  > div > span {
    font-size: 10px;
    letter-spacing: 1.4px;
    color: ${({ theme }) => theme.colors.textSoft};
  }
  h3 {
    margin-top: 6px;
    color: ${({ theme }) => theme.colors.heading};
    font: 600 25px/1.2 ${({ theme }) => theme.fonts.title};
    overflow-wrap: anywhere;
  }
  > svg,
  > span {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 12px;
  }
`;
export const CoverOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  min-width: 0;
  @media (max-width: 420px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
export const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
`;
export const BlockActions = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  button {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.heading};
    background: ${({ theme }) => theme.colors.surface};
    cursor: pointer;
  }
  button:hover:not(:disabled),
  button:focus-visible {
    background: ${({ theme }) => theme.colors.accentSoft};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  button:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
  button:disabled {
    opacity: 0.35;
    cursor: default;
  }
  @media (pointer: coarse) {
    button {
      width: 44px;
      height: 44px;
    }
  }
`;
export const ItemPanel = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 20px;
`;
export const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  > span {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 10px;
    letter-spacing: 1.5px;
  }
`;
export const MediaDetails = styled.details`
  border: 1px dashed ${({ theme }) => theme.colors.primary}70;
  border-radius: 10px;
  summary {
    min-height: 44px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.heading};
    cursor: pointer;
    list-style: none;
  }
  summary::after {
    content: "+";
    margin-left: auto;
    font-size: 20px;
  }
  &[open] summary::after {
    content: "−";
  }
  summary:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;
export const ImageFields = styled.div<{ $hasImage: boolean }>`
  padding: 18px;
  display: grid;
  grid-template-columns: ${({ $hasImage }) =>
    $hasImage ? "minmax(0,.8fr) minmax(0,1fr)" : "minmax(0,1fr)"};
  gap: 22px;
  > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  @container admin-content (max-width:850px) {
    grid-template-columns: minmax(0, 1fr);
  }
  @media (max-width: 950px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;
export const AddSection = styled.div`
  text-align: center;
  padding: 28px 20px;
  border: 1px dashed ${({ theme }) => theme.colors.primary}90;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.accentSoft};
  h3 {
    color: ${({ theme }) => theme.colors.heading};
    font: 600 25px/1.2 ${({ theme }) => theme.fonts.title};
  }
  p {
    margin: 10px 0 20px;
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 12px;
    line-height: 1.7;
  }
`;
export const QuickSections = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  button {
    display: flex;
    align-items: center;
    gap: 6px;
    min-height: 40px;
    padding: 9px 12px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 20px;
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.heading};
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
  }
  button:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

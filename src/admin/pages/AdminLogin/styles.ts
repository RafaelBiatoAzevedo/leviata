import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.main`
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 24px clamp(20px, 4vw, 64px);
  background: ${({ theme }) => theme.colors.surface};
  background-image: radial-gradient(
    ellipse at 15% 10%,
    ${({ theme }) => theme.colors.primary}0d,
    transparent 65%
  );

  &::before {
    content: "";
    position: absolute;
    inset: 12px;
    z-index: -1;
    pointer-events: none;
    border: 1px solid ${({ theme }) => theme.colors.primary}22;
    border-radius: 28px;
  }

  @media (max-width: 600px) {
    padding: 20px;
    &::before {
      inset: 8px;
      border-radius: 20px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none;
      transition: none;
    }
  }
`;

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
`;

export const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border}65;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;
  transition:
    background 0.2s,
    border-color 0.2s;
  svg {
    width: 17px;
    height: 17px;
  }
  &:hover {
    background: ${({ theme }) => theme.colors.accentSoft};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }
`;

export const Content = styled.div`
  flex: 1;
  display: grid;
  place-items: center;
  padding: 40px 0;
  @media (max-width: 600px) {
    padding: 24px 0;
  }
`;

export const Card = styled.section`
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  width: 100%;
  max-width: 1000px;
  min-width: 0;
  min-height: 550px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.primary}55;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0 24px 80px rgb(0 0 0 / 8%);

  @media (max-width: 820px) {
    grid-template-columns: minmax(0, 1fr);
    max-width: 480px;
    min-height: 0;
    border-radius: 20px;
  }
`;

export const BrandPanel = styled.aside`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  overflow: hidden;
  padding: 42px;
  background: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.onSecondary};

  &::before {
    content: "";
    position: absolute;
    right: -180px;
    bottom: -180px;
    width: 400px;
    height: 400px;
    border: 1px solid ${({ theme }) => theme.colors.primary}35;
    border-radius: 50%;
    box-shadow:
      0 0 0 36px ${({ theme }) => theme.colors.primary}08,
      0 0 0 72px ${({ theme }) => theme.colors.primary}05;
    pointer-events: none;
  }
  &::after {
    content: "";
    position: absolute;
    inset: 0 0 auto;
    height: 3px;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.colors.primary},
      transparent
    );
  }

  @media (max-width: 820px) {
    padding: 22px 28px;
    &::before {
      display: none;
    }
  }
`;

export const Brand = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  img {
    flex-shrink: 0;
    width: 58px;
    height: 58px;
    padding: 3px;
    border: 1px solid ${({ theme }) => theme.colors.primary}80;
    border-radius: 50%;
  }
  span {
    display: block;
    margin-bottom: 7px;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  strong {
    display: block;
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 27px;
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: 0;
  }
  @media (max-width: 820px) {
    img {
      width: 44px;
      height: 44px;
    }
    strong {
      font-size: 24px;
    }
    span {
      font-size: 8px;
      margin-bottom: 4px;
      letter-spacing: 1.5px;
    }
  }
`;

export const Story = styled.div`
  position: relative;
  margin: 56px 0;
  > span {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  h2 {
    margin: 18px 0 20px;
    font-size: clamp(34px, 3.1vw, 44px);
    font-weight: 500;
    line-height: 1.16;
    letter-spacing: -0.4px;
  }
  p {
    max-width: 300px;
    color: ${({ theme }) => theme.colors.onSecondary};
    opacity: 0.8;
    font-size: 13px;
    line-height: 1.9;
    letter-spacing: 0;
  }
  @media (max-width: 820px) {
    display: none;
  }
`;

export const PanelFootnote = styled.p`
  position: relative;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.primary}35;
  color: ${({ theme }) => theme.colors.onSecondary};
  font-size: 10px;
  line-height: 1.8;
  letter-spacing: 0.5px;
  @media (max-width: 820px) {
    display: none;
  }
`;

export const FormPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  padding: 48px;
  @media (max-width: 1000px) {
    padding: 36px;
  }
  @media (max-width: 600px) {
    padding: 30px 24px 34px;
  }
`;

export const Eyebrow = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  svg {
    color: ${({ theme }) => theme.colors.primary};
    width: 15px;
    height: 15px;
  }
`;

export const Title = styled.h1`
  margin: 0 0 10px;
  color: ${({ theme }) => theme.colors.heading};
  font-size: clamp(32px, 3.1vw, 42px);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -0.7px;
`;

export const Subtitle = styled.p`
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.72;
  font-size: 13px;
  line-height: 1.7;
  letter-spacing: 0;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  label {
    color: ${({ theme }) => theme.colors.text};
    font-size: 13px;
    font-weight: 500;
  }
`;

export const FieldControl = styled.div`
  position: relative;
  min-width: 0;
`;

export const FieldIcon = styled.span`
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 16px;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.primary};
  pointer-events: none;
  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Input = styled.input<{ $password?: boolean }>`
  width: 100%;
  min-width: 0;
  height: 52px;
  padding: 0 ${({ $password }) => ($password ? "54px" : "16px")} 0 46px;
  border: 1px solid ${({ theme }) => theme.colors.border}70;
  border-radius: 10px;
  outline: none;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  letter-spacing: 0;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSoft};
    font-size: 13px;
  }
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.accentSoft};
  }
  &:disabled {
    opacity: 0.65;
    cursor: wait;
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  svg {
    width: 19px;
    height: 19px;
  }
  &:hover {
    background: ${({ theme }) => theme.colors.accentSoft};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

export const ErrorNotice = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.feedback.danger.border};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.feedback.danger.light};
  color: var(--theme-danger-text, #b91c1c);
  font-size: 12px;
  line-height: 1.7;
  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-top: 2px;
  }
`;

const spin = keyframes`to { transform: rotate(360deg); }`;

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  margin-top: 4px;
  padding: 12px 20px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  font-size: 14px;
  font-weight: 600;
  transition:
    background 0.2s,
    box-shadow 0.2s;
  svg {
    width: 18px;
    height: 18px;
  }
  [data-loading] {
    animation: ${spin} 1s linear infinite;
  }
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accentHover};
    box-shadow: 0 6px 20px ${({ theme }) => theme.colors.accentGlow};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 4px;
  }
  &:disabled {
    opacity: 0.7;
    cursor: wait;
  }
`;

export const Footer = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px 12px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.6;
  font-size: 10px;
  line-height: 1.8;
  letter-spacing: 0;
`;

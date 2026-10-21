import styled from "styled-components";
import { portalContent } from "../../styles/portal";
import { Links, SocialButton } from "../../components/SocialLinks/styles";

export const Container = styled.div`
  width: 100%;
  margin-top: var(--portal-header-height, 70px);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  ${portalContent}
`;

export const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.2fr);
  align-items: stretch;
  gap: 24px;
  width: 100%;
  max-width: 1140px;

  > section {
    width: 100%;
  }

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const InfoPanel = styled.aside`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  isolation: isolate;
  overflow: hidden;
  padding: clamp(24px, 3vw, 40px);
  border: 1px solid ${({ theme }) => theme.colors.primary}55;
  border-radius: 20px;
  background:
    radial-gradient(
      ellipse at 100% 0%,
      ${({ theme }) => theme.colors.accentGlow},
      transparent 65%
    ),
    ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.onSecondary};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 40px;
    width: 56px;
    height: 3px;
    background: ${({ theme }) => theme.colors.primary};
  }

  > p {
    max-width: 38ch;
    color: rgba(229, 231, 235, 0.75);
    font-size: 14px;
    line-height: 1.85;
    letter-spacing: 0.1px;
  }
`;

export const Eyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 10px;
  font-weight: 600;
  line-height: 1.6;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export const PanelTitle = styled.h2`
  color: #fcfaf5;
  font-size: clamp(32px, 3vw, 42px);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0;
`;

export const EmailLink = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 18px 14px;
  border: 1px solid ${({ theme }) => theme.colors.primary}55;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.035);
  color: #fcfaf5;
  text-decoration: none;
  transition:
    background 0.2s ease,
    border-color 0.2s ease;

  > svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 20px;
  }

  > svg:last-child {
    margin-left: auto;
    font-size: 17px;
  }

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentSoft};
  }
`;

export const EmailCopy = styled.span`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;

  span {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 10px;
    letter-spacing: 0.5px;
  }

  strong {
    font-size: 12px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }
`;

export const Networks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid rgba(198, 161, 91, 0.2);

  h3 {
    font-size: 23px;
    font-weight: 600;
    letter-spacing: 0;
  }

  p {
    color: rgba(229, 231, 235, 0.65);
    font-size: 12px;
    line-height: 1.7;
    letter-spacing: 0.1px;
  }

  ${Links} {
    justify-content: flex-start;
    gap: 12px;
    margin-top: 4px;
  }

  ${SocialButton} {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.04);
    font-size: 20px;

    &:hover,
    &:focus-visible {
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.secondary};
      box-shadow: none;
      transform: translateY(-2px);
    }
  }
`;

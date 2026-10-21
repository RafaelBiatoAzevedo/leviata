import { portalContent } from "../../styles/portal";
import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin-top: var(--portal-header-height, 70px);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;

  ${portalContent}
`;

export const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  max-width: 1040px;
  padding: 8px;
  border: 1px solid rgba(17, 24, 39, 0.1);
  border-radius: 16px;
  background: #fcfaf5;
  box-shadow: 0 8px 30px rgba(17, 24, 39, 0.03);

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const TabButton = styled.button<{
  $active: boolean;
}>`
  position: relative;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  min-height: 100px;
  padding: 22px 16px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.secondary : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.onSecondary : theme.colors.secondary};
  text-align: left;
  cursor: pointer;

  transition:
    background 0.25s ease,
    color 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;

  &::after {
    content: "";
    position: absolute;
    right: 16px;
    bottom: 0;
    left: 16px;
    height: 2px;
    border-radius: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transform: scaleX(${({ $active }) => ($active ? 1 : 0)});
    transition: transform 0.25s ease;
  }

  &:hover,
  &:focus-visible {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(17, 24, 39, 0.07);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 8px;
    min-height: 72px;
    padding: 14px 10px;
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    &::after {
      transition: none;
    }

    &:hover,
    &:focus-visible {
      transform: none;
    }
  }
`;

export const TabIcon = styled.span`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(198, 161, 91, 0.25);
  border-radius: 9px;
  background: rgba(198, 161, 91, 0.08);
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    font-size: 15px;
  }
`;

export const TabCopy = styled.span`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;

  strong {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: 23px;
    font-weight: 600;
    line-height: 1.1;
    letter-spacing: 0;
  }

  span {
    font-size: 10px;
    line-height: 1.4;
    letter-spacing: 0;
    opacity: 0.65;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    strong {
      font-size: 19px;
    }

    span {
      display: none;
    }
  }
`;

export const TabOrdinal = styled.span`
  position: absolute;
  top: 8px;
  right: 12px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 8px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
  opacity: 0.7;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const panelReveal = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const TabPanel = styled.div`
  width: 100%;
  min-width: 0;
  animation: ${panelReveal} 0.25s ease;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 6px;
    border-radius: 12px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export { Container as Carousel } from "../../components/Carousel/styles";

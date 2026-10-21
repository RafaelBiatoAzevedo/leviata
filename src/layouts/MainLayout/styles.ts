import styled, { createGlobalStyle } from "styled-components";

// Keep the public portal readable without changing the admin's sizing.
export const PortalGlobalStyle = createGlobalStyle`
  html:root {
    font-size: 14px;
    scroll-padding-top: 86px;
  }

  @media (prefers-reduced-motion: reduce) {
    html:root {
      scroll-behavior: auto;
    }
  }
`;

export const Portal = styled.div`
  --portal-header-height: 70px;
  min-width: 0;
  overflow-wrap: anywhere;

  main {
    min-width: 0;
    min-height: 60vh;
  }

  :where(img, video, iframe) {
    max-width: 100%;
  }

  button,
  a,
  input,
  textarea,
  select {
    -webkit-tap-highlight-color: transparent;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }

  @media (max-width: 768px) {
    --portal-header-height: 64px;

    input,
    textarea,
    select {
      font-size: 16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
`;

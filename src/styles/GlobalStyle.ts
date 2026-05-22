import { createGlobalStyle } from "styled-components";

import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 14px;
    scroll-behavior: smooth;
  }

  body {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    transition: background 0.3s ease, color 0.3s ease;
    font-family: ${({ theme }) => theme.fonts.body};
  }

  h1, h2, h3, h4, h5, h6 {
      font-family: ${({ theme }) => theme.fonts.title};
    font-weight: 700;
    letter-spacing: 1.5px;
  }

  span, p, li, a {
    letter-spacing: 0.5px;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: 0.5px;
  }

  input,
  textarea,
  button,
  select {
    font-family: ${({ theme }) => theme.fonts.body};
    letter-spacing: 0.5px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    html {
      font-size: 11px;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    html {
      font-size: 10px;
    }
  }

   @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    html {
      font-size: 9px;
    }
  }
`;

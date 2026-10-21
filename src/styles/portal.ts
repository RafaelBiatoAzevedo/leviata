import { css } from "styled-components";

export const portalContent = css`
  width: 100%;
  max-width: 1440px;
  min-width: 0;
  margin-inline: auto;
  padding: 32px clamp(16px, 4vw, 64px);

  @media (max-width: 768px) {
    padding-block: 28px;
    gap: 28px;
  }
`;

export const portalGrid = css`
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: stretch;
  gap: clamp(20px, 3vw, 36px);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

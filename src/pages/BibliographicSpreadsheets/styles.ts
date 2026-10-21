import { portalContent } from "../../styles/portal";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: var(--portal-header-height, 70px);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  ${portalContent}
`;

export const Paragraph = styled.p`
  text-align: justify;
  font-size: 1.2rem;
  width: 100%;
  max-width: 900px;
`;

export const DossiersGrid = styled.div`
  width: 100%;
  max-width: 1100px;

  display: flex;
  gap: clamp(24px, 3vw, 40px);
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

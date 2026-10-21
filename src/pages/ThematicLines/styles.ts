import { portalContent } from "../../styles/portal";
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: var(--portal-header-height, 70px);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4rem;
  ${portalContent}
`;

export const ThematicLinesGrid = styled.div`
  width: 100%;
  max-width: 1300px;
  align-self: center;

  display: flex;
  gap: clamp(24px, 3vw, 40px);
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

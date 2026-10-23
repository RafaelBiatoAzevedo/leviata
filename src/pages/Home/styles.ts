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

  > h1 {
    max-width: 1100px;
    font-size: clamp(18px, 2vw, 24px);
    line-height: 1.3;
    text-align: center;
  }
  ${portalContent}
`;

export const Hero = styled.picture`
  display: block;
  width: 100%;
`;

export const ImageHero = styled.img`
  display: block;
  width: 100%;
  height: auto;
`;

export const LinesLInksWrapper = styled.div`
  align-items: stretch;
  justify-content: center;
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 4rem;
`;

export { Container as Carousel } from "../../components/Carousel/styles";

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

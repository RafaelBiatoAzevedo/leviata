import { portalContent } from "../../styles/portal";
import styled from "styled-components";
import {
  Container as ParagraphContainer,
  Paragraph,
} from "../../components/ParagraphText/styles";

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

  @media (max-width: 640px) {
    > ${ParagraphContainer} {
      margin-inline: auto;

      ${Paragraph} {
        text-align: justify;
        text-align-last: center;
      }
    }
  }
`;

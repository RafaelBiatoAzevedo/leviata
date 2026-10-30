import { portalContent, portalGrid } from "../../styles/portal";
import styled from "styled-components";
import {
  CompactLinkCard,
  detailsFooterStyles,
} from "../../components/LinkCard/FeaturedLinkCard";

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

export const Grid = styled.div`
  ${portalGrid}
`;

export const ActivityCard = styled(CompactLinkCard).attrs({ detailsFooter: true })`
  padding-bottom: 22px;
  ${detailsFooterStyles}

  @media (max-width: 640px) {
    padding-bottom: 20px;
  }
`;

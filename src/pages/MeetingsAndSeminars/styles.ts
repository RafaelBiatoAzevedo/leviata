import { portalContent, portalGrid } from "../../styles/portal";
import styled from "styled-components";

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

export { CompactDatedLinkCard as MeetingCard } from "../../components/LinkCard/FeaturedLinkCard";

import styled from "styled-components";
import { portalContent } from "../../styles/portal";

export const Container = styled.div`
  width: 100%;
  margin-top: var(--portal-header-height, 70px);
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  ${portalContent}
`;

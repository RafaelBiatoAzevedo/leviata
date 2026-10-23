import { portalContent } from "../../styles/portal";
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

export const ContainerLoading = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 800px;
  align-items: center;
  justify-content: center;
`;

export const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

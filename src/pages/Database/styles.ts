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

export const Title = styled.h2`
  font-size: 2rem;
  text-align: center;
  width: 100%;
  max-width: 900px;
`;

export const ParagraphDecoration = styled.p`
  text-align: center;
  font-size: 1rem;
  width: 100%;
  max-width: 900px;
  color: ${({ theme }) => theme.colors.primary};
`;

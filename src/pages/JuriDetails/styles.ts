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

export const ContainerLoading = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 800px;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h2`
  font-size: 2.6rem;
  line-height: 1.1;
  text-align: center;
  width: 100%;
  max-width: 900px;
`;

export const MainImage = styled.img`
  width: min(100%, 900px);
  height: auto;

  border-radius: 2rem;
  border: 2px solid ${({ theme }) => theme.colors.primary};

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.08),
    0 16px 48px rgba(0, 0, 0, 0.12);
`;

export const Subtitle = styled.h3`
  font-size: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  max-width: 900px;
`;

export const TestimoniesGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));

  gap: 1.5rem;
`;

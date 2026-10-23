import styled from "styled-components";
import { portalContent } from "../../styles/portal";

export { Container, Status } from "../../components/GalleryDetails/styles";

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  ${portalContent}
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 36px;
  width: 100%;
  max-width: 1080px;
  min-width: 0;
`;

export const Details = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 0;

  > div {
    min-width: 0;
    padding: 22px;
    border: 1px solid ${({ theme }) => theme.colors.primary}40;
    border-radius: 14px;
    background: ${({ theme }) => theme.colors.surface};
  }

  dt {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #626973;
    font-size: 12px;
  }
  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }
  dd {
    margin: 10px 0 0;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 15px;
    line-height: 1.7;
    overflow-wrap: anywhere;
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;

  > p {
    color: #626973;
    line-height: 1.8;
  }
`;

export const Profiles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 20px;
`;

export { ResourceLinks } from "../../components/PersonProfile/styles";

export const Meeting = styled.article`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  min-width: 0;
  padding: clamp(20px, 3vw, 28px);
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  > div {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }
  > img {
    width: 140px;
    max-width: 100%;
    border-radius: 8px;
  }
  span {
    color: #626973;
    font-size: 11px;
  }
  h3 {
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 27px;
    line-height: 1.2;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }
  p {
    color: #626973;
    font-size: 13px;
    line-height: 1.8;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const RecordDates = styled.footer`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.primary}30;
  color: #626973;
  font-size: 11px;
  line-height: 1.8;
`;

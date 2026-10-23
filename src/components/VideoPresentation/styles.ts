import styled from "styled-components";
import { Paragraph } from "../ParagraphText/styles";

export const PresentationSection = styled.section`
  width: 100%;
  min-width: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const PresentationHeading = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
  min-width: 0;
  max-width: 900px;
  text-align: center;
`;

export const PresentationLabel = styled.span<{ $uppercase?: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  text-align: center;
  text-transform: ${({ $uppercase }) => ($uppercase ? "uppercase" : "none")};
  overflow-wrap: anywhere;
`;

export const PresentationTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};

  font-size: 2rem;

  line-height: 1.2;

  text-align: center;

  max-width: 900px;

  font-family: ${({ theme }) => theme.fonts.title};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.4rem;
    line-height: 1.25;
    letter-spacing: 0.2px;
    text-wrap: balance;
  }
`;

export const VideoWrapper = styled.div`
  width: 100%;
  min-width: 0;
  max-width: 1100px;

  aspect-ratio: 16 / 9;

  overflow: hidden;

  border-radius: 18px;

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.45),
    0 0 30px ${({ theme }) => theme.colors.accentGlow};

  iframe {
    display: block;
    width: 100%;
    height: 100%;

    border: none;
  }
`;

export const VideosSection = styled.section`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  .swiper-wrapper {
    align-items: stretch;
  }
`;

export const VideoCard = styled.article`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.accentSoft};
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 30px rgba(17, 24, 39, 0.08);

  ${VideoWrapper} {
    flex-shrink: 0;
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
`;

export const VideoCardBody = styled.div`
  --video-card-padding: clamp(18px, 3vw, 26px);

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: var(--video-card-padding);
  overflow-wrap: anywhere;

  ${PresentationTitle} {
    font-size: clamp(1.4rem, 1.2rem + 0.5vw, 1.65rem);
    line-height: 1.25;
    text-wrap: balance;
  }

  ${PresentationLabel} {
    font-size: 0.8rem;
  }

  ${Paragraph} {
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

export const VideoCardHeader = styled(VideoCardBody)`
  flex-shrink: 0;
  justify-content: center;
  min-height: calc(
    var(--video-heading-height, 0px) + var(--video-card-padding) +
      var(--video-card-padding)
  );
`;

import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin-top: 70px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 16rem;
  gap: 3rem;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
`;

export const Paragraph = styled.p`
  text-align: center;
  font-size: 1.4rem;
  padding: 0px 8rem;
`;

export const PresentationSection = styled.section`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4rem 0px;

  gap: 1rem;
`;

export const PresentationLabel = styled.span`
  color: ${({ theme }) => theme.colors.accent};

  font-size: 0.9rem;

  letter-spacing: 2px;

  text-transform: uppercase;

  text-align: center;
`;

export const PresentationTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};

  font-size: 2rem;

  line-height: 1.2;

  text-align: center;

  max-width: 900px;

  font-family: ${({ theme }) => theme.fonts.title};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

export const VideoWrapper = styled.div`
  width: 100%;
  max-width: 1100px;

  aspect-ratio: 16 / 9;

  overflow: hidden;

  border-radius: 18px;

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.45),
    0 0 30px ${({ theme }) => theme.colors.accentGlow};

  iframe {
    width: 100%;
    height: 100%;

    border: none;
  }
`;

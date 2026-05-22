import styled from "styled-components";

export const Container = styled.section`
  width: 100%;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 1400px;

  margin: 0 auto;

  padding: 120px 8%;

  display: flex;
  flex-direction: column;

  gap: 60px;
`;

export const Intro = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};

  font-size: 1.05rem;

  line-height: 1.9;

  max-width: 900px;
`;

export const Timeline = styled.div`
  display: flex;
  flex-direction: column;

  gap: 36px;

  position: relative;

  padding-left: 32px;

  &::before {
    content: "";

    position: absolute;

    left: 10px;
    top: 0;

    width: 2px;
    height: 100%;

    background: ${({ theme }) => theme.colors.border};
  }
`;

export const TimelineItem = styled.div`
  position: relative;

  display: flex;
`;

export const TimelineDot = styled.div`
  width: 20px;
  height: 20px;

  border-radius: 50%;

  background: ${({ theme }) => theme.colors.accent};

  position: absolute;

  left: -32px;
  top: 8px;

  box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
`;

export const TimelineContent = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 14px;

  padding: 28px;

  border-radius: 18px;

  background: ${({ theme }) => theme.colors.secondary};

  border: 1px solid rgba(255, 255, 255, 0.06);

  transition:
    transform 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);

    border-color: ${({ theme }) => theme.colors.accent};

    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.35),
      0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }
`;

export const EventDate = styled.span`
  color: ${({ theme }) => theme.colors.accent};

  font-size: 0.95rem;

  letter-spacing: 0.5px;
`;

export const EventTitle = styled.h3`
  color: ${({ theme }) => theme.colors.onSecondary};

  font-size: 1.45rem;

  line-height: 1.5;

  font-family: ${({ theme }) => theme.fonts.title};
`;

export const EventLink = styled.a`
  width: 100%;
  text-align: end;

  color: ${({ theme }) => theme.colors.accent};

  text-decoration: none;

  font-weight: 600;

  transition: 0.3s;

  &:hover {
    opacity: 0.8;

    transform: translateX(4px);
  }
`;

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
  gap: 2rem;
`;

export const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};

  font-size: 2rem;

  font-family: ${({ theme }) => theme.fonts.title};
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
  width: 900px;

  display: flex;
  flex-direction: column;

  gap: 12px;

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

export const EventTitle = styled.h3`
  color: ${({ theme }) => theme.colors.onSecondary};

  font-size: 1.4rem;

  line-height: 1.4;

  font-family: ${({ theme }) => theme.fonts.title};
`;

export const EventDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};

  line-height: 1.8;

  font-size: 1rem;
`;

export const EventDate = styled.span`
  color: ${({ theme }) => theme.colors.accent};

  font-size: 0.95rem;

  letter-spacing: 0.5px;
`;

export const YearBlock = styled.div`
  display: flex;
  flex-direction: column;

  gap: 32px;
`;

export const YearTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary};

  font-size: 2.2rem;

  font-family: ${({ theme }) => theme.fonts.title};

  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  padding-bottom: 12px;
`;

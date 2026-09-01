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
  padding: 2rem 16rem;
  gap: 3rem;
`;

export const Intro = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};

  font-size: 1.05rem;

  line-height: 1.9;

  max-width: 900px;
`;

export const Timeline = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;

  gap: 2rem;

  padding-left: 2rem;

  &::before {
    content: "";

    position: absolute;

    left: 10px;
    top: 0;
    bottom: 0;

    width: 2px;

    background: ${({ theme }) => theme.colors.border};
  }

  @media (max-width: 768px) {
    padding-left: 1.5rem;
  }
`;

export const TimelineItem = styled.div`
  position: relative;

  display: flex;
  align-items: flex-start;
  width: 900px;
`;

export const TimelineDot = styled.div`
  position: absolute;

  left: -1.91rem;
  top: 1.8rem;

  width: 20px;
  height: 20px;

  border-radius: 50%;

  border: 4px solid ${({ theme }) => theme.colors.background};

  z-index: 2;
  background: ${({ theme }) => theme.colors.primary};

  @media (max-width: 768px) {
    left: -1.45rem;
  }
`;

export const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  padding: 2rem;

  border-radius: 18px;

  background: ${({ theme }) => theme.colors.surface};

  border: 1px solid ${({ theme }) => theme.colors.border};

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);

  transition: 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const EventDate = styled.span`
  color: ${({ theme }) => theme.colors.accent};

  font-size: 0.95rem;
  font-weight: 700;

  letter-spacing: 0.5px;
`;

export const EventTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};

  font-size: 1.4rem;

  line-height: 1.4;

  font-family: ${({ theme }) => theme.fonts.title};
`;

export const EventLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  align-self: flex-end;

  text-decoration: none;

  font-weight: 600;

  transition: 0.3s;

  &:hover {
    opacity: 0.8;

    transform: translateX(4px);
  }
`;

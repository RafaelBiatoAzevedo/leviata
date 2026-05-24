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

export const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;

  gap: 14px;
`;

export const TabButton = styled.button<{
  $active: boolean;
}>`
  padding: 14px 22px;

  border-radius: 12px;

  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.accent : "rgba(255,255,255,0.06)"};

  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentGlow : theme.colors.secondary};

  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.onSecondary};

  cursor: pointer;

  font-size: 1rem;
  font-weight: 500;

  transition: 0.3s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};

    transform: translateY(-2px);
  }
`;

export const Timeline = styled.div`
  display: flex;
  flex-direction: column;

  gap: 40px;

  position: relative;

  padding-left: 30px;

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
  display: flex;

  gap: 24px;

  position: relative;
`;

export const TimelineDot = styled.div`
  width: 20px;
  height: 20px;

  border-radius: 50%;

  background: ${({ theme }) => theme.colors.accent};

  box-shadow: 0 0 15px ${({ theme }) => theme.colors.accentGlow};

  position: absolute;

  left: -30px;
  top: 8px;
`;

export const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;

  gap: 10px;

  padding: 24px;

  border-radius: 18px;

  background: ${({ theme }) => theme.colors.secondary};

  border: 1px solid rgba(255, 255, 255, 0.06);

  width: 800px;
`;

export const TimelineYear = styled.span`
  color: ${({ theme }) => theme.colors.accent};

  font-size: 0.9rem;

  letter-spacing: 1px;

  text-transform: uppercase;
`;

export const TimelineTitle = styled.h3`
  color: ${({ theme }) => theme.colors.onSecondary};

  font-size: 1.4rem;

  font-family: ${({ theme }) => theme.fonts.title};
`;

export const TimelineDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};

  line-height: 1.7;
`;

export const Carousel = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  width: 100%;
  overflow: hidden;

  .swiper {
    width: 100%;
    height: 100%;
    padding: 2rem 2rem 4rem 2rem;
  }

  .swiper-button-next,
  .swiper-button-prev {
    color: ${({ theme }) => theme.colors.accent};

    width: 48px;
    height: 48px;

    border-radius: 50%;

    background: rgba(0, 0, 0, 0.2);

    backdrop-filter: blur(8px);

    transition: 0.3s;

    padding: 8px;
  }

  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    transform: scale(1.05);

    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }

  .swiper-pagination-bullet {
    background: ${({ theme }) => theme.colors.textSoft};
    opacity: 0.5;
  }

  .swiper-pagination-bullet-active {
    background: ${({ theme }) => theme.colors.accent};
    opacity: 1;
  }

  /* img {
    width: 700px;
    height: 400px;
    object-fit: contain;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    img {
      width: 100%;
      height: 300px;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    img {
      width: 100%;
      height: 250px;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.smallMobile}) {
    img {
      width: 100%;
      height: 200px;
    }
  } */
`;

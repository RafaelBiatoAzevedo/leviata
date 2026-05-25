import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  padding-top: 70px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rem;
  padding: 4rem 16rem;

  h1 {
    text-align: center;
  }
`;

export const ImageHero = styled.img`
  width: 100%;
  height: auto;
`;

export const LinesLInksWrapper = styled.div`
  align-items: stretch;
  justify-content: center;
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 4rem;
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

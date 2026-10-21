import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;

  .swiper {
    width: 100%;
    min-width: 0;
    padding: 24px 20px 64px;
  }

  .swiper-slide {
    max-width: 100%;
    min-width: 0;
  }

  .swiper-button-next,
  .swiper-button-prev {
    width: 44px;
    height: 44px;
    padding: 12px;
    border-radius: 50%;
    background: rgba(17, 24, 39, 0.85);
    color: ${({ theme }) => theme.colors.accent};
    backdrop-filter: blur(8px);
    transition: box-shadow 0.3s ease;
  }

  .swiper-button-next:hover,
  .swiper-button-prev:hover {
    box-shadow: 0 0 20px ${({ theme }) => theme.colors.accentGlow};
  }

  .swiper-pagination {
    bottom: 4px;
  }

  .swiper-pagination-bullet {
    position: relative;
    margin: 8px !important;
    background: ${({ theme }) => theme.colors.textSoft};
    opacity: 0.5;

    &::before {
      content: "";
      position: absolute;
      inset: -8px;
    }
  }

  .swiper-pagination-bullet-active {
    background: ${({ theme }) => theme.colors.accent};
    opacity: 1;
  }

  @media (max-width: 640px) {
    .swiper {
      padding: 12px 0 72px;
    }

    .swiper-button-next,
    .swiper-button-prev {
      top: auto;
      bottom: 0;
      margin-top: 0;
    }

    .swiper-button-prev {
      left: 0;
    }

    .swiper-button-next {
      right: 0;
    }

    .swiper-pagination {
      bottom: 10px;
    }

    .swiper-pagination-bullets-dynamic {
      right: auto;
      left: 50%;
      max-width: calc(100% - 112px);
      transform: translateX(-50%);
    }
  }
`;

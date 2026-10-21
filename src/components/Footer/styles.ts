import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
  margin-top: clamp(28px, 4vw, 56px);
`;

export const BackTopButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  svg {
    font-size: 18px;
  }
`;

export const ContentWrapper = styled.footer`
  padding: 64px clamp(16px, 4vw, 64px) 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Content = styled.div`
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr) minmax(280px, 400px);
  align-items: center;
  gap: 32px;
  width: 100%;
  max-width: 1312px;
  margin-inline: auto;

  @media (max-width: 1100px) {
    grid-template-columns: 100px minmax(0, 1fr);

    > :last-child {
      grid-column: 1 / -1;
      justify-self: center;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    gap: 24px;
    text-align: center;
  }
`;

export const TitleWrapper = styled.div`
  min-width: 0;

  h2 {
    font-size: 1.6rem;
    line-height: 1.4;
    letter-spacing: 0.4px;
  }
`;

export const Logo = styled.img`
  width: 120px;
  height: auto;
  object-fit: contain;

  @media (max-width: 1100px) {
    width: 100px;
  }
`;

export const Copy = styled.p`
  text-align: center;
  margin-top: 32px;
  font-size: 12px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
`;

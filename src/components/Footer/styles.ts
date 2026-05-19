import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  width: 100%;
`;

export const BackTopButton = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;

  width: 42px;
  height: 42px;

  border-radius: 50%;
  border: none;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.primary}90;
  color: ${({ theme }) => theme.colors.textSoft};

  cursor: pointer;
  transition: 0.3s ease;

  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-3px);
  }

  svg {
    font-size: 1.1rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const ContentWrapper = styled.footer`
  padding: 3rem 2rem 1rem 2rem;

  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: 2rem;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-star;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
`;

export const Logo = styled.img`
  width: 160px;
  height: 160px;
  object-fit: contain;
`;

export const Copy = styled.p`
  text-align: center;
  margin-top: 3rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text};
`;

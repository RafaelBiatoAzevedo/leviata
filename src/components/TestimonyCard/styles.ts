import styled from "styled-components";

export const Container = styled.article`
  display: flex;
  flex-direction: column;

  gap: 1rem;

  padding: 1.5rem;

  border-radius: 16px;

  background: ${({ theme }) => theme.colors.surface};

  border: 1px solid ${({ theme }) => theme.colors.border};

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);

  transition: 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
  align-items: center;
`;

export const Avatar = styled.img`
  width: 72px;
  height: 72px;

  border-radius: 50%;

  object-fit: cover;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Name = styled.h3`
  font-size: 1.2rem;

  margin-bottom: 0.25rem;

  font-family: ${({ theme }) => theme.fonts.title};

  color: ${({ theme }) => theme.colors.text};
`;

export const Subtitle = styled.span`
  font-size: 0.8rem;

  margin-bottom: 1rem;

  color: ${({ theme }) => theme.colors.textSoft};
`;

export const Text = styled.p`
  font-size: 0.95rem;

  line-height: 1.8;

  color: ${({ theme }) => theme.colors.text};

  font-style: italic;
`;

export const AvatarPlaceholder = styled.div`
  width: 72px;
  height: 72px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.border};

  svg {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.text};
  }
`;

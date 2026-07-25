import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const Filters = styled.div`
  display: flex;

  justify-content: space-between;

  gap: 1rem;

  flex-wrap: wrap;
`;

export const CategorySelect = styled.select`
  width: 240px;

  height: 46px;

  padding: 0 1rem;

  border-radius: 12px;

  border: 1px solid ${({ theme }) => theme.colors.border};

  background: ${({ theme }) => theme.colors.surface};

  color: ${({ theme }) => theme.colors.text};

  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const Avatar = styled.img`
  width: 42px;

  height: 42px;

  border-radius: 50%;

  object-fit: cover;
`;

export const AvatarPlaceholder = styled.div`
  width: 42px;

  height: 42px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  background: ${({ theme }) => theme.colors.background};

  color: ${({ theme }) => theme.colors.text};

  svg {
    font-size: 1.2rem;
  }
`;

export const Actions = styled.div`
  display: flex;

  gap: 0.5rem;
`;

export const Empty = styled.div`
  text-align: center;

  padding: 3rem;

  color: ${({ theme }) => theme.colors.text};

  border: 1px dashed ${({ theme }) => theme.colors.border};

  border-radius: 12px;
`;

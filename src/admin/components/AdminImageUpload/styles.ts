import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  align-items: flex-start;

  gap: 1rem;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const Preview = styled.div`
  width: 180px;

  height: 180px;

  border-radius: 16px;

  overflow: hidden;

  border: 2px dashed ${({ theme }) => theme.colors.border};

  background: ${({ theme }) => theme.colors.surface};

  cursor: pointer;

  transition: 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PreviewImage = styled.img`
  width: 100%;

  height: 100%;

  object-fit: cover;
`;

export const Placeholder = styled.div`
  width: 100%;

  height: 100%;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

  gap: 0.75rem;

  color: ${({ theme }) => theme.colors.text};

  svg {
    opacity: 0.7;
  }

  span {
    font-size: 0.9rem;
  }
`;

export const ChangeButton = styled.button`
  display: flex;

  align-items: center;

  gap: 0.5rem;

  padding: 0.7rem 1rem;

  border: none;

  border-radius: 10px;

  background: ${({ theme }) => theme.colors.primary};

  color: #fff;

  cursor: pointer;

  font-size: 0.9rem;

  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

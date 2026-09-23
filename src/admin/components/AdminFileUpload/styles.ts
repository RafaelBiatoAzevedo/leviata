import styled from "styled-components";

interface PreviewProps {
  $hasFile: boolean;
}

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 1rem;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const Preview = styled.div<PreviewProps>`
  width: 100%;

  width: 300px;

  height: 220px;

  overflow: hidden;

  border-radius: 12px;

  cursor: pointer;

  border: 2px dashed ${({ theme }) => theme.colors.border};

  background: ${({ theme }) => theme.colors.surface};

  transition: 0.2s ease;

  display: flex;

  justify-content: center;

  align-items: center;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Placeholder = styled.div`
  width: 100%;

  min-height: 220px;

  padding: 2rem;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

  gap: 0.75rem;

  color: ${({ theme }) => theme.colors.text};

  text-align: center;

  svg {
    opacity: 0.7;
  }

  span {
    font-size: 0.9rem;
  }
`;

export const FileName = styled.span`
  max-width: 90%;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 0.95rem;

  font-weight: 500;
`;

export const FileType = styled.span`
  padding: 0.25rem 0.5rem;

  border-radius: 4px;

  font-size: 0.75rem;

  font-weight: 600;

  background: ${({ theme }) => theme.colors.primary};

  color: ${({ theme }) => theme.colors.text};
`;

export const ChangeButton = styled.button`
  display: flex;

  align-items: center;

  gap: 0.5rem;

  padding: 0.7rem 1rem;

  border: none;

  border-radius: 8px;

  background: ${({ theme }) => theme.colors.primary};

  color: ${({ theme }) => theme.colors.text};

  cursor: pointer;

  font-size: 0.9rem;

  transition: 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

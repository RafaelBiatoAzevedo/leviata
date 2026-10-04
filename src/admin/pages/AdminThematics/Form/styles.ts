import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const Form = styled.form`
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const VideoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const VideoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
`;

export const VideoItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Empty = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSoft};
`;

export const BookTopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;

  > :first-child {
    flex: 1;
  }
`;

export const MemberList = styled.div`
  display: flex;

  flex-direction: column;

  gap: 8px;

  margin-top: 16px;
`;

export const MemberItem = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  min-height: 48px;

  padding: 8px 12px;

  border: 1px solid ${({ theme }) => theme.colors.border};

  border-radius: 8px;

  background: ${({ theme }) => theme.colors.surface};

  color: ${({ theme }) => theme.colors.text};

  transition: 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  span {
    overflow: hidden;

    text-overflow: ellipsis;

    white-space: nowrap;
  }

  button {
    display: flex;

    align-items: center;

    justify-content: center;

    flex-shrink: 0;

    width: 32px;

    height: 32px;

    padding: 0;

    border: 0;

    border-radius: 6px;

    background: transparent;

    color: ${({ theme }) => theme.colors.textSoft};

    cursor: pointer;

    transition: 0.2s ease;

    &:hover {
      background: #ef444415;

      color: #ef4444;
    }
  }
`;

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

export const MeetingTopWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;

  > :first-child {
    flex: 1;
  }
`;

export const SpeakerList = styled.div`
  display: flex;

  flex-direction: column;

  gap: 8px;

  margin-top: 16px;
`;

export const AuthorItem = styled.div`
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

export const Actions = styled.div`
  display: flex;

  justify-content: flex-end;

  gap: 1rem;

  padding-top: 1rem;

  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

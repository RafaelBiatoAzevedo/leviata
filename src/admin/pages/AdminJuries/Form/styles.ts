import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const Form = styled.form`
  min-width: 0;
  width: 100%;
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export { AdminSplitLayout as JuryTopWrapper } from "../../../components/AdminResponsive";

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

    width: 44px;

    height: 44px;

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

import styled from "styled-components";

export const Container = styled.fieldset`
  width: 100%;
  box-sizing: border-box;
  min-width: 0;
  margin: 0;
  padding: clamp(14px, 2vw, 22px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  legend {
    padding: 0 8px;
    color: ${({ theme }) => theme.colors.heading};
    font-weight: 600;
  }
  input[type="radio"],
  input[type="checkbox"] {
    accent-color: ${({ theme }) => theme.colors.primary};
    width: 19px;
    height: 19px;
    flex-shrink: 0;
    cursor: pointer;
    &:focus-visible {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 4px;
    }
    &:disabled {
      cursor: default;
    }
  }
`;

export const Choices = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const Choice = styled.label<{ $active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentSoft : theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  input {
    margin: 2px 0 0;
  }
  span {
    min-width: 0;
  }
  strong,
  small {
    display: block;
    overflow-wrap: anywhere;
  }
  small {
    margin-top: 6px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.textSoft};
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  > [data-selection-actions] {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  @media (max-width: 540px) {
    > div {
      width: 100%;
    }
    button {
      flex: 1 1 auto;
    }
  }
`;

export const Subscriber = styled.label`
  display: inline-flex;
  min-width: 44px;
  min-height: 44px;
  align-items: center;
`;

export const Selection = styled.p`
  font-size: 13px;
`;

export const Status = styled.div`
  border-radius: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  p {
    margin-bottom: 12px;
  }
`;

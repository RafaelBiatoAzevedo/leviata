import styled from "styled-components";

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  @media (max-width: 540px) {
    > button {
      flex: 1 1 140px;
      min-height: 44px;
    }
  }
`;

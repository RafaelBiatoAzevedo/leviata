import styled from "styled-components";

export const AdminSplitLayout = styled.div`
  display: grid;
  grid-template-columns: fit-content(45%) minmax(0, 1fr);
  align-items: start;
  gap: 28px;
  min-width: 0;

  > * {
    min-width: 0;
    max-width: 100%;
  }
  @container admin-content (max-width: 800px) {
    grid-template-columns: minmax(0, 1fr);
    > * {
      width: 100%;
    }
  }

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    > * {
      width: 100%;
    }
  }
`;

export const AdminDetailLayout = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 28px;
  min-width: 0;

  > * {
    min-width: 0;
    max-width: 100%;
  }

  @container admin-content (max-width: 850px) {
    flex-direction: column;
    > * {
      width: 100%;
    }
  }

  @media (max-width: 900px) {
    flex-direction: column;
    > * {
      width: 100%;
    }
  }
`;

export const AdminHeaderActions = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 540px) {
    > button {
      flex: 1 1 140px;
      min-height: 44px;
    }
  }
`;

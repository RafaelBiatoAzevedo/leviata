import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  align-items: center;

  gap: 6px;

  margin-top: 6px;

  color: ${({ theme }) => theme.colors.feedback.danger.main};

  font-size: 0.8rem;

  line-height: 1.4;

  span {
    display: block;
  }

  svg {
    flex-shrink: 0;
  }
`;

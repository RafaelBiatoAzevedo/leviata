import styled from "styled-components";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
  gap: 1.5rem;
`;

export const Item = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

export const Preview = styled.img`
  display: block;
  width: 100%;
  height: 220px;
  object-fit: contain;
  background: ${({ theme }) => theme.colors.surface};
`;

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

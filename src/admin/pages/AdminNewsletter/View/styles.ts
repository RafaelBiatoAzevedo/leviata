import styled from "styled-components";
export const Container = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export { AdminHeaderActions as HeaderActions } from "../../../components/AdminResponsive";
export const Title = styled.h1`
  margin: 0;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
`;
export const HtmlPreview = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: auto;
  color: ${({ theme }) => theme.colors.text};
`;

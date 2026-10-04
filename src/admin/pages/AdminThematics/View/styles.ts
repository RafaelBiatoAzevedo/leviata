import styled from "styled-components";

export const Container = styled.div`
  display: flex;

  flex-direction: column;

  gap: 2rem;
`;

export const Header = styled.div`
  display: flex;

  flex-direction: column;

  gap: 1rem;
`;

export const HeaderActions = styled.div`
  display: flex;

  justify-content: space-between;
`;

export const Title = styled.h1`
  margin: 0;

  font-size: 2rem;

  font-weight: 700;

  color: ${({ theme }) => theme.colors.text};
`;

export const VideoList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
  gap: 24px;
`;

export const VideoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
`;

export const VideoPreview = styled.div`
  width: 100%;
  max-width: 800px;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

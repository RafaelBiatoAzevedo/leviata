import styled from "styled-components";

export const Profile = styled.article`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  padding: clamp(20px, 3vw, 28px);
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px 16px 16px 16px;
  background: ${({ theme }) => theme.colors.surface};

  > p {
    color: #626973;
    font-size: 13px;
    line-height: 1.85;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  > div:last-child {
    min-width: 0;
  }
  h3 {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 25px;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }
  p {
    margin-top: 6px;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 12px;
    line-height: 1.7;
    overflow-wrap: anywhere;
  }
  small {
    display: block;
    margin-top: 7px;
    color: #626973;
    font-size: 11px;
  }

  @media (max-width: 420px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const Avatar = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.primary}60;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 28px;
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ResourceLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    max-width: 100%;
    padding: 10px 14px;
    border: 1px solid ${({ theme }) => theme.colors.primary}60;
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.secondary};
    font-size: 12px;
    line-height: 1.6;
    text-decoration: none;
    overflow-wrap: anywhere;
  }
  svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
  }
  a:hover,
  a:focus-visible {
    background: ${({ theme }) => theme.colors.accentSoft};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  a:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
`;

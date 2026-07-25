import styled from "styled-components";

export const SwitchContainer = styled.div`
  display: flex;

  align-items: center;

  gap: 0.75rem;
`;

export const Switch = styled.label`
  position: relative;

  display: inline-flex;

  width: 50px;

  height: 28px;

  cursor: pointer;
`;

export const HiddenInput = styled.input`
  opacity: 0;

  width: 0;

  height: 0;

  &:checked + span {
    background: ${({ theme }) => theme.colors.primary};
  }

  &:checked + span::before {
    transform: translateX(22px);
  }

  &:focus + span {
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}25`};
  }

  &:disabled + span {
    opacity: 0.5;

    cursor: not-allowed;
  }
`;

export const Slider = styled.span`
  position: absolute;

  inset: 0;

  border-radius: 999px;

  background: ${({ theme }) => theme.colors.border};

  transition: 0.2s;

  &::before {
    content: "";

    position: absolute;

    width: 22px;

    height: 22px;

    left: 3px;

    top: 3px;

    border-radius: 50%;

    background: #fff;

    transition: 0.2s;
  }
`;

export const SwitchLabel = styled.span`
  font-size: 0.9rem;

  color: ${({ theme }) => theme.colors.text};
`;

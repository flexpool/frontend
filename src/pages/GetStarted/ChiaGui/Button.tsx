import styled, { css, keyframes } from 'styled-components';

const ChiaGuiButtonGlowAnimation = keyframes`
  0% {
    background-color: var(--bg-secondary);
  }

  50% {
    background-color: var(--success);
    color: #fff;
  }

  100% {
    background-color: var(--bg-secondary);
  }
`;

type ChiaGuiButtonProps = {
  glowing?: boolean;
};

export const ChiaGuiButton = styled.button<ChiaGuiButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: var(--bg-secondary);
  padding: 10px;
  border: 2px solid var(--success);
  color: #fff;
  background: var(--success);
  cursor: default;
  font-weight: 600;

  svg {
    margin-right: 10px;
  }

  ${(props) =>
    props.glowing &&
    css`
      animation: ${ChiaGuiButtonGlowAnimation} 1s linear infinite;
    `}
`;

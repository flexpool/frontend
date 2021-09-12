import styled, { UIVariant } from 'styled-components';

const btnHeights = {
  xs: 32,
  sm: 42,
  default: 50,
  lg: 60,
};

export const getBtnPxHeight = (height: keyof typeof btnHeights = 'default') => {
  return btnHeights[height];
};

export type ButtonProps = {
  size?: keyof typeof btnHeights | undefined;
  variant?: UIVariant;
  shape?: 'square' | 'circle' | 'block';
  fill?: 'outline';
  shadowless?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = styled.button<ButtonProps>`
  transition: 0.1s all;
  display: flex;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 5px;
  align-items: center;
  border: 1px solid var(--border-color);
  outline: none;
  font-size: 1rem;
  background-color: var(--bg-primary);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover,
  &:active,
  &:focus {
    ${(p) => `
    !p.shadowless &&
      box-shadow: 0 2px 10px 0 var(--${p.variant}-shadow);
  `};
    text-decoration: none;
  }
  color: var(--text-secondary);
  font-weight: 400;

  &:disabled {
    pointer-events: none;
    opacity: 0.3;
  }
  & > * {
    pointer-events: none;
  }

  ${(p) => `
    height: ${getBtnPxHeight(p.size)}px;
  `};

  ${(p) =>
    p.shape === 'square' &&
    `
      padding: 0;
  justify-content: center;
      width: ${getBtnPxHeight(p.size)}px;
  `};
  ${(p) =>
    p.shape === 'circle' &&
    `
      padding: 0;
  justify-content: center;
      border-radius: 50%;
      width: ${getBtnPxHeight(p.size)}px;
  `};

  font-weight: 700;
  border-color: var(--bg-secondary);
  display: inline-flex;

  ${(p) =>
    p.fill === 'outline' &&
    `
      background: transparent;
    `}

  /** variant */
  ${(p) => {
    if (p.variant && p.fill !== 'outline') {
      return `
      background-color: var(--${p.variant});
      color: ${p.theme.color.onBg};
      border-color: rgba(0,0,0,0.05);
        box-shadow: 0 2px 10px 0 var(--${p.variant}-shadow);
      &:hover, &:active, &:focus {
        border-color: rgba(0,0,0,0.05);
      background-color: var(--${p.variant});
        box-shadow: 0 5px 15px 0 var(--${p.variant}-shadow);
      }
      `;
    } else if (p.variant && p.fill === 'outline') {
      // __todo
      return `
      background-color: var(--${p.variant});
      color: ${p.theme.color.onBg};
      border-color: rgba(0,0,0,0.05);
        ${
          !p.shadowless &&
          `box-shadow: 0 2px 10px 0 var(--${p.variant}-shadow);`
        }
      &:hover, &:active, &:focus {
        border-color: rgba(0,0,0,0.05);
        background-color: var(--${p.variant});
        box-shadow: 0 5px 15px 0 var(--${p.variant}-shadow);
      }
      `;
    }
  }}

  &:active {
    box-shadow: inset 0 0 40px 0 rgba(0, 0, 0, 0.1);
  }

  ${(p) =>
    p.shape === 'block' &&
    `
    width: 100%;
    justify-content: center;
  `}

  &:after {
    content: '';
    background: linear-gradient(
      -1450deg,
      rgba(2, 0, 36, 0.1) 0%,
      rgba(255, 255, 255, 0.2) 100%
    );
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    transform: translateY(-50%) translateX(-100%);
    transition: 0.2s all;
    opacity: 0;
    z-index: 1;
  }
  &:hover {
    &:after {
      transform: translateX(0%);
      opacity: 1;
    }
  }
`;

Button.defaultProps = {
  size: 'default',
};

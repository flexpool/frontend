import styled, { UIVariant } from 'styled-components/macro';

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
};

export const Button = styled.button<ButtonProps>`
  transition: 0.2s all;
  display: flex;
  align-items: center;
  min-height: 50px;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  outline: none;
  font-size: 1rem;
  background-color: var(--bg-primary);
  cursor: pointer;
  &:hover,
  &:active,
  &:focus {
    background: var(--bg-secondary);
    text-decoration: none;
  }
  color: var(--text-primary);
  font-weight: 400;

  &:disabled {
    pointer-events: none;
    opacity: 0.3;
  }
  & > * {
    pointer-events: none;
  }
  ${(p) => `
    line-height: ${getBtnPxHeight(p.size)}px;
    height: ${getBtnPxHeight(p.size)}px;
    min-height: ${getBtnPxHeight(p.size)}px;
  `};

  font-weight: 700;
  border-color: var(--bg-secondary);
  display: inline-flex;

  /** variant */
  ${(p) => {
    if (p.variant) {
      return `
      background-color: ${p.theme.color[p.variant]};
      color: ${p.theme.color.onBg};
      border-color: rgba(0,0,0,0.05);
      &:hover, &:active, &:focus {
        background-color: ${p.theme.color[p.variant]};
        border-color: rgba(0,0,0,0.05);
        box-shadow: inset 10px 50px 10px -20px rgba(0,0,0,0.05);
      }
      `;
    }
  }}

  &:active {
    box-shadow: inset 0 0 40px 0 rgba(0, 0, 0, 0.1);
  }
`;

Button.defaultProps = {
  type: 'button',
};

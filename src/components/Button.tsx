import styled, { UIVariant } from 'styled-components/macro';

const btnHeights = {
  xs: 26,
  sm: 36,
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
  ${(p) => `
    line-height: ${getBtnPxHeight(p.size)}px;
    height: ${getBtnPxHeight(p.size)}px;
  `};

  font-weight: 700;
  background: var(--bg-secondary);
  border-color: var(--bg-secondary);

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

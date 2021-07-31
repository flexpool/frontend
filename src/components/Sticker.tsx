import styled, { UIVariant } from 'styled-components';

export const Sticker = styled.span<{
  variant?: UIVariant;
}>`
  padding: 0.2rem 0.35rem;
  border-radius: 4px;
  display: inline-block;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  background-color: var(--bg-secondary);
  ${(p) => {
    if (p.variant) {
      return `
      background-color: var(--${p.variant});
      color: var(--text-on-bg);
      `;
    }
  }};
`;

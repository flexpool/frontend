import styled, { UIVariant } from 'styled-components';

export const Badge = styled.span<{
  variant?: UIVariant;
}>`
  background: var(--primary);
  color: var(--text-on-bg);
  padding: 0.2rem 0.3rem;
  text-transform: uppercase;
  border-radius: 5px;
  font-size: 0.875rem;
  margin-left: 6px;

  ${(p) => {
    if (p.variant) {
      return `
      background-color: var(--${p.variant});
      color: var(--text-on-bg);
      `;
    }
  }};
`;

export default Badge;

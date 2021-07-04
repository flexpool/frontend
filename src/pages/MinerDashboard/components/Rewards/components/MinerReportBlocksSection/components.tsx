import styled from 'styled-components';
import { ApiBlock } from './types';

export const BlockType = styled.span<{ type: ApiBlock['blockType'] }>`
  display: inline-block;
  text-transform: capitalize;
  white-space: nowrap;
  & + * {
    margin-left: 0.5rem;
  }

  ${(p) =>
    p.type === 'uncle' &&
    `
      color: var(--warning);
  `}
  ${(p) =>
    p.type === 'orphan' &&
    `
      color: var(--text-tertiary);
  `}

  + * svg {
    fill: var(--text-tertiary);
  }
`;
import styled from 'styled-components';
import { LinkOut } from 'src/components/LinkOut';
import { ApiBlock } from './types';
import { Ws } from 'src/components/Typo/Typo';

export const Region = styled.span`
  text-transform: uppercase;
`;

export const BlockLink = styled(LinkOut)`
  color: var(--text-primary);
`;

export const BlockType = styled.span<{ type: ApiBlock['type'] }>`
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

export const ButtonDateSwitch = styled(Ws)`
  padding: 0 0.35rem;
  outline: none;
  border: none;
  color: var(--text-secondary);
  svg {
    opacity: 0.5;
    margin-left: 0.3rem;
  }
  &:hover svg {
    color: var(--primary);
    opacity: 1;
  }
`;
import styled from 'styled-components';
import { ApiMinerPayment } from 'src/types/Miner.types';
import { Ws } from 'src/components/Typo/Typo';

export const HeaderSplit = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StatusContainer = styled.span<{
  confirmed: ApiMinerPayment['confirmed'];
}>`
  display: inline-block;
  text-transform: capitalize;
  white-space: nowrap;
  & + * {
    margin-left: 0.5rem;
  }
  ${(p) =>
    p.confirmed === true &&
    `
      color: var(--success);
  `}
  ${(p) =>
    !p.confirmed &&
    `
      color: var(--text-secondary);
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
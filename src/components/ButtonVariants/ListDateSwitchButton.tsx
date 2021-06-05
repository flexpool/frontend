import { Ws } from 'src/components/Typo/Typo';
import styled from 'styled-components';

const ListDateSwitchButton = styled(Ws)`
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

export default ListDateSwitchButton;

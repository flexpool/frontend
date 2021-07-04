import styled from 'styled-components/macro';
import { Button } from 'src/components/Button';
import { Card } from 'src/components/layout/Card';
import { LinkOut } from 'src/components/LinkOut';

export const Wrap = styled(Card)`
  display: flex;
  justify-content: space-between;
`;

export const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 1;
  width: 1px;
  flex-grow: 1;
  margin-right: 1rem;
  img {
    width: 40px;
  }
  button {
    flex-shrink: 0;
  }
`;

export const Address = styled(LinkOut)`
  margin-left: 1rem;
  margin-right: 1rem;
  font-weight: 500;
  font-size: 1.5rem;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 1;
  color: var(--text-primary);
  &:hover {
    color: var(--primary);
    text-decoration: none;
  }
`;

export const RefreshButton = styled(Button)`
  font-size: 1.5rem;
  margin-right: 10px;
  height: 42px;
  width: 42px;
`;

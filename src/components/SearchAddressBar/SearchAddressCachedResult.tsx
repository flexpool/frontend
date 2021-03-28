import { Link } from 'react-router-dom';
import { localStorage } from 'src/utils/localStorage';
import styled from 'styled-components';
import { searchAddressStorage } from './searchCache';

const HistoryItem = styled(Link)`
  border-top: 1px solid var(--border-color);
  height: 55px;
  color: var(--text-primary);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  font-family: 'Roboto Mono', monospace;
  font-weight: 500;
  &:hover {
    color: var(--primary);
    text-decoration: none;
  }
`;

const CoinLabel = styled.span`
  background: var(--primary);
  color: var(--text-on-bg);
  padding: 0.2rem 0.3rem;
  text-transform: uppercase;
  border-radius: 5px;
  font-size: 0.875rem;
  margin-left: 1rem;
`;

const Address = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SearchAddressCachedResult: React.FC<{ isOpen?: boolean }> = ({
  isOpen = true,
}) => {
  const data = searchAddressStorage.get() || [];
  if (!isOpen) {
    return null;
  }
  return (
    <>
      {data.map((item) => (
        <HistoryItem
          to={`/miners/${item.coin}/${item.address}`}
          key={item.address}
        >
          <Address>{item.address}</Address>
          <CoinLabel>{item.coin}</CoinLabel>
        </HistoryItem>
      ))}
    </>
  );
};

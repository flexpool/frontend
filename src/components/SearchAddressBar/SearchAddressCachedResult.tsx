import { FaTimes } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Badge } from '@/components/Badge';
import useSearchAddress from '@/hooks/useSearchAddress';
import { addressSearchRemove } from 'src/rdx/addressSearch/addressSearch.actions';
import { AddressCacheItem } from './searchCache';
import { useReduxState } from 'src/rdx/useReduxState';

const ItemWrap = styled.div`
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  height: 55px;
`;
const HistoryItem = styled.a`
  color: var(--text-primary);
  background: transparent;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 0 1rem;
  overflow: hidden;
  cursor: pointer;
  font-family: 'Roboto Mono', monospace;
  font-weight: 500;
  flex-grow: 1;
  &:hover {
    color: var(--primary);
    text-decoration: none;
  }
`;

const Address = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemRight = styled.div`
  display: flex;
  align-items: center;
`;
const RemoveWrap = styled.button`
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  margin: 5px;
  margin-right: 8px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: 0.3;
  background: transparent;
  outline: none !important;
  border: none !important;
  color: var(--text-primary);
  &:hover {
    opacity: 1;
    background: rgba(128, 128, 128, 0.07);
  }
  &:focus {
    background: rgba(128, 128, 128, 0.14);
  }
`;

export const SearchAddressCachedResult: React.FC<{
  isOpen?: boolean;
  onAddressClick?: (address: string) => void;
  callback?: () => void;
}> = ({ isOpen = true, callback, onAddressClick }) => {
  const data = useReduxState('addressSearch');
  const d = useDispatch();
  const search = useSearchAddress();

  if (!isOpen) {
    return null;
  }

  const renderCoinLabel = (coin: AddressCacheItem['coin']) => {
    if (coin === null || coin === '') return null;
    if (Array.isArray(coin)) {
      return (
        <ItemRight>
          {coin.map((c) => (
            <Badge key={c}>{c}</Badge>
          ))}
        </ItemRight>
      );
    }

    return (
      <ItemRight key={coin}>
        <Badge>{coin}</Badge>
      </ItemRight>
    );
  };

  return (
    <>
      {data
        .filter(
          (i) =>
            Array.isArray(i.coin) ||
            typeof i.coin === 'string' ||
            i.coin === null
        )
        .slice(0, 6)
        .map((item) => (
          <ItemWrap key={item.address}>
            <HistoryItem
              onClick={() => {
                onAddressClick?.(item.address);
                search(item.address, item.coin, callback);
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <Address>{item.address}</Address>
              {renderCoinLabel(item.coin)}
            </HistoryItem>
            <RemoveWrap
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                d(addressSearchRemove(item.address));
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <FaTimes />
            </RemoveWrap>
          </ItemWrap>
        ))}
    </>
  );
};

import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import NProgress from 'nprogress';
import { BiRefresh, BiLoaderAlt } from 'react-icons/bi';
import { CopyButton } from 'src/components/CopyButton';
import { Img } from 'src/components/Img';
import { Card } from 'src/components/layout/Card';
import { LinkOut } from 'src/components/LinkOut';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { getCoinLink } from 'src/utils/coinLinks.utils';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';
import { getChecksumByTicker } from 'src/utils/validators/checksum';
import { MinerSettingsModal } from '../Settings/MinerSettings.modal';
import { Button } from 'src/components/Button';
import useMinerDetailsQuery from '@/hooks/api/useMinerDetailsQuery';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled(BiLoaderAlt)`
  opacity: 0.5;
  animation: ${rotate} 1s linear infinite;
`;

const Wrap = styled(Card)`
  display: flex;
  justify-content: space-between;
`;

const AddressContainer = styled.div`
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
    margin-left: 1rem;
    flex-shrink: 0;
  }
`;

const Address = styled(LinkOut)`
  margin-left: 1rem;
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

const CoinIconSkeleton = styled.div`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background: var(--bg-secondary);
`;

const RefreshButton = styled(Button)`
  font-size: 1.5rem;
  margin-right: 10px;
  height: 42px;
  width: 42px;

  &:disabled {
    opacity: 1;
  }
`;

const Memo = styled.div`
  font-weight: 500;
  font-size: 18px;
  cursor: pointer;

  white-space: nowrap;
  flex-shrink: 1;
  color: var(--text-secondary);
  border-left: 1px solid var(--border-color);
  padding: 10px;
`;

export const AccountHeader: React.FC<{
  coin?: ApiPoolCoin;
  address: string;
  onRefresh: any;
}> = ({ coin, address, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: minerDetails } = useMinerDetailsQuery({
    coin: coin?.ticker,
    address,
  });

  const coinName =
    minerDetails &&
    (minerDetails.network === 'mainnet' ? coin?.ticker : minerDetails.network);

  useEffect(() => {
    if (isRefreshing) {
      NProgress.start();
    } else {
      NProgress.done();
    }
  }, [isRefreshing]);

  var addressText: string | null = '...';

  // memos can be added to iron address in the format of <address>+<memo>
  var ironMemo = '';

  if (coin) {
    addressText = getChecksumByTicker(coin.ticker)(address);

    if (addressText && (coin.ticker as string) === 'iron') {
      const parsedRes = parseIronAddressWithMemo(addressText);
      addressText = parsedRes.address;
      ironMemo = parsedRes.memo;
    }
  }

  return (
    <Wrap paddingShort>
      <AddressContainer>
        {coin ? (
          <Img src={getCoinIconUrl(coin.ticker)} alt={`${coin.name} logo`} />
        ) : (
          <CoinIconSkeleton />
        )}
        <Address href={getCoinLink('wallet', address, coinName)}>
          {addressText}
        </Address>
        {ironMemo && <Memo>{ironMemo}</Memo>}
        <CopyButton text={addressText || ''} />
      </AddressContainer>
      <RefreshButton
        size="sm"
        shape="square"
        disabled={isRefreshing}
        onClick={() => {
          setIsRefreshing(true);
          onRefresh().finally(async () => {
            setIsRefreshing(false);
          });
        }}
      >
        {isRefreshing ? <Spinner /> : <BiRefresh />}
      </RefreshButton>
      {coin && !coin.payoutsOnly && (
        <MinerSettingsModal
          coin={coin}
          address={address}
          isRefreshing={isRefreshing}
        />
      )}
    </Wrap>
  );
};

export default React.memo(AccountHeader);

function parseIronAddressWithMemo(address: string) {
  const inputSplit = decodeURIComponent(address).split('+');

  return {
    address: inputSplit[0],
    memo: inputSplit[1],
  };
}

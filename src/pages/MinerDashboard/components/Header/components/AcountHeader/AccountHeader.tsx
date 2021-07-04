import { CopyButton } from 'src/components/CopyButton';
import { Img } from 'src/components/Img';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { getCoinLink } from 'src/utils/coinLinks.utils';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';
import { getChecksumByTicker } from 'src/utils/validators/checksum';
import { MinerSettingsModal } from '../../../Settings/MinerSettings.modal';
import { BiRefresh } from 'react-icons/bi';
import { Wrap, AddressContainer, Address, RefreshButton } from './components';

export const AccountHeader: React.FC<{
  coin?: ApiPoolCoin;
  address: string;
  onRefresh: any;
}> = ({ coin, address, onRefresh }) => {
  const addressText = getChecksumByTicker(coin?.ticker)(address);
  return (
    <Wrap paddingShort>
      <AddressContainer>
        {coin && (
          <Img src={getCoinIconUrl(coin.ticker)} alt={`${coin.name} logo`} />
        )}
        <Address href={getCoinLink('wallet', address, coin?.ticker)}>
          {addressText}
        </Address>
        <CopyButton text={addressText || ''} />
      </AddressContainer>
      <RefreshButton size="sm" shape="square" onClick={onRefresh}>
        <BiRefresh />
      </RefreshButton>
      <MinerSettingsModal />
    </Wrap>
  );
};

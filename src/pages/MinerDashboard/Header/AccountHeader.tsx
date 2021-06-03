import { CopyButton } from 'src/components/CopyButton';
import { Img } from 'src/components/Img';
import { Card } from 'src/components/layout/Card';
import { LinkOut } from 'src/components/LinkOut';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import { getCoinLink } from 'src/utils/coinLinks.utils';
import { getCoinIconUrl } from 'src/utils/staticImage.utils';
import { getChecksumByTicker } from 'src/utils/validators/checksum';
import styled from 'styled-components/macro';
import { MinerSettingsModal } from '../Settings/MinerSettings.modal';

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
    flex-shrink: 0;
  }
`;

const Address = styled(LinkOut)`
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

export const AccountHeader: React.FC<{
  coin?: ApiPoolCoin;
  address: string;
}> = ({ coin, address }) => {
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
      <MinerSettingsModal />
    </Wrap>
  );
};

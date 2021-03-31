import { Link, useLocation } from 'react-router-dom';
import { Button } from 'src/components/Button';
import { Card } from 'src/components/layout/Card';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import styled from 'styled-components/macro';
import { MinerSettingsModal } from '../Settings/MinerSettings.modal';

const Wrap = styled(Card)`
  display: flex;
  justify-content: space-between;
`;

const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 1;
  width: 1px;
  flex-grow: 1;
  img {
    width: 40px;
  }
`;

const Address = styled.span`
  margin-left: 15px;
  font-weight: 500;
  font-size: 1.5rem;
  cursor: pointer;
  overflow: hidden;
  margin-right: 2rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 1;
  width: 1px;
  flex-grow: 1;

  &:hover {
    color: $accent-color;
  }
`;

export const AccountHeader: React.FC<{
  coin?: ApiPoolCoin;
  address: string;
}> = ({ coin, address }) => {
  const location = useLocation();

  return (
    <Wrap paddingShort>
      <AddressContainer>
        {coin && (
          <img
            src={`https://static.flexpool.io/assets/coinLogos/small/${coin.ticker}.png`}
            alt={`${coin.name} logo`}
          />
        )}
        <Address>{address}</Address>
        {/* <CopyButton address={props.address} asd/> */}
      </AddressContainer>
      <MinerSettingsModal />
    </Wrap>
  );
};

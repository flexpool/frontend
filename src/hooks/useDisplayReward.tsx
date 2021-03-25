import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import { ApiPoolCoin } from 'src/types/PoolCoin.types';
import styled from 'styled-components';

const Tick = styled.span`
  color: var(--primary);
  text-transform: uppercase;
`;

export const useActiveCoinTickerDisplayValue = (
  value?: number,
  coin?: ApiPoolCoin,
  dec: number = 10000
) => {
  const globalCoin = useActiveCoin();
  const activeCoin = coin || globalCoin;

  if (!activeCoin || typeof value !== 'number') {
    return null;
  }

  const val =
    Math.round((value / Math.pow(10, activeCoin?.decimalPlaces || 100)) * dec) /
    dec;
  return (
    <span>
      {val} <Tick className="ticker">{activeCoin?.ticker}</Tick>
    </span>
  );
};

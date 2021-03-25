import { useActiveCoin } from 'src/rdx/localSettings/localSettings.hooks';
import styled from 'styled-components';

const Tick = styled.span`
  color: var(--primary);
  text-transform: uppercase;
`;

export const useActiveCoinTickerDisplayValue = (value?: number) => {
  const activeCoin = useActiveCoin();

  if (!activeCoin || !value) {
    return '---';
  }

  const val =
    Math.round(
      (value / Math.pow(10, activeCoin?.decimalPlaces || 100)) * 10000
    ) / 10000;
  return (
    <span>
      {val} <Tick className="ticker">{activeCoin?.ticker}</Tick>
    </span>
  );
};

import styled from 'styled-components';
import { useActiveCoin } from './useActiveCoin';

const Tick = styled.span`
  color: var(--primary);
  text-transform: uppercase;
`;

export const useActiveCoinDisplayValue = (value: number) => {
  const activeCoin = useActiveCoin();

  const val =
    Math.round((value / Math.pow(10, activeCoin?.decimalPlaces || 100)) * 100) /
    100;
  return (
    <span>
      {val} <Tick>{activeCoin?.ticker}</Tick>
    </span>
  );
};

import { usePoolCoins } from 'src/rdx/poolCoins/poolCoins.hooks';
import { useReduxState } from 'src/rdx/useReduxState';

export const useActiveCoin = () => {
  const localSettings = useReduxState('localSettings');
  const poolCoinsState = usePoolCoins();

  return (poolCoinsState.data || []).find(
    (item) => item.ticker === localSettings.coin
  );
};

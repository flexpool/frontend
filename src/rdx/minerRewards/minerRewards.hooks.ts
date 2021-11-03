import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useReduxState } from '../useReduxState';
import { minerRewardsGet } from './minerRewards.actions';

// Fetch data for dashboards' rewards section
export const useFetchMinerRewards = (
  coinTicker: string,
  address: string,
  counterTicker: string
) => {
  const dispatch = useDispatch();
  const minerRewards = useReduxState('minerRewards');

  const fetch = useCallback(
    () => dispatch(minerRewardsGet(coinTicker, address, counterTicker)),
    [coinTicker, address, counterTicker, dispatch]
  );

  useEffect(() => {
    if (coinTicker && address && counterTicker) {
      fetch();
    }
  }, [dispatch, address, coinTicker, counterTicker, fetch]);

  return { ...minerRewards, refetch: fetch };
};

import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useReduxState } from '../useReduxState';
import { minerHeaderStatsGet } from './minerHeaderStats.actions';

export const useFetchMinerHeaderStats = (
  coinTicker: string,
  address: string,
  counterTicker: string
) => {
  const dispatch = useDispatch();
  const minerHeaderStats = useReduxState('minerHeaderStats');

  const fetch = useCallback(
    () => dispatch(minerHeaderStatsGet(coinTicker, address, counterTicker)),

    [dispatch, coinTicker, address, counterTicker]
  );

  useEffect(() => {
    if (counterTicker && address && coinTicker) {
      fetch();
    }
  }, [coinTicker, address, counterTicker, fetch]);

  return { ...minerHeaderStats, refetch: fetch };
};

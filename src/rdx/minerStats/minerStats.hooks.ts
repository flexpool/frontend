import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useReduxState } from '../useReduxState';
import { minerStatsGet } from './minerStats.actions';

export const useFetchMinerStats = (
  coinTicker: string,
  address: string,
  worker: string | undefined
) => {
  const dispatch = useDispatch();
  const minerStats = useReduxState('minerStats');

  const fetch = useCallback(
    () => dispatch(minerStatsGet(coinTicker, address, worker)),
    [dispatch, coinTicker, address, worker]
  );

  useEffect(() => {
    if (address && coinTicker) {
      fetch();
    }
  }, [coinTicker, address, fetch]);

  return { ...minerStats, refetch: fetch };
};

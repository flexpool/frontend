import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useReduxState } from '../useReduxState';
import { minerWorkersGet } from '../minerPaymentsChart/minerPaymentsChart.actions';

// Fetch data for active/inactive workers
export const useFetchMinerWorkers = (coinTicker: string, address: string) => {
  const dispatch = useDispatch();
  const minerWorkers = useReduxState('minerWorkers');

  const fetch = useCallback(
    () => dispatch(minerWorkersGet(coinTicker, address)),
    [dispatch, coinTicker, address]
  );

  useEffect(() => {
    if (coinTicker && address) {
      fetch();
    }
  }, [fetch, coinTicker, address]);

  return { ...minerWorkers, refetch: fetch };
};

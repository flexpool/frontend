import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useReduxState } from '../useReduxState';
import { minerStatsChartGet } from './minerStatsCharts.actions';

export const useFetchMinerStatsChart = (
  coinTicker: string,
  address: string,
  worker: string | undefined
) => {
  const dispatch = useDispatch();
  const minerStatsChart = useReduxState('minerStatsChart');

  const fetch = useCallback(
    () => dispatch(minerStatsChartGet(coinTicker, address, worker)),
    [dispatch, coinTicker, address, worker]
  );

  useEffect(() => {
    if (coinTicker && address) {
      fetch();
    }
  }, [coinTicker, address, fetch]);

  return { ...minerStatsChart, refetch: fetch };
};

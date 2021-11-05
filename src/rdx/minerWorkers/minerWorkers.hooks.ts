import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useReduxState } from '../useReduxState';
import { minerWorkersGet } from '../minerPaymentsChart/minerPaymentsChart.actions';

type Data = {
  coinTicker: string;
  address: string;
};

type Config = {
  enable?: boolean;
};

// Fetch data for active/inactive workers
export const useFetchMinerWorkers = (data: Data, config: Config = {}) => {
  const { coinTicker, address } = data;
  const { enable = true } = config;

  const dispatch = useDispatch();
  const minerWorkers = useReduxState('minerWorkers');

  const fetch = useCallback(
    () => dispatch(minerWorkersGet(coinTicker, address)),
    [dispatch, coinTicker, address]
  );

  useEffect(() => {
    if (coinTicker && address && enable) {
      fetch();
    }
  }, [fetch, coinTicker, address, enable]);

  return { ...minerWorkers, refetch: fetch };
};

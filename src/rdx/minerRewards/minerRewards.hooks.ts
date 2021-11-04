import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useReduxState } from '../useReduxState';
import { minerRewardsGet } from './minerRewards.actions';

type Data = {
  coinTicker: string;
  address: string;
  counterTicker: string;
};

type Config = {
  enable?: boolean;
};

// Fetch data for dashboards' rewards section
export const useFetchMinerRewards = (data: Data, config: Config = {}) => {
  const { coinTicker, address, counterTicker } = data;
  const { enable = true } = config;
  const dispatch = useDispatch();
  const minerRewards = useReduxState('minerRewards');

  const fetch = useCallback(
    () => dispatch(minerRewardsGet(coinTicker, address, counterTicker)),
    [coinTicker, address, counterTicker, dispatch]
  );

  useEffect(() => {
    if (coinTicker && address && counterTicker && enable) {
      fetch();
    }
  }, [dispatch, address, coinTicker, counterTicker, fetch, enable]);

  return { ...minerRewards, refetch: fetch };
};

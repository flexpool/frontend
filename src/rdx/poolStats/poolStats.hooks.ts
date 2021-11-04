import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useReduxState } from '../useReduxState';
import { poolStatsGet } from './poolStats.actions';

/**
 * Requests the below endpoints:
 * /pool/averageLuck
 * /pool/averageHashrate
 * /pool/hashrate
 * /pool/minerCount
 * /pool/workerCount
 */
export const useFetchPoolStats = (coinTicker: string) => {
  const dispatch = useDispatch();
  const poolStats = useReduxState('poolStats');

  useEffect(() => {
    if (
      coinTicker &&
      !poolStats.data &&
      !poolStats.isLoading &&
      !poolStats.error
    ) {
      dispatch(poolStatsGet(coinTicker));
    }
  }, [
    dispatch,
    coinTicker,
    poolStats.data,
    poolStats.isLoading,
    poolStats.error,
  ]);

  return poolStats;
};

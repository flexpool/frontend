import { useMemo, useEffect, useCallback } from 'react';
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

// Get online/offline workers count from redux state
export const useMinerWorkersStatus = () => {
  const minerWorkersState = useReduxState('minerWorkers');

  const workerStatus = useMemo(() => {
    if (!minerWorkersState.isLoading) {
      // Users who have not been mining for a while would have
      // no data for minerWorkers
      if (!minerWorkersState.data) {
        return {
          online: 0,
          offline: 0,
        };
      }
      return minerWorkersState.data.reduce(
        (acc, curr) => {
          if (curr.isOnline) {
            return { ...acc, online: acc.online + 1 };
          } else {
            return { ...acc, offline: acc.offline + 1 };
          }
        },
        { online: 0, offline: 0 }
      );
    }
    return undefined;
  }, [minerWorkersState]);

  return workerStatus;
};

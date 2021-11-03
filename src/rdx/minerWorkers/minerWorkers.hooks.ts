import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useReduxState } from '../useReduxState';
import { minerWorkersGet } from '../minerPaymentsChart/minerPaymentsChart.actions';

export const useFetchMinerWorkers = (coinTicker: string, address: string) => {
  const dispatch = useDispatch();
  const minerWorkers = useReduxState('minerWorkers');

  useEffect(() => {
    if (
      coinTicker &&
      address &&
      !minerWorkers.lastGetStartAt &&
      !minerWorkers.isLoading &&
      !minerWorkers.error
    ) {
      dispatch(minerWorkersGet(coinTicker, address));
    }
  }, [dispatch, coinTicker, address, minerWorkers]);

  return minerWorkers;
};

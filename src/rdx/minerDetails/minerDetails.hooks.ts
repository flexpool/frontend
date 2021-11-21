import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useReduxState } from '../useReduxState';
import { minerDetailsGet } from './minerDetails.actions';

export const useFetchMinerDetails = (coinTicker: string, address: string) => {
  const dispatch = useDispatch();
  const minerDetails = useReduxState('minerDetails');

  const fetch = useCallback(
    () => dispatch(minerDetailsGet(coinTicker, address)),
    [dispatch, coinTicker, address]
  );

  useEffect(() => {
    if (coinTicker && address) {
      fetch();
    }
  }, [fetch, coinTicker, address]);

  return { ...minerDetails, refetch: fetch };
};

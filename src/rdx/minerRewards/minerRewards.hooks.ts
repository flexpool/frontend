import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useReduxState } from '../useReduxState';
import { minerRewardsGet } from './minerRewards.actions';

export const useFetchMinerRewards = (
  coinTicker: string,
  address: string,
  counterTicker: string
) => {
  const dispatch = useDispatch();
  const minerRewards = useReduxState('minerRewards');

  useEffect(() => {
    if (
      coinTicker &&
      address &&
      counterTicker &&
      !minerRewards.data &&
      !minerRewards.isLoading &&
      !minerRewards.error
    ) {
      dispatch(minerRewardsGet(coinTicker, address, counterTicker));
    }
  }, [dispatch, minerRewards, coinTicker, address, counterTicker]);

  return minerRewards;
};

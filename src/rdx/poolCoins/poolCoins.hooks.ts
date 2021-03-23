import React from 'react';
import { useDispatch } from 'react-redux';
import { useReduxState } from 'src/rdx/useReduxState';
import { poolCoinsGet } from './poolCoints.actions';

export const usePoolCoins = () => {
  const poolCoinsState = useReduxState('poolCoins');
  const d = useDispatch();

  React.useEffect(() => {
    if (poolCoinsState.data.length < 1 && !poolCoinsState.isLoading) {
      d(poolCoinsGet());
    }
  }, [poolCoinsState, d]);

  return poolCoinsState;
};

//

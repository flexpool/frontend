import React from 'react';
import { Redirect, useRouteMatch } from 'react-router';
import { mineableCoins } from './mineableCoinList';

export const MiningCoinSelectTypePage = () => {
  const {
    params: { ticker },
    path,
    url,
  } = useRouteMatch<{
    ticker?: string;
    hw?: string;
  }>();

  const mineableCoin = React.useMemo(() => {
    return mineableCoins.find((item) => item.ticker === ticker);
  }, [ticker]);

  if (mineableCoin && mineableCoin.hardware.length === 1) {
    console.log(`${path}/${mineableCoin.hardware[0].key}`);
    //
    return <Redirect to={`${url}/${mineableCoin.hardware[0].key}`} />;
  }

  return <Redirect to="/get-started" />;
};

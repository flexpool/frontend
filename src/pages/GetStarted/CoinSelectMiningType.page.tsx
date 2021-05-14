import React from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useRouteMatch } from 'react-router';
import { MineableCoinHardware } from './mineableCoinList';

export const MiningCoinSelectTypePage = () => {
  const {
    params: { ticker },
    url,
  } = useRouteMatch<{
    ticker?: string;
    hw?: string;
  }>();
  const { t } = useTranslation('get-started');

  const poolHw = t(`detail_${ticker}.hardware`, {
    returnObjects: true,
  }) as MineableCoinHardware[];

  if (poolHw.length === 1) {
    return <Redirect to={`${url}/${poolHw[0].key}`} />;
  }

  return <Redirect to="/get-started" />;
};

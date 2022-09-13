import { ChartType } from './types';
import { TFunction } from 'react-i18next';

interface Coin {
  ticker: string;
  hashrateUnit: string;
}

export const getUnitByChartType = (type: ChartType, coin: Coin) => {
  let unit = '';

  switch (type) {
    case 'difficulty':
      if (coin.ticker === 'xch') {
        unit = 'PT';
      } else {
        unit = coin.hashrateUnit.split('/')[0];
      }
      break;

    case 'hashrate':
      if (coin.ticker === 'xch') {
        unit = coin?.hashrateUnit;
      } else {
        unit = coin?.hashrateUnit.split('/')[0] + '/s';
      }
      break;
    case 'blocktime':
      if (coin.ticker === 'zil') {
        unit = '';
      } else {
        unit = 'sec';
      }

      break;
  }

  return unit;
};

export const getReadableChartType = (
  commonT: TFunction<'common'>,
  type: ChartType,
  coin: Coin
) => {
  let readableType = '';

  switch (type) {
    case 'difficulty':
      readableType = commonT('difficulty');
      break;

    case 'hashrate':
      if (coin.hashrateUnit === 'B') {
        readableType = commonT('hashrate_space');
      } else {
        readableType = commonT('hashrate');
      }

      break;

    case 'blocktime':
      if (coin.ticker === 'zil') {
        readableType = commonT('roundtime');
      } else {
        readableType = commonT('blocktime');
      }

      break;
  }

  return readableType;
};

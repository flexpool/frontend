import { ChartType } from './types';

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
      if (coin?.ticker === 'xch') {
        unit = 'PT/s';
      } else {
        unit = coin?.hashrateUnit.split('/')[0] + '/s';
      }
      break;

    case 'blocktime':
      unit = 'sec';
      break;
  }

  return unit;
};

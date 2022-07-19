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
      if (coin.ticker === 'xch') {
        unit = coin?.hashrateUnit;
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

export const getReadableCharType = (type: ChartType, coin: string) => {
  let readableType = '';

  switch (type) {
    case 'difficulty':
      readableType = 'Difficulty';
      break;

    case 'hashrate':
      if (coin === 'xch') {
        readableType = 'Space';
      } else {
        readableType = 'Hashrate';
      }

      break;

    case 'blocktime':
      readableType = 'Block Time';
      break;
  }

  return readableType;
};

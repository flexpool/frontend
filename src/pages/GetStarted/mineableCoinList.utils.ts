import { mineableCoins } from './mineableCoinList';

/**
 * Hardware key describes the type of mining method,
 * e.g. "dual" "GPU" etc...
 */
export const findCoinsByHardwareKey = (key: string) => {
  const coins: { name: string; ticker: string }[] = [];

  mineableCoins.forEach((coin) => {
    coin.hardware.forEach((h) => {
      if (h.key === key) {
        coins.push({
          name: coin.name,
          ticker: coin.ticker,
        });
      }
    });
  });

  return coins;
};

export const findMinableCoinByTicker = (ticker: string) => {
  return mineableCoins.find((coin) => coin.ticker === ticker);
};

export const findMinableCoinHardwareByKey = (ticker: string, key: string) => {
  const coin = findMinableCoinByTicker(ticker);
  return coin?.hardware.find((h) => h.key === key);
};

export const getCoinTickers = () => {
  return mineableCoins.map((c) => c.ticker);
};

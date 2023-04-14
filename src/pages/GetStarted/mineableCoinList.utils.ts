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

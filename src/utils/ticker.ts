export const processTicker = (ticker: string, testnet?: boolean) => {
  ticker = ticker.toUpperCase();
  if (testnet && ticker.length > 0 && ticker[0] == 'T') {
    ticker = 't' + ticker.substring(1);
  }

  return ticker;
};

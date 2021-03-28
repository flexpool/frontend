import { Ticker } from './Ticker.types';

type Si = 'K' | 'M' | 'G' | 'T';

type ApiCoinMarketData = {
  marketCaps: {
    [k in Ticker]: number;
  };
  priceChange: number;
  prices: {
    [k in Ticker]: number;
  };
};

export type ApiPoolCoinFull = {
  algorithm: string;
  applicableHashrateSiPrefixes?: Si[];
  chainData: {
    reward: number;
    difficulty: number;
    hashrate: number;
    blockTime: number;
    dailyRewardPerGigaHasSec: number;
  };
  decimalPlaces: number;
  defaultHashrateSiPrefix: Si;
  hashrate: number;
  marketData: ApiCoinMarketData;
  minerCount: number;
  name: string;
  ticker: Ticker;
  websiteLink: string;
  whitepaperLibk: string;
};

export type ApiPoolCoin = {
  decimalPlaces: number;
  lowestMinPayoutThreshold: number;
  name: String;
  shareDifficulty: number;
  ticker: Ticker;
  transactionSize: number;
};

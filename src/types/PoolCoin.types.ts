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

export type ApiPoolCoin = {
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
  ticker: string;
  websiteLink: string;
  whitepaperLibk: string;
};

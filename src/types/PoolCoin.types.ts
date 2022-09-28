import { Ticker } from './Ticker.types';

type Si = 'k' | 'M' | 'G' | 'T' | 'P';

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
  hashrateUnit: string;
  difficultyFactor: number;
  applicableHashrateSiPrefixes: Si[];
  chainData: {
    reward: number;
    difficulty: number;
    hashrate: number;
    blockTime: number;
    dailyRewardPerGigaHashSec: number;
  };
  decimalPlaces: number;
  defaultHashrateSiPrefix: Si;
  hashrate: number;
  marketData: ApiCoinMarketData;
  minerCount: number;
  name: string;
  ticker: Ticker;
  websiteLink: string;
  whitepaperLink: string;
  isDual: boolean;
  payoutsOnly: boolean;
};

export type ApiPoolCoin = {
  decimalPlaces: number;
  lowestMinPayoutThreshold: number;
  name: string;
  shareDifficulty: number;
  ticker: Ticker;
  transactionSize: number;
  difficultyFactor: number;
  hashrateUnit: string;
  payoutsOnly: boolean;
};

export type ApiBlock = {
  confirmed: boolean;
  difficulty: number;
  hash: string;
  luck: number;
  miner: string;
  number: number;
  region: string;
  reward: number;
  roundTime: number;
  timestamp: number;
  type: 'block' | 'uncle' | 'orphan';
};

export type ApiBlocks = {
  totalItems: number;
  totalPages: number;
  data: ApiBlock[];
};

export type Distribution = {
  hashrate: number;
  hashrateLowerThan: number;
}[];

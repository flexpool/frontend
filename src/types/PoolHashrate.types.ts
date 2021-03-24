import { ApiRegion } from './Region.types';

export type ApiPoolHashrateItem = {
  minerCount: number;
  regions: {
    [key in ApiRegion]: number;
  };
  timestamp: number;
  total: number;
};

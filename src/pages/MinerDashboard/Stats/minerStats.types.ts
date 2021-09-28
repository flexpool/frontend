export type AverageEffectivePeriods = {
  '6': number;
  '12': number;
};

export type HashrateChartDataItem = {
  date: Date;
  effectiveHashrate: number;
  averageEffectiveHashrate: number;
  reportedHashrate: number;
};

export type SharesChartDataItem = {
  date: Date;
  validShares: number;
  staleShares: number;
  invalidShares: number;
};

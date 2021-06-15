export type ApiPoolStats = {
  averageLuck: number;
  averageHashrate: number;
  hashrate: {
    total: number;
  };
  minerCount: number;
  workerCount: number;
};

export type ApiBlocksChartItem = {
  blockCount: number;
  difficulty: number;
  rewards: number;
  timestamp: number;
  luck: number;
};

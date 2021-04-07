export type ApiPoolStats = {
  averageLuck: number;
  averageHashrate: number;
  hashrate: {
    total: number;
  };
  minerCount: number;
  workerCount: number;
};

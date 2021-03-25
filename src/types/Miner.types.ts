export type ApiMinerDetails = {
  clientIPAddress: string;
  firstJoined: number;
  ipAddress: string;
  maxFeePrice: number;
  notificationPreferences: null;
  notifications: { email: string | null };
  payoutLimit: number;
  poolDonation: number;
};

export type ApiMinerHeaderStats = {
  approximateBlockShare: number;
  balance: number;
  balanceCountervalue: number;
  countervaluePrice: number;
  roundShare: number;
  workersOffline: number;
  workersOnline: number;
};

export type ApiMinerStats = {
  averageEffectiveHashrate: number;
  currentEffectiveHashrate: number;
  invalidShares: number;
  reportedHashrate: number;
  staleShares: number;
  validShares: number;
};

export type ApiMinerWorker = {
  count: number;
  currentEffectiveHashrate: number;
  invalidShares: number;
  isOnline: boolean;
  lastSeen: number;
  name: string;
  reportedHashrate: number;
  staleShares: number;
  validShares: number;
};

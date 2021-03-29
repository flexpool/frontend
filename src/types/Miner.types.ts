export type ApiMinerSettings = {
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

export type ApiMinerPayment = {
  duration: number;
  fee: number;
  feePercent: number;
  hash: string;
  timestamp: number;
  value: number;
};
export type ApiMinerPayments = {
  countervalue: number;
  data: ApiMinerPayment[];
  totalItems: number;
  totalPages: number;
};

export type ApiMinerReward = {
  timestamp: number;
  totalRewards: number;
};

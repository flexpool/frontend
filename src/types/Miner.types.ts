export type ApiMinerSettings = {
  clientIPAddress: string;
  firstJoined: number;
  ipAddress: string;
  currentNetworkFeePrice: number;
  maxFeePrice: number;
  notificationPreferences: null | {
    payoutNotifications: boolean;
    workersOfflineNotifications: boolean;
    workerOfflineDetectionDuration: number;
  };
  notifications: { email: string | null };
  payoutLimit: number;
  poolDonation: number;
  network: string;
};

export type ApiMinerHeaderStats = {
  averageBlockShare: number;
  balance: number;
  balanceCountervalue: number;
  countervaluePrice: number;
  dailyRewardsPerGh: number;
  roundShare: number;
};

export type ApiMinerBalance = {
  balance: number;
  balanceCountervalue: number;
  price: number;
};

export type ApiMinerRoundShare = number;

export type ApiMinerStats = {
  averageEffectiveHashrate: number;
  currentEffectiveHashrate: number;
  invalidShares: number;
  reportedHashrate: number;
  staleShares: number;
  validShares: number;
};

export type ApiMinerStatsChartDataPoint = {
  averageEffectiveHashrate: number;
  effectiveHashrate: number;
  invalidShares: number;
  reportedHashrate: number;
  staleShares: number;
  timestamp: number;
  validShares: number;
};

export type ApiMinerWorker = {
  count: number;
  currentEffectiveHashrate: number;
  averageEffectiveHashrate: number;
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
  countervalue: number;
  timestamp: number;
  value: number;
  confirmed: boolean;
  confirmedTimestamp: number;
  network: string;
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

export type ApiMinerRewards = {
  price: number;
  data: ApiMinerReward[];
};

export type ApiMinerFarmerDifficulty = {
  difficulty: number;
  pendingDifficulty: number | null;
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

export type ApiPaymentStats = {
  countervalue: number;
  lastPayment: {
    duration: number;
    fee: number;
    feePercent: number;
    hash: string;
    timestamp: number;
    value: number;
  } | null;
  stats: {
    averageDuration: number;
    averageFee: number;
    averageFeePercent: number;
    averageValue: number;
    totalFees: number;
    totalPaid: number;
    transactionCount: number;
  } | null;
};

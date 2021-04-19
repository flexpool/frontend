import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';

const feePayoutLimitDetails = {
  eth: {
    unit: 'Gwei',
    title: 'Gas Price',
    multiplier: 1000000000,
  },
};

export const useFeePayoutLimitDetails = (coin?: string) => {
  const globalCoinTicker = useActiveCoinTicker();
  const activeCoinTicker = coin || globalCoinTicker;

  if (!activeCoinTicker) {
    return null;
  }

  if (activeCoinTicker in feePayoutLimitDetails) {
    return feePayoutLimitDetails[activeCoinTicker as keyof typeof feePayoutLimitDetails];
  }
  return null;
};

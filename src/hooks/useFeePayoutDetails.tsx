import { useActiveCoinTicker } from 'src/rdx/localSettings/localSettings.hooks';

const feePayoutLimitDetails = {
  eth: {
    unit: 'Gwei',
    title: 'Gas Price',
    multiplier: 1e9,
  },
  etc: {
    unit: 'Gwei',
    title: 'Gas Price',
    multiplier: 1e9,
  },
  xch: {
    unit: 'mojo/CU',
    title: 'Cost Unit Price',
    multiplier: 1,
  },
  btc: {
    unit: 'sat/b',
    title: 'Sats per Byte',
    multiplier: 1,
  },
  zil: {
    unit: 'ZIL',
    title: 'Gas Price',
    multiplier: 1e12,
  },
};

export const useFeePayoutLimitDetails = (coin?: string) => {
  const globalCoinTicker = useActiveCoinTicker();
  const activeCoinTicker = coin || globalCoinTicker;

  if (!activeCoinTicker) {
    return null;
  }

  if (activeCoinTicker in feePayoutLimitDetails) {
    return feePayoutLimitDetails[
      activeCoinTicker as keyof typeof feePayoutLimitDetails
    ];
  }
  return null;
};

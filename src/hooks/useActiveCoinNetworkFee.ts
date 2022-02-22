import { useActiveCoinTicker } from '@/rdx/localSettings/localSettings.hooks';
import { isNumber, round } from 'lodash';
import { useLocalizedActiveCoinValueConverter } from './useDisplayReward';
import { useFeePayoutLimitDetails } from './useFeePayoutDetails';
import useMinerDetailsQuery from '@/hooks/api/useMinerDetailsQuery';

const useActiveCoinNetworkFee = (
  coin: string | undefined = undefined,
  address: string,
  { precision = 0 } = {}
) => {
  const activeCoinTicker = useActiveCoinTicker();
  const activeCoinConverter = useLocalizedActiveCoinValueConverter();
  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);

  const { data: minerDetails } = useMinerDetailsQuery({
    coin: coin,
    address,
  });

  const networkFeeValue = activeCoinConverter(
    minerDetails?.currentNetworkFeePrice
  );

  if (
    isNumber(networkFeeValue) &&
    feeDetails &&
    isNumber(feeDetails.multiplier)
  ) {
    return round(networkFeeValue * feeDetails.multiplier, precision);
  }

  return null;
};

export default useActiveCoinNetworkFee;

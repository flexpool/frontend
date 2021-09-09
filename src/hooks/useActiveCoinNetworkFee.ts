import { useActiveCoinTicker } from '@/rdx/localSettings/localSettings.hooks';
import { useReduxState } from '@/rdx/useReduxState';
import { round } from 'lodash';
import { useLocalizedActiveCoinValueConverter } from './useDisplayReward';
import { useFeePayoutLimitDetails } from './useFeePayoutDetails';

/**
 * useActiveCoinNetworkFee returns the network fee for the current selected coin
 * @returns {number} Network fee
 */
const useActiveCoinNetworkFee = (precision = 0) => {
  const minerDetailsState = useReduxState('minerDetails');
  const activeCoinTicker = useActiveCoinTicker();
  const activeCoinConverter = useLocalizedActiveCoinValueConverter();
  const settings = minerDetailsState.data;
  const networkFeeValue = activeCoinConverter(settings?.currentNetworkFeePrice);
  const feeDetails = useFeePayoutLimitDetails(activeCoinTicker);

  if (networkFeeValue && feeDetails?.multiplier) {
    return round(networkFeeValue * feeDetails.multiplier, precision);
  }

  return null;
};

export default useActiveCoinNetworkFee;
